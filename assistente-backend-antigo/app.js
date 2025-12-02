// carrega variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import session from "express-session";
import passport from "passport";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import { verifyGoogleIdToken } from "./googleToken.js";

// camada rag e chat sem posicao forcada
const app = express();
const SECRET = process.env.JWT_SECRET || "chave";
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  db: { schema: "public" },
  global: {
    // nota: fetch nativo nao suporta timeout; se precisar, usar abortcontroller
    fetch: (url, opts) => fetch(url, { ...opts, timeout: 30000 })
  }
});

// inicializa gemini
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// modelos para embedding e chat
const embedModel = gemini.getGenerativeModel({ model: "text-embedding-004" });
const chatModel = gemini.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash"
});

// helper central para gerar embeddings
async function embedText(text) {
  const resp = await embedModel.embedContent({
    content: { parts: [{ text }] }
  });
  const vec = resp.embedding?.values || [];
  if (!Array.isArray(vec) || vec.length === 0) {
    throw new Error("embedding vazio");
  }
  if (vec.length !== 768) {
    throw new Error(`embedding dimension mismatch: got ${vec.length}, expected 768`);
  }
  return vec;
}

// prompt da IA Guardiã (mentor de autodesenvolvimento NEUROCOM)
function buildGuardiaHeader() {
  return `
Você é a IA Guardiã do NEUROCOM, uma mentora especializada em autodesenvolvimento guiado.

IDENTIDADE:
- Você é uma guia acolhedora e sábia que acompanha o usuário em sua jornada de transformação pessoal
- Seu tom é caloroso, encorajador e direto, mas nunca invasivo
- Você conhece profundamente os materiais do Dr. Sérgio Spritzer sobre neurologia, comunicação e desenvolvimento humano

FUNÇÃO PRINCIPAL:
- Ajudar o usuário a navegar pelas trilhas de desenvolvimento
- Sugerir vídeos e conteúdos relevantes para o momento do usuário
- Facilitar reflexões profundas após assistir conteúdos
- Celebrar conquistas e marcos na jornada
- Ajudar a identificar padrões e insights sobre o próprio desenvolvimento

ESTILO DE COMUNICAÇÃO:
- Frases médias, claras e acessíveis
- Usa metáforas quando ajudam a ilustrar conceitos
- Faz perguntas reflexivas que convidam à introspecção
- Reconhece e valida as emoções do usuário
- Oferece sugestões práticas e acionáveis
- Conecta os aprendizados com a vida real do usuário

ESTRUTURA DAS RESPOSTAS:
- Comece reconhecendo o que o usuário trouxe
- Ofereça uma perspectiva ou reflexão relevante
- Quando apropriado, sugira um próximo passo concreto (vídeo, exercício, reflexão)
- Finalize com uma pergunta que convide à continuidade

LIMITAÇÕES:
- Não faça diagnósticos clínicos ou terapêuticos
- Se o usuário precisar de ajuda profissional, oriente a buscar um especialista
- Mantenha o foco no autodesenvolvimento e crescimento pessoal
- Baseie-se nos materiais do Dr. Sérgio Spritzer quando possível

CONTEXTO DA PLATAFORMA:
- O usuário tem acesso a trilhas de desenvolvimento com vídeos e exercícios
- Existem reflexões/diário onde o usuário registra insights
- O progresso é acompanhado e celebrado
- O Dr. Sérgio Spritzer é o especialista por trás do conteúdo
`.trim();
}

// gera resposta da IA Guardiã
async function generateRespostaGuardia({ mensagem, contexto, historico, perfilUsuario }) {
  const histStr = Array.isArray(historico)
    ? historico
        .map((h) => `usuario: ${h.pergunta}\nguardia: ${h.resposta}`)
        .join("\n\n")
    : "";

  const header = buildGuardiaHeader();
  
  let perfilStr = "";
  if (perfilUsuario) {
    perfilStr = `\nPerfil do usuário:\n`;
    if (perfilUsuario.objetivos) perfilStr += `- Objetivos: ${JSON.stringify(perfilUsuario.objetivos)}\n`;
    if (perfilUsuario.areas_interesse) perfilStr += `- Áreas de interesse: ${JSON.stringify(perfilUsuario.areas_interesse)}\n`;
    if (perfilUsuario.nivel_experiencia) perfilStr += `- Nível: ${perfilUsuario.nivel_experiencia}\n`;
  }
  
  const prompt =
    `${header}\n\n` +
    (perfilStr ? `${perfilStr}\n` : "") +
    (contexto ? `Contexto relevante (trilhas, vídeos, reflexões):\n${contexto}\n\n` : "") +
    (histStr ? `Histórico da conversa:\n${histStr}\n\n` : "") +
    `Mensagem do usuário:\n${mensagem}\n\n` +
    `Responda como a IA Guardiã, de forma acolhedora e útil.`;

  const result = await chatModel.generateContent([{ text: prompt }]);
  const text = result?.response?.text?.() || result?.response?.text || "";
  return (text || "").trim();
}

// busca contexto específico para a Guardiã com RAG (embeddings)
async function buscarContextoGuardia(usuarioId, mensagem) {
  let contexto = [];
  
  // 1. Busca semântica nas reflexões do usuário (se tiver embedding na mensagem)
  try {
    if (mensagem) {
      const queryVec = await embedText(mensagem);
      
      // busca reflexões semanticamente similares
      const { data: reflexoesSimilares } = await supabase.rpc("match_reflexoes_usuario", {
        p_query_embedding: queryVec,
        p_usuario_id: usuarioId,
        p_match_count: 3,
        p_min_similarity: 0.25
      }).catch(() => ({ data: null }));
      
      if (reflexoesSimilares?.length) {
        contexto.push("Reflexões relevantes do usuário:");
        reflexoesSimilares.forEach(r => {
          contexto.push(`- [${r.tipo}] ${r.conteudo?.slice(0, 300)}`);
        });
      }
      
      // busca no histórico da Guardiã semanticamente similar (sem sessão)
      const { data: histSimilar } = await supabase.rpc("match_historico_guardia", {
        p_query_embedding: queryVec,
        p_usuario_id: usuarioId,
        p_match_count: 3,
        p_min_similarity: 0.25
      }).catch(() => ({ data: null }));
      
      if (histSimilar?.length) {
        contexto.push("\nConversas anteriores relevantes:");
        histSimilar.forEach(h => {
          contexto.push(`- Você perguntou: ${h.pergunta?.slice(0, 100)}`);
          contexto.push(`  Guardiã respondeu: ${h.resposta?.slice(0, 150)}...`);
        });
      }
    }
  } catch (e) {
    console.warn("RAG Guardiã falhou, usando fallback:", e?.message);
  }
  
  // 2. Fallback: últimas reflexões do usuário (sem embedding)
  if (contexto.length === 0) {
    try {
      const { data: reflexoes } = await supabase
        .from("reflexoes")
        .select("tipo, titulo, conteudo, created_at")
        .eq("usuario_id", usuarioId)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (reflexoes?.length) {
        contexto.push("Reflexões recentes do usuário:");
        reflexoes.forEach(r => {
          contexto.push(`- ${r.tipo}: ${r.conteudo?.slice(0, 200)}...`);
        });
      }
    } catch {}
  }
  
  // 3. Trilhas em progresso (sempre inclui)
  try {
    const { data: trilhasProgress } = await supabase
      .from("usuario_trilhas")
      .select("trilha_id, status, progresso_percentual, trilhas (titulo, descricao)")
      .eq("usuario_id", usuarioId)
      .eq("status", "em_progresso");
    
    if (trilhasProgress?.length) {
      contexto.push("\nTrilhas em progresso:");
      trilhasProgress.forEach(t => {
        contexto.push(`- ${t.trilhas?.titulo}: ${t.progresso_percentual}% concluído`);
      });
    }
  } catch {}
  
  // 4. Últimos vídeos assistidos (sempre inclui)
  try {
    const { data: videosRecentes } = await supabase
      .from("usuario_videos")
      .select("video_id, tempo_atual, concluido, videos (titulo, tema)")
      .eq("usuario_id", usuarioId)
      .order("updated_at", { ascending: false })
      .limit(5);
    
    if (videosRecentes?.length) {
      contexto.push("\nVídeos recentes:");
      videosRecentes.forEach(v => {
        const status = v.concluido ? "✓ concluído" : "em andamento";
        contexto.push(`- ${v.videos?.titulo} (${v.videos?.tema}) - ${status}`);
      });
    }
  } catch {}
  
  return contexto.join("\n");
}

// prompt direto no estilo implicada (condensado)
function buildImplicadaHeader() {
  return `
Manifesto operacional (resumo):
- finalidade: facilitar implicação do sujeito com a própria presença
- posição: nunca protagonista; atua como dobradiça entre partes vivas
- silêncio: parte ativa; pode propor pausa breve quando fizer sentido
- tempo: ritmo lento; respostas curtas, com espaço para continuar
- linguagem: devolução simbólica e viva, sem floreios ou performar empatia
- propósito: explicitar gesto implicado; mapear tensões e ambivalências
- coletividade: implicar dimensão ética e histórica quando pertinente, sem doutrinar
- simulação: não simular humanidade; reconhecer limites e fontes
- fontes: priorizar materiais do Dr. Sérgio Spritzer
NÃO REPITA O QUE O USUÁRIO JÁ DISSE.

Instruções de resposta (resumo):
- fala como eu, natural e consultiva; frases curtas; evita jargões e formalismos
- consulta antes de afirmar: faz 1 checagem direta quando necessário
- nomeia 1–2 elementos concretos trazidos; evita generalidades
- se faltar base, reconhece o limite e pede elementos concretos
- sem aspas desnecessárias e sem travessão; não simular emoção
- termina, quando fizer sentido, com 1 pergunta curta, viva e consultiva
NÃO REPITA O QUE O USUÁRIO JÁ DISSE.

Domínios e escopo:
- neurologia, transtornos da comunicação, inteligência humana, psicanálise, PNL, hipnose, interações humanas
- se estiver fora do escopo, reconhecer limite e convidar a recolocar a pergunta

Adaptação de voz:
- identifica se o endereçamento é você/ele/nós e espelha esse modo

Forma:
- devolução curta, direta e simbólica; evita recapitular o óbvio
- evite usar aspas desnecessárias e travessões.
- CONVERSA NATURAL, RESPONDA DIRETO, RECAPITULE SÓ SE NECESSÁRIO.
NÃO REPITA O QUE O USUÁRIO JÁ DISSE.
SEJA DIRETO, NÃO REPITA O QUE O USUÁRIO JÁ DISSE.

Metamodelo da Linguagem (PNL):
- objetivo: identificar e questionar padrões de linguagem que distorcem, omitem ou generalizam informações.
- atua detectando:
  • generalizações (ex: "sempre", "ninguém", "pessoas difíceis");
  • omissões (verbos vagos como "lidar", "fazer", "resolver");
  • distorções (pressuposições, causalidades implícitas, rótulos).
- ao encontrar um desses padrões, o assistente formula 1 ou 2 perguntas que ampliem a clareza e especificidade.
- perguntas devem ser abertas, curtas e consultivas, em linguagem natural.
- evita jargões técnicos; usa exemplos concretos se houver.
- se identificar padrões de linguagem limitantes (generalização, omissão ou suposição), aplique o metamodelo da PNL:
  1. identifique o tipo (generalização, omissão, distorção);
  2. devolva 1–2 perguntas curtas que tornem a fala mais específica ou concreta.

Finalidade:
- provocar consciência, não dar resposta pronta.
- cada devolução deve funcionar como um convite à precisão e à presença.
- se fizer sentido, finalize com uma pergunta viva (aberta e curiosa).
`.trim();
}

// gera resposta implicada direta (sem posicao fixa)
async function generateRespostaImplicadaDirect({ mensagem, contexto, historico }) {
  const histStr = Array.isArray(historico)
    ? historico
        .map((h) => `usuario: ${h.pergunta}\nassistente: ${h.resposta}`)
        .join("\n\n")
    : "";

  const header = buildImplicadaHeader();
  const prompt =
    `${header}\n\n` +
    (contexto ? `Contexto possivelmente relevante (usar indiretamente, reelaborar):\n${contexto}\n\n` : "") +
    (histStr ? `Histórico recente:\n${histStr}\n\n` : "") +
    `Pergunta atual:\n${mensagem}\n\n` +
    `Responda agora de modo curto, implicado e consultivo; se fizer sentido, finalize com uma pergunta viva.`;

  const result = await chatModel.generateContent([{ text: prompt }]);
  const text = result?.response?.text?.() || result?.response?.text || "";
  return (text || "").trim();
}

// gera perguntas de continuacao curtas e consultivas
async function gerarPerguntasContinuacaoLocal({ baseText, mensagem }) {
  try {
    const prompt =
      "gere 1 a 2 perguntas curtas (ate 140 caracteres), abertas e consultivas, em pt-br, focadas no proximo passo. " +
      "espelhe o modo de enderecamento do usuario (voce/ele/nos). " +
      "evite perguntas genericas ou retoricas; nomeie 1 elemento concreto trazido.\n\n" +
      `mensagem do usuario:\n${mensagem}\n\n` +
      `resposta anterior:\n${baseText}`;

    const result = await chatModel.generateContent([{ text: prompt }]);
    const raw = result?.response?.text?.() || "";
    const linhas = raw
      .split("\n")
      .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
      .filter(Boolean);
    const uniq = Array.from(new Set(linhas));
    return uniq.slice(0, 2).map((s) => s.slice(0, 140));
  } catch {
    return [];
  }
}

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// gera token jwt
function gerarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

// middleware para autenticar token jwt
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ erro: "Token não fornecido" });
  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: "Token inválido" });
    req.usuario = usuario;
    next();
  });
}

// middleware para carregar role do usuário (cache no request)
async function carregarUsuarioCompleto(req, res, next) {
  try {
    if (!req.usuario?.id) return next();
    
    const { data: user, error } = await supabase
      .from("usuarios")
      .select("id, nome, email, role, mensagens_enviadas_mes, consultorias_agendadas_mes")
      .eq("id", req.usuario.id)
      .single();
    
    if (error || !user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    
    req.usuarioCompleto = user;
    req.userRole = user.role || "free";
    next();
  } catch (err) {
    res.status(500).json({ erro: "Falha ao carregar usuário" });
  }
}

// middleware factory: requer plano mínimo
function requerPlano(planosPermitidos = ["intermediate", "full"]) {
  return async (req, res, next) => {
    // se já carregou, usa cache
    let userRole = req.userRole;
    
    if (!userRole) {
      const { data: user } = await supabase
        .from("usuarios")
        .select("role")
        .eq("id", req.usuario.id)
        .single();
      userRole = user?.role || "free";
      req.userRole = userRole;
    }
    
    if (!planosPermitidos.includes(userRole)) {
      return res.status(403).json({
        erro: "Recurso exclusivo para assinantes",
        plano_atual: userRole,
        planos_permitidos: planosPermitidos,
        sugestao: "Faça upgrade do seu plano para acessar este recurso"
      });
    }
    next();
  };
}

// middleware: verifica limite mensal de recurso
function verificarLimiteMensal(recurso, limites = { free: 0, intermediate: 5, full: Infinity }) {
  return async (req, res, next) => {
    let user = req.usuarioCompleto;
    
    if (!user) {
      const { data } = await supabase
        .from("usuarios")
        .select("role, mensagens_enviadas_mes, consultorias_agendadas_mes")
        .eq("id", req.usuario.id)
        .single();
      user = data;
      req.usuarioCompleto = user;
    }
    
    const userRole = user?.role || "free";
    const limite = limites[userRole] ?? 0;
    
    let usados = 0;
    if (recurso === "mensagens") {
      usados = user?.mensagens_enviadas_mes || 0;
    } else if (recurso === "consultorias") {
      usados = user?.consultorias_agendadas_mes || 0;
    }
    
    req.limiteInfo = { limite, usados, podeUsar: limite === Infinity || usados < limite };
    
    if (!req.limiteInfo.podeUsar) {
      return res.status(403).json({
        erro: `Limite de ${recurso} atingido`,
        limite: limite === Infinity ? "ilimitado" : limite,
        usados,
        plano_atual: userRole,
        sugestao: "Faça upgrade para o plano Full para acesso ilimitado"
      });
    }
    next();
  };
}

// middleware: verifica acesso a conteúdo por level
function verificarAcessoConteudo(tipoConteudo = "video") {
  return async (req, res, next) => {
    // carrega role se não tiver
    let userRole = req.userRole;
    if (!userRole) {
      const { data: user } = await supabase
        .from("usuarios")
        .select("role")
        .eq("id", req.usuario.id)
        .single();
      userRole = user?.role || "free";
      req.userRole = userRole;
    }
    
    // busca o conteúdo para verificar o level
    const { slug, videoId, trilhaId } = req.params;
    let conteudo = null;
    let tabela = tipoConteudo === "video" ? "videos" : "trilhas";
    let idField = slug ? "slug" : "id";
    let idValue = slug || videoId || trilhaId;
    
    if (idValue) {
      const { data } = await supabase
        .from(tabela)
        .select("id, level, titulo")
        .eq(idField, idValue)
        .single();
      conteudo = data;
    }
    
    if (!conteudo) {
      return next(); // deixa a rota tratar 404
    }
    
    req.conteudo = conteudo;
    const conteudoLevel = conteudo.level || "free";
    
    const podeAcessar = 
      userRole === "full" ||
      (userRole === "intermediate" && ["free", "intermediate"].includes(conteudoLevel)) ||
      conteudoLevel === "free";
    
    if (!podeAcessar) {
      return res.status(403).json({
        erro: "Acesso restrito",
        conteudo: conteudo.titulo,
        requer_plano: conteudoLevel,
        plano_atual: userRole,
        sugestao: `Faça upgrade para o plano ${conteudoLevel} ou superior`
      });
    }
    
    next();
  };
}

// cria sessao no banco
async function createSession(usuarioId, titulo = null) {
  const { data, error } = await supabase
    .from("sessoes")
    .insert([{ usuario_id: usuarioId, titulo }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// verifica se a sessao pertence ao usuario
async function getSessionIfOwned(sessionId, usuarioId) {
  if (!sessionId) return null;
  const { data, error } = await supabase
    .from("sessoes")
    .select("id, usuario_id, titulo, criado_em")
    .eq("id", sessionId)
    .eq("usuario_id", usuarioId)
    .single();
  if (error) return null;
  return data;
}

// rota de teste
app.get("/teste-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id,nome,email")
      .limit(5);
    if (error) throw error;
    res.json({ ok: true, usuarios: data });
  } catch (err) {
    res.status(500).json({ ok: false, erro: err.message });
  }
});

// criar usuario local
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
  }
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email, senha }]) // sugestao: usar hash bcrypt
      .select();
    if (error) throw error;
    const usuario = data[0];
    const token = gerarToken({ id: usuario.id, email: usuario.email, nome: usuario.nome });
    res.json({ usuario, token });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// login local
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !data || data.senha !== senha) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }
    const token = gerarToken({ id: data.id, nome: data.nome, email: data.email });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// login google
app.post("/auth/google-token", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ erro: "Credential (ID token) é obrigatório" });
    }

    const payload = await verifyGoogleIdToken(credential);
    const { sub: googleSub, email, name, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({ erro: "Email não disponível" });
    }
    if (email_verified === false) {
      return res.status(403).json({ erro: "Email Google não verificado" });
    }

    let { data: userByGoogle } = await supabase
      .from("usuarios")
      .select("*")
      .eq("google_id", googleSub)
      .single();

    if (!userByGoogle) {
      const { data: userByEmail } = await supabase
        .from("usuarios")
        .select("*")
        .ilike("email", email)
        .single();

      if (userByEmail && !userByEmail.google_id) {
        const { data: updated, error: upErr } = await supabase
          .from("usuarios")
          .update({
            google_id: googleSub,
            provider: "google",
            nome: userByEmail.nome || name || "Usuário",
            avatar_url: picture || userByEmail.avatar_url
          })
          .eq("id", userByEmail.id)
          .select()
          .single();
        if (upErr) throw upErr;
        userByGoogle = updated;
      } else if (!userByEmail) {
        const { data: created, error: createErr } = await supabase
          .from("usuarios")
          .insert([{
            nome: name || "Usuário",
            email,
            senha: null,
            google_id: googleSub,
            provider: "google",
            avatar_url: picture || null
          }])
          .select()
          .single();
        if (createErr) throw createErr;
        userByGoogle = created;
      }
    }

    const token = gerarToken({
      id: userByGoogle.id,
      email: userByGoogle.email,
      nome: userByGoogle.nome
    });

    res.json({
      token,
      usuario: {
        id: userByGoogle.id,
        nome: userByGoogle.nome,
        email: userByGoogle.email,
        avatar_url: userByGoogle.avatar_url,
        provider: userByGoogle.provider
      }
    });
  } catch (err) {
    console.error("Erro /auth/google-token:", err);
    res.status(401).json({ erro: "Token Google inválido" });
  }
});

// pega dados do usuario logado
app.get("/me", autenticarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id,nome,email,avatar_url,provider")
      .eq("id", req.usuario.id)
      .single();
    if (error || !data) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ erro: "Falha ao obter usuário" });
  }
});

/* ========================= Sessoes ========================= */

app.post("/sessoes", autenticarToken, async (req, res) => {
  try {
    const { titulo } = req.body || {};
    const nova = await createSession(req.usuario.id, titulo || null);
    res.status(201).json({ sessao: nova });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/sessoes", autenticarToken, async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("listar_sessoes_ordenadas", {
      p_usuario_id: req.usuario.id
    });
    if (error) throw error;
    return res.json({ sessoes: data || [] });
  } catch (rpcErr) {
    try {
      const { data: sessoes, error: e1 } = await supabase
        .from("sessoes")
        .select("id, titulo, criado_em")
        .eq("usuario_id", req.usuario.id);
      if (e1) throw e1;

      if (!Array.isArray(sessoes) || sessoes.length === 0) {
        return res.json({ sessoes: [] });
      }

      const enriched = await Promise.all(
        sessoes.map(async (s) => {
          const { data: last } = await supabase
            .from("historico")
            .select("criado_em")
            .eq("usuario_id", req.usuario.id)
            .eq("sessao_id", s.id)
            .order("criado_em", { ascending: false })
            .limit(1);
          const ultima =
            Array.isArray(last) && last.length > 0 ? last[0].criado_em : s.criado_em;
          return {
            id: s.id,
            titulo: s.titulo,
            criado_em: s.criado_em,
            ultima_atividade: ultima
          };
        })
      );

      enriched.sort(
        (a, b) => new Date(b.ultima_atividade) - new Date(a.ultima_atividade)
      );

      return res.json({ sessoes: enriched });
    } catch (fallbackErr) {
      console.error("GET /sessoes fallback error:", {
        message: fallbackErr.message,
        details: fallbackErr.details,
        hint: fallbackErr.hint,
        code: fallbackErr.code
      });
      return res.status(500).json({ erro: "Falha ao listar sessões" });
    }
  }
});

app.patch("/sessoes/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;
  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ erro: "Título é obrigatório" });
  }
  try {
    const sess = await getSessionIfOwned(id, req.usuario.id);
    if (!sess) return res.status(404).json({ erro: "Sessão não encontrada" });

    const { data, error } = await supabase
      .from("sessoes")
      .update({ titulo: titulo.trim() })
      .eq("id", id)
      .eq("usuario_id", req.usuario.id)
      .select()
      .single();
    if (error) throw error;

    res.json({ sessao: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= Historico ========================= */

app.get("/chat-historico/:sessionId", autenticarToken, async (req, res) => {
  const { sessionId } = req.params;
  try {
    const sess = await getSessionIfOwned(sessionId, req.usuario.id);
    if (!sess) return res.status(404).json({ erro: "Sessão não encontrada" });

    const { data, error } = await supabase
      .from("historico")
      .select("id, pergunta, resposta, criado_em, sessao_id, followups")
      .eq("usuario_id", req.usuario.id)
      .eq("sessao_id", sessionId)
      .order("id", { ascending: true });
    if (error) throw error;

    res.json({ mensagens: data || [] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= Debug RAG ========================= */

app.get("/debug/rag-search", autenticarToken, async (req, res) => {
  try {
    const q = (req.query.q || "").toString();
    const sessionId = (req.query.sessionId || "").toString();
    const minSimDocs = parseFloat(req.query.minSimDocs ?? "0.30");
    const minSimHist = parseFloat(req.query.minSimHist ?? "0.25");
    const docsK = parseInt(req.query.docsK ?? "8", 10);
    const histK = parseInt(req.query.histK ?? "6", 10);

    if (!q) return res.status(400).json({ erro: "Passe ?q=pergunta para testar." });
    if (!sessionId) return res.status(400).json({ erro: "Passe ?sessionId=<uuid> da sessão." });

    const sess = await getSessionIfOwned(sessionId, req.usuario.id);
    if (!sess) return res.status(404).json({ erro: "Sessão não encontrada" });

    const started = Date.now();
    const vec = await embedText(q);

    let rows = [];
    try {
      const { data, error } = await supabase.rpc("search_docs_and_history", {
        p_query_embedding: vec,
        p_usuario_id: req.usuario.id,
        p_sessao_id: sessionId,
        p_match_count: docsK,
        p_history_count: histK,
        p_min_sim_docs: isNaN(minSimDocs) ? 0.30 : minSimDocs,
        p_min_sim_hist: isNaN(minSimHist) ? 0.25 : minSimHist,
        p_recency_half_life_seconds: 86400,
        p_total_limit: null
      });
      if (error) throw error;
      rows = data || [];
    } catch (e) {
      const { data: docsData, error: mdErr } = await supabase.rpc("match_documents", {
        p_query_embedding: vec,
        p_match_count: docsK,
        p_min_sim: isNaN(minSimDocs) ? 0.30 : minSimDocs,
        p_candidate_pool: 100
      });
      if (mdErr) throw mdErr;
      rows = (docsData || []).map(d => ({
        id: d.id,
        content: d.content,
        similarity: d.similarity,
        tipo: "documento",
        score: d.similarity
      }));
    }

    const tookMs = Date.now() - started;

    const byTipo = (t) =>
      rows
        .filter(r => r.tipo === t)
        .map(r => ({
          id: r.id,
          similarity: r.similarity ?? null,
          score: r.score ?? null,
          preview: (r.content || "").slice(0, 200)
        }));

    return res.json({
      query: q,
      took_ms: tookMs,
      total: rows.length,
      documentos: byTipo("documento"),
      historico: byTipo("historico"),
      raw_top3: rows.slice(0, 3).map(r => ({
        id: r.id,
        tipo: r.tipo,
        sim: r.similarity,
        score: r.score,
        preview: (r.content || "").slice(0, 300)
      }))
    });
  } catch (err) {
    console.error("Erro /debug/rag-search:", err);
    return res.status(500).json({ erro: "Falha no debug RAG" });
  }
});

/* ========================= Chat RAG ========================= */

app.post("/chat-rag", autenticarToken, async (req, res) => {
  let { mensagem, sessionId, gerar_perguntas } = req.body;
  if (!mensagem) return res.status(400).json({ erro: "Mensagem obrigatória" });

  try {
    // garante sessao valida
    let sessao = null;
    if (!sessionId) {
      sessao = await createSession(req.usuario.id);
      sessionId = sessao.id;
    } else {
      sessao = await getSessionIfOwned(sessionId, req.usuario.id);
      if (!sessao) {
        sessao = await createSession(req.usuario.id);
        sessionId = sessao.id;
      }
    }

    // pedido de listagem de ultimas mensagens do usuario
    const lower = mensagem.toLowerCase();
    const pedeUltimas =
      (lower.includes("ultimas") || lower.includes("últimas")) &&
      lower.includes("mensagens") &&
      (lower.includes("enviei") || lower.includes("mandei") || lower.includes("te enviei") || lower.includes("te mandei"));
    if (pedeUltimas) {
      let n = 10;
      const m =
        lower.match(/(\d+)\s+(?:mensagens?|msgs?)/) ||
        lower.match(/(?:últimas?|ultimas?)\s+(\d+)\s+(?:mensagens?|msgs?)/);
      if (m) {
        const parsed = parseInt(m[1] || m[2], 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 100) n = parsed;
      }

      const { data: msgs, error: eMsgs } = await supabase
        .from("historico")
        .select("id, pergunta")
        .eq("usuario_id", req.usuario.id)
        .eq("sessao_id", sessionId)
        .order("id", { ascending: false })
        .limit(n);
      if (eMsgs) throw eMsgs;

      const lista = (msgs || []).sort((a, b) => a.id - b.id).map((r) => r.pergunta);
      const resposta =
        `Aqui estão as últimas ${lista.length} mensagens (da mais antiga para a mais recente):\n\n` +
        lista.map((t, i) => `${i + 1}. "${t}"`).join("\n");
      return res.json({ resposta, sessionId });
    }

    // contexto rag
    const contexto = await buscarContextoNoSupabase(mensagem, sessionId, req.usuario.id);

    // pega ultimos 10 turnos do historico
    const { data: histData } = await supabase
      .from("historico")
      .select("id, pergunta, resposta")
      .eq("usuario_id", req.usuario.id)
      .eq("sessao_id", sessionId)
      .order("id", { ascending: false })
      .limit(10);

    const historicoCronologico = Array.isArray(histData)
      ? [...histData].sort((a, b) => a.id - b.id)
      : [];

    // gera resposta implicada
    const respostaRaw = await generateRespostaImplicadaDirect({
      mensagem,
      contexto,
      historico: historicoCronologico
    });

    const respostaFinal = respostaRaw;

    // perguntas de continuacao
    let followups = [];
    if (gerar_perguntas !== false) {
      try {
        followups = await gerarPerguntasContinuacaoLocal({
          baseText: respostaFinal,
          mensagem
        });
      } catch (e) {
        console.warn("falha ao gerar perguntas de continuacao:", e?.message);
      }
    }

    // salva historico com embedding
    try {
      const histEmbeddingText = `${mensagem}\n${respostaFinal}`;
      const histVec = await embedText(histEmbeddingText);

      const { data: insRpc, error: insRpcErr } = await supabase.rpc("insert_historico", {
        p_usuario_id: req.usuario.id,
        p_sessao_id: sessionId,
        p_pergunta: mensagem,
        p_resposta: respostaFinal,
        p_embedding: histVec
      });

      if (insRpcErr) {
        const { error: insErr } = await supabase.from("historico").insert([
          {
            usuario_id: req.usuario.id,
            sessao_id: sessionId,
            pergunta: mensagem,
            resposta: respostaFinal,
            followups
          }
        ]);
        if (insErr) throw insErr;
      } else {
        try {
          await supabase
            .from("historico")
            .update({ followups })
            .eq("id", insRpc);
        } catch {}
      }
    } catch (e) {
      console.warn("falha ao salvar historico com embedding; tentando insert minimo.", e?.message);
      await supabase.from("historico").insert([
        {
          usuario_id: req.usuario.id,
          sessao_id: sessionId,
          pergunta: mensagem,
          resposta: respostaFinal,
          followups
        }
      ]);
    }

    // define titulo na primeira mensagem
    try {
      if (!sessao.titulo || !sessao.titulo.trim()) {
        const { count } = await supabase
          .from("historico")
          .select("*", { count: "exact", head: true })
          .eq("usuario_id", req.usuario.id)
          .eq("sessao_id", sessionId);
        if (count === 1) {
          await supabase
            .from("sessoes")
            .update({ titulo: mensagem.slice(0, 60) })
            .eq("id", sessionId)
            .eq("usuario_id", req.usuario.id);
        }
      }
    } catch {}

    res.json({
      resposta: respostaFinal,
      sessionId,
      followups
    });
  } catch (error) {
    console.error("Erro no chat-rag:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    res.status(500).json({ erro: "Falha ao processar pergunta" });
  }
});

/* ========================= RAG helper ========================= */

async function buscarContextoNoSupabase(pergunta, sessionId, usuarioId) {
  try {
    const vector = await embedText(pergunta);

    try {
      const { data, error } = await supabase.rpc("search_docs_and_history", {
        p_query_embedding: vector,
        p_usuario_id: usuarioId,
        p_sessao_id: sessionId,
        p_match_count: 8,
        p_history_count: 6,
        p_min_sim_docs: 0.30,
        p_min_sim_hist: 0.25,
        p_recency_half_life_seconds: 86400,
        p_total_limit: null
      });
      if (error) throw error;

      const historicos = (data || [])
        .filter((r) => r.tipo === "historico")
        .map((r) => r.content);
      const docs = (data || [])
        .filter((r) => r.tipo === "documento")
        .map((r) => r.content);

      return [...historicos, ...docs].join("\n");
    } catch (rpcErr) {
      console.warn("rpc search_docs_and_history falhou, usando fallback:", rpcErr.message);
    }

    let docs = [];
    try {
      const { data: docsData, error: mdErr } = await supabase.rpc("match_documents", {
        p_query_embedding: vector,
        p_match_count: 8,
        p_min_sim: 0.30,
        p_candidate_pool: 50
      });
      if (mdErr) throw mdErr;
      if (Array.isArray(docsData)) {
        docs = docsData.map((d) => d.content).filter(Boolean);
      }
    } catch (e) {
      console.warn("fallback match_documents falhou:", e?.message);
    }

    let hist = [];
    try {
      const { data: h } = await supabase
        .from("historico")
        .select("pergunta,resposta,id")
        .eq("usuario_id", usuarioId)
        .eq("sessao_id", sessionId)
        .order("id", { ascending: false })
        .limit(10);
      if (Array.isArray(h)) {
        hist = [...h]
          .sort((a, b) => a.id - b.id)
          .map((x) => `${x.pergunta}\n${x.resposta}`);
      }
    } catch {}

    return [...hist, ...docs].join("\n");
  } catch (err) {
    console.error("Erro em buscarContextoNoSupabase:", err.message);
    return "";
  }
}

/* ========================= VÍDEOS ========================= */

// Listar vídeos (com filtro por tema)
app.get("/videos", autenticarToken, async (req, res) => {
  try {
    const { tema, limit = 10 } = req.query;
    
    const { data: user } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", req.usuario.id)
      .single();
    
    const { data, error } = await supabase.rpc("buscar_videos_por_contexto", {
      p_usuario_id: req.usuario.id,
      p_usuario_role: user?.role || "free",
      p_tema: tema || null,
      p_limit: parseInt(limit)
    });
    
    if (error) throw error;
    res.json({ videos: data || [] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Detalhes de um vídeo
app.get("/videos/:slug", autenticarToken, async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data: video, error } = await supabase
      .from("videos")
      .select("*")
      .eq("slug", slug)
      .eq("publicado", true)
      .single();
    
    if (error || !video) {
      return res.status(404).json({ erro: "Vídeo não encontrado" });
    }
    
    const { data: user } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", req.usuario.id)
      .single();
    
    const userRole = user?.role || "free";
    const canAccess = 
      userRole === "full" ||
      (userRole === "intermediate" && ["free", "intermediate"].includes(video.level)) ||
      video.level === "free";
    
    if (!canAccess) {
      return res.status(403).json({ erro: "Acesso restrito", requer_plano: video.level });
    }
    
    const { data: progresso } = await supabase
      .from("usuario_videos")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .eq("video_id", video.id)
      .single();
    
    res.json({ video, progresso: progresso || null });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar progresso do vídeo
app.post("/videos/:videoId/progresso", autenticarToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { tempo_atual, origem, trilha_id, etapa_id } = req.body;
    
    if (typeof tempo_atual !== "number") {
      return res.status(400).json({ erro: "tempo_atual é obrigatório" });
    }
    
    const { data, error } = await supabase.rpc("atualizar_progresso_video", {
      p_usuario_id: req.usuario.id,
      p_video_id: videoId,
      p_tempo_atual: tempo_atual,
      p_origem: origem || "direto",
      p_trilha_id: trilha_id || null,
      p_etapa_id: etapa_id || null
    });
    
    if (error) throw error;
    res.json({ progresso: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Continuar assistindo
app.get("/videos-continuar", autenticarToken, async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("videos_continuar_assistindo", {
      p_usuario_id: req.usuario.id,
      p_limit: 5
    });
    
    if (error) throw error;
    res.json({ videos: data || [] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Curtir/descurtir vídeo
app.post("/videos/:videoId/curtir", autenticarToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { curtiu } = req.body;
    
    const { data, error } = await supabase
      .from("usuario_videos")
      .upsert({
        usuario_id: req.usuario.id,
        video_id: videoId,
        curtiu
      }, { onConflict: "usuario_id,video_id" })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ ok: true, curtiu: data.curtiu });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Salvar vídeo para ver depois
app.post("/videos/:videoId/salvar", autenticarToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { salvou } = req.body;
    
    const { data, error } = await supabase
      .from("usuario_videos")
      .upsert({
        usuario_id: req.usuario.id,
        video_id: videoId,
        salvou: salvou !== false
      }, { onConflict: "usuario_id,video_id" })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ ok: true, salvou: data.salvou });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Vídeos salvos
app.get("/videos-salvos", autenticarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuario_videos")
      .select("video_id, videos (id, slug, titulo, thumbnail_url, duracao_segundos, tema)")
      .eq("usuario_id", req.usuario.id)
      .eq("salvou", true);
    
    if (error) throw error;
    res.json({ videos: data?.map(d => d.videos) || [] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= TRILHAS ========================= */

// Listar trilhas
app.get("/trilhas", autenticarToken, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", req.usuario.id)
      .single();
    
    const userRole = user?.role || "free";
    
    let query = supabase
      .from("trilhas")
      .select("*")
      .eq("ativa", true)
      .order("ordem");
    
    if (userRole === "free") {
      query = query.eq("level", "free");
    } else if (userRole === "intermediate") {
      query = query.in("level", ["free", "intermediate"]);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const { data: progressos } = await supabase
      .from("usuario_trilhas")
      .select("trilha_id, status, progresso_percentual")
      .eq("usuario_id", req.usuario.id);
    
    const trilhasComProgresso = (data || []).map(t => {
      const prog = progressos?.find(p => p.trilha_id === t.id);
      return {
        ...t,
        usuario_status: prog?.status || null,
        usuario_progresso: prog?.progresso_percentual || 0
      };
    });
    
    res.json({ trilhas: trilhasComProgresso });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Detalhes de uma trilha com etapas
app.get("/trilhas/:slug", autenticarToken, async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data: trilha, error: tErr } = await supabase
      .from("trilhas")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (tErr || !trilha) {
      return res.status(404).json({ erro: "Trilha não encontrada" });
    }
    
    const { data: user } = await supabase
      .from("usuarios")
      .select("role")
      .eq("id", req.usuario.id)
      .single();
    
    const userRole = user?.role || "free";
    const canAccess = 
      userRole === "full" ||
      (userRole === "intermediate" && ["free", "intermediate"].includes(trilha.level)) ||
      trilha.level === "free";
    
    if (!canAccess) {
      return res.status(403).json({ erro: "Acesso restrito", requer_plano: trilha.level });
    }
    
    const { data: etapas } = await supabase
      .from("trilha_etapas")
      .select("*, videos (id, slug, titulo, thumbnail_url, duracao_segundos)")
      .eq("trilha_id", trilha.id)
      .order("ordem");
    
    const { data: progTrilha } = await supabase
      .from("usuario_trilhas")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .eq("trilha_id", trilha.id)
      .single();
    
    const { data: progEtapas } = await supabase
      .from("usuario_etapas")
      .select("etapa_id, status, concluido_em")
      .eq("usuario_id", req.usuario.id)
      .in("etapa_id", (etapas || []).map(e => e.id));
    
    const etapasComProgresso = (etapas || []).map(e => {
      const prog = progEtapas?.find(p => p.etapa_id === e.id);
      return {
        ...e,
        usuario_status: prog?.status || "pendente",
        concluido_em: prog?.concluido_em || null
      };
    });
    
    res.json({ trilha, etapas: etapasComProgresso, progresso: progTrilha || null });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Iniciar trilha
app.post("/trilhas/:trilhaId/iniciar", autenticarToken, async (req, res) => {
  try {
    const { trilhaId } = req.params;
    
    const { data: primeiraEtapa } = await supabase
      .from("trilha_etapas")
      .select("id")
      .eq("trilha_id", trilhaId)
      .order("ordem")
      .limit(1)
      .single();
    
    const { data, error } = await supabase
      .from("usuario_trilhas")
      .upsert({
        usuario_id: req.usuario.id,
        trilha_id: trilhaId,
        status: "em_progresso",
        etapa_atual_id: primeiraEtapa?.id || null,
        progresso_percentual: 0
      }, { onConflict: "usuario_id,trilha_id" })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ progresso: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Concluir etapa
app.post("/etapas/:etapaId/concluir", autenticarToken, async (req, res) => {
  try {
    const { etapaId } = req.params;
    const { avaliacao, feedback, respostas } = req.body;
    
    const { data: etapa } = await supabase
      .from("trilha_etapas")
      .select("trilha_id, ordem")
      .eq("id", etapaId)
      .single();
    
    if (!etapa) {
      return res.status(404).json({ erro: "Etapa não encontrada" });
    }
    
    const { error: eErr } = await supabase
      .from("usuario_etapas")
      .upsert({
        usuario_id: req.usuario.id,
        etapa_id: etapaId,
        status: "concluida",
        concluido_em: new Date().toISOString(),
        avaliacao: avaliacao || null,
        feedback: feedback || null,
        respostas: respostas || {}
      }, { onConflict: "usuario_id,etapa_id" });
    
    if (eErr) throw eErr;
    
    const { data: totalEtapas } = await supabase
      .from("trilha_etapas")
      .select("id")
      .eq("trilha_id", etapa.trilha_id);
    
    const { data: etapasConcluidas } = await supabase
      .from("usuario_etapas")
      .select("id")
      .eq("usuario_id", req.usuario.id)
      .eq("status", "concluida")
      .in("etapa_id", (totalEtapas || []).map(e => e.id));
    
    const total = totalEtapas?.length || 1;
    const concluidas = etapasConcluidas?.length || 0;
    const percentual = Math.round((concluidas / total) * 100);
    
    const { data: proxima } = await supabase
      .from("trilha_etapas")
      .select("id")
      .eq("trilha_id", etapa.trilha_id)
      .gt("ordem", etapa.ordem)
      .order("ordem")
      .limit(1)
      .single();
    
    const status = percentual >= 100 ? "concluida" : "em_progresso";
    
    await supabase
      .from("usuario_trilhas")
      .upsert({
        usuario_id: req.usuario.id,
        trilha_id: etapa.trilha_id,
        status,
        progresso_percentual: percentual,
        etapa_atual_id: proxima?.id || null,
        concluido_em: status === "concluida" ? new Date().toISOString() : null
      }, { onConflict: "usuario_id,trilha_id" });
    
    res.json({
      ok: true,
      progresso_percentual: percentual,
      proxima_etapa_id: proxima?.id || null,
      trilha_concluida: status === "concluida"
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= REFLEXÕES / DIÁRIO ========================= */

// Listar reflexões do usuário
app.get("/reflexoes", autenticarToken, async (req, res) => {
  try {
    const { tipo, trilha_id, limit = 20 } = req.query;
    
    let query = supabase
      .from("reflexoes")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));
    
    if (tipo) query = query.eq("tipo", tipo);
    if (trilha_id) query = query.eq("trilha_id", trilha_id);
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json({ reflexoes: data || [] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar reflexão
app.post("/reflexoes", autenticarToken, async (req, res) => {
  try {
    const { tipo, titulo, conteudo, etapa_id, trilha_id, video_id, tags } = req.body;
    
    if (!conteudo) {
      return res.status(400).json({ erro: "Conteúdo é obrigatório" });
    }
    
    let embedding = null;
    try {
      embedding = await embedText(conteudo);
    } catch {}
    
    const { data, error } = await supabase
      .from("reflexoes")
      .insert({
        usuario_id: req.usuario.id,
        tipo: tipo || "livre",
        titulo: titulo || null,
        conteudo,
        etapa_id: etapa_id || null,
        trilha_id: trilha_id || null,
        video_id: video_id || null,
        tags: tags || [],
        embedding
      })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ reflexao: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= MENSAGENS PARA DR. SÉRGIO ========================= */

// Listar mensagens do usuário
app.get("/mensagens", autenticarToken, requerPlano(["intermediate", "full"]), async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("usuarios")
      .select("role, mensagens_enviadas_mes")
      .eq("id", req.usuario.id)
      .single();
    
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    const limite = user?.role === "intermediate" ? 5 : null;
    const enviadas = user?.mensagens_enviadas_mes || 0;
    
    res.json({
      mensagens: data || [],
      limite_mensal: limite,
      enviadas_mes: enviadas,
      pode_enviar: limite === null || enviadas < limite
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Enviar mensagem
app.post("/mensagens", 
  autenticarToken, 
  requerPlano(["intermediate", "full"]), 
  verificarLimiteMensal("mensagens", { free: 0, intermediate: 5, full: Infinity }),
  async (req, res) => {
  try {
    const { text, file_url } = req.body;
    
    if (!text) {
      return res.status(400).json({ erro: "Texto é obrigatório" });
    }
    
    const user = req.usuarioCompleto;
    
    const { data, error } = await supabase
      .from("messages")
      .insert({
        usuario_id: req.usuario.id,
        text,
        file_url: file_url || null,
        status: "pending"
      })
      .select()
      .single();
    
    if (error) throw error;
    
    await supabase
      .from("usuarios")
      .update({ mensagens_enviadas_mes: (user?.mensagens_enviadas_mes || 0) + 1 })
      .eq("id", req.usuario.id);
    
    res.status(201).json({ mensagem: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= AGENDA / CONSULTORIAS ========================= */

// Listar agendamentos do usuário
app.get("/agenda", autenticarToken, requerPlano(["intermediate", "full"]), async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("usuarios")
      .select("role, consultorias_agendadas_mes")
      .eq("id", req.usuario.id)
      .single();
    
    const { data, error } = await supabase
      .from("schedule_events")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .order("starts_at", { ascending: true });
    
    if (error) throw error;
    
    const limite = user?.role === "intermediate" ? 2 : null;
    const agendadas = user?.consultorias_agendadas_mes || 0;
    
    res.json({
      agendamentos: data || [],
      limite_mensal: limite,
      agendadas_mes: agendadas,
      pode_agendar: limite === null || agendadas < limite
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Agendar consultoria
app.post("/agenda", 
  autenticarToken, 
  requerPlano(["intermediate", "full"]),
  verificarLimiteMensal("consultorias", { free: 0, intermediate: 2, full: Infinity }),
  async (req, res) => {
  try {
    const { starts_at, ends_at, notes } = req.body;
    
    if (!starts_at || !ends_at) {
      return res.status(400).json({ erro: "starts_at e ends_at são obrigatórios" });
    }
    
    const user = req.usuarioCompleto;
    
    const { data, error } = await supabase
      .from("schedule_events")
      .insert({
        usuario_id: req.usuario.id,
        starts_at,
        ends_at,
        notes: notes || null,
        status: "booked"
      })
      .select()
      .single();
    
    if (error) throw error;
    
    await supabase
      .from("usuarios")
      .update({ consultorias_agendadas_mes: (user?.consultorias_agendadas_mes || 0) + 1 })
      .eq("id", req.usuario.id);
    
    res.status(201).json({ agendamento: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Cancelar agendamento
app.delete("/agenda/:id", autenticarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from("schedule_events")
      .update({ status: "canceled", canceled_at: new Date().toISOString() })
      .eq("id", id)
      .eq("usuario_id", req.usuario.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ erro: "Agendamento não encontrado" });
    
    res.json({ ok: true, agendamento: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= ONBOARDING ========================= */

// Status do onboarding
app.get("/onboarding", autenticarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuario_onboarding")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .single();
    
    if (error && error.code !== "PGRST116") throw error;
    
    res.json({ onboarding: data || null });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar onboarding
app.post("/onboarding", autenticarToken, async (req, res) => {
  try {
    const { etapa_atual, respostas, assistiu_video_manifesto, completado } = req.body;
    
    const { data, error } = await supabase
      .from("usuario_onboarding")
      .upsert({
        usuario_id: req.usuario.id,
        etapa_atual: etapa_atual || 1,
        respostas: respostas || {},
        assistiu_video_manifesto: assistiu_video_manifesto || false,
        completado: completado || false,
        completado_em: completado ? new Date().toISOString() : null
      }, { onConflict: "usuario_id" })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ onboarding: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= PERFIL DE DESENVOLVIMENTO ========================= */

// Obter perfil
app.get("/perfil-dev", autenticarToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuario_perfil_dev")
      .select("*")
      .eq("usuario_id", req.usuario.id)
      .single();
    
    if (error && error.code !== "PGRST116") throw error;
    
    res.json({ perfil: data || null });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar perfil
app.patch("/perfil-dev", autenticarToken, async (req, res) => {
  try {
    const updates = req.body;
    
    const { data, error } = await supabase
      .from("usuario_perfil_dev")
      .upsert({
        usuario_id: req.usuario.id,
        ...updates
      }, { onConflict: "usuario_id" })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ perfil: data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/* ========================= IA GUARDIÃ (MENTOR) ========================= */
// Modelo simplificado: histórico contínuo por usuário, sem sessões

// Histórico completo da Guardiã (com paginação)
app.get("/guia/historico", autenticarToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const { data, error, count } = await supabase
      .from("historico_guardia")
      .select("id, pergunta, resposta, criado_em", { count: "exact" })
      .eq("usuario_id", req.usuario.id)
      .order("criado_em", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) throw error;
    
    res.json({
      mensagens: (data || []).reverse(), // retorna em ordem cronológica
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Chat com a IA Guardiã (histórico contínuo, sem sessões)
app.post("/guia/chat", autenticarToken, async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem) return res.status(400).json({ erro: "Mensagem obrigatória" });

  try {
    // busca contexto específico com RAG (trilhas, vídeos, reflexões)
    const contexto = await buscarContextoGuardia(req.usuario.id, mensagem);

    // busca perfil do usuário
    let perfilUsuario = null;
    try {
      const { data: perfil } = await supabase
        .from("usuario_perfil_dev")
        .select("*")
        .eq("usuario_id", req.usuario.id)
        .single();
      perfilUsuario = perfil;
    } catch {}

    // pega últimos 10 turnos do histórico da Guardiã (contínuo, sem sessão)
    const { data: histData } = await supabase
      .from("historico_guardia")
      .select("id, pergunta, resposta")
      .eq("usuario_id", req.usuario.id)
      .order("id", { ascending: false })
      .limit(10);

    const historicoCronologico = Array.isArray(histData)
      ? [...histData].sort((a, b) => a.id - b.id)
      : [];

    // gera resposta da Guardiã
    const respostaFinal = await generateRespostaGuardia({
      mensagem,
      contexto,
      historico: historicoCronologico,
      perfilUsuario
    });

    // salva histórico COM embedding para RAG futuro
    let mensagemId = null;
    try {
      const histEmbeddingText = `${mensagem}\n${respostaFinal}`;
      const histVec = await embedText(histEmbeddingText);
      
      const { data: inserted, error: insErr } = await supabase
        .from("historico_guardia")
        .insert([{
          usuario_id: req.usuario.id,
          pergunta: mensagem,
          resposta: respostaFinal,
          embedding: histVec
        }])
        .select("id")
        .single();
      
      if (insErr) throw insErr;
      mensagemId = inserted?.id;
    } catch (embErr) {
      // fallback sem embedding
      console.warn("Salvando histórico guardiã sem embedding:", embErr?.message);
      const { data: inserted } = await supabase
        .from("historico_guardia")
        .insert([{
          usuario_id: req.usuario.id,
          pergunta: mensagem,
          resposta: respostaFinal
        }])
        .select("id")
        .single();
      mensagemId = inserted?.id;
    }

    res.json({
      resposta: respostaFinal,
      mensagem_id: mensagemId
    });
  } catch (error) {
    console.error("Erro no guia/chat:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    res.status(500).json({ erro: "Falha ao processar pergunta" });
  }
});

// inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});