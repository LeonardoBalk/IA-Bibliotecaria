# Relatório - Semana 2 - IA Bibliotecária Neurocom

---

## Visão Geral

Na segunda semana do projeto, o foco foi na **estruturação do backend** para suportar as funcionalidades principais da plataforma e na **criação das páginas base do frontend** para as seções de Consultas, Conteúdos, Mensagens e Planos.

---

## Escopo da Semana 2

### Backend - Estruturação de Rotas e Banco de Dados

**Rotas de Vídeos Implementadas:**
- `GET /videos` - Lista vídeos com filtro por tema
- `GET /videos/:slug` - Detalhes de um vídeo
- `POST /videos/:videoId/progresso` - Atualizar progresso
- `GET /videos-continuar` - Vídeos para continuar assistindo
- `POST /videos/:videoId/curtir` - Curtir/descurtir vídeo
- `POST /videos/:videoId/salvar` - Salvar para ver depois
- `GET /videos-salvos` - Listar vídeos salvos

**Rotas de Trilhas Implementadas:**
- `GET /trilhas` - Lista trilhas disponíveis por plano
- `GET /trilhas/:slug` - Detalhes com etapas
- `POST /trilhas/:trilhaId/iniciar` - Iniciar uma trilha
- `POST /etapas/:etapaId/concluir` - Concluir etapa

**Rotas de Reflexões/Diário:**
- `GET /reflexoes` - Listar reflexões do usuário
- `POST /reflexoes` - Criar nova reflexão (com embedding para RAG)

---

### Banco de Dados - Novas Tabelas

#### `videos`
Armazenamento de vídeos da plataforma:
- `id` (PK) - UUID
- `slug` - Identificador único para URL
- `titulo` - Título do vídeo
- `descricao` - Descrição
- `url` - URL do vídeo (YouTube, Vimeo, etc.)
- `thumbnail_url` - Thumbnail
- `duracao_segundos` - Duração em segundos
- `tema` - Tema/categoria
- `tags` - Array de tags
- `level` - Nível de acesso (free, intermediate, full)
- `ordem` - Ordem de exibição
- `publicado` - Status de publicação
- `created_at`, `updated_at`

#### `usuario_videos`
Progresso e interações do usuário com vídeos:
- `usuario_id` (FK), `video_id` (FK) - Chave composta
- `tempo_atual` - Posição atual em segundos
- `concluido` - Se assistiu até o fim
- `curtiu` - Se curtiu o vídeo
- `salvou` - Se salvou para depois
- `origem` - De onde veio (direto, trilha)
- `trilha_id`, `etapa_id` - Se veio de uma trilha

#### `trilhas`
Trilhas de desenvolvimento:
- `id` (PK) - UUID
- `slug` - Identificador para URL
- `titulo`, `descricao`, `descricao_longa`
- `thumbnail_url`, `icone`
- `duracao_estimada_minutos`
- `level` - Plano mínimo necessário
- `ordem` - Ordem de exibição
- `ativa` - Se está ativa

#### `trilha_etapas`
Etapas de cada trilha:
- `id` (PK) - UUID
- `trilha_id` (FK)
- `video_id` (FK) - Vídeo opcional da etapa
- `titulo`, `descricao`
- `tipo` - Tipo (video, exercicio, reflexao, quiz)
- `ordem` - Ordem na trilha
- `duracao_minutos`
- `conteudo_extra` - JSONB para dados adicionais

#### `usuario_trilhas`
Progresso do usuário nas trilhas:
- `usuario_id`, `trilha_id` - Chave composta
- `status` - (nao_iniciada, em_progresso, concluida)
- `progresso_percentual`
- `etapa_atual_id`
- `iniciado_em`, `concluido_em`

#### `usuario_etapas`
Progresso por etapa:
- `usuario_id`, `etapa_id` - Chave composta
- `status` - (pendente, em_progresso, concluida)
- `concluido_em`
- `avaliacao`, `feedback`
- `respostas` - JSONB para quizzes

#### `reflexoes`
Diário de reflexões do usuário:
- `id` (PK) - UUID
- `usuario_id` (FK)
- `tipo` - (livre, pos_video, pos_etapa, insight)
- `titulo`, `conteudo`
- `etapa_id`, `trilha_id`, `video_id` - Contexto
- `tags` - Array de tags
- `embedding` - vector(768) para busca semântica
- `created_at`

---

### Frontend - Novas Páginas

**Páginas de Estrutura Criadas:**

1. **ConsultasPage** (`/consultas`)
   - Layout base para agendamento de consultorias
   - Exibição de calendário/horários disponíveis
   - Cards de consultorias agendadas
   - Indicador de limite por plano

2. **ConteudosPage** (`/conteudos`)
   - Grid de trilhas disponíveis
   - Cards com thumbnail, título e progresso
   - Filtro por categoria/tema
   - Seção "Continuar assistindo"

3. **MensagensPage** (`/mensagens`)
   - Lista de mensagens enviadas
   - Formulário para nova mensagem
   - Status de cada mensagem (pendente, respondida)
   - Contador de mensagens do mês

4. **PlanosPage** (`/planos`)
   - Comparativo dos 3 planos (Free, Intermediário, Full)
   - Tabela de features por plano
   - CTAs de upgrade
   - Destaque do plano atual

### Print das novas páginas
<img width="1920" height="1232" alt="image" src="https://github.com/user-attachments/assets/0f896a74-8cd5-406d-8be1-a91cfec2be43" />
<img width="1920" height="1062" alt="image" src="https://github.com/user-attachments/assets/64ab72e6-57c6-4b3a-a6f5-ad09d06e1223" />
<img width="1920" height="1485" alt="image" src="https://github.com/user-attachments/assets/611fe1e5-a1a0-462e-8ecb-4e0e9db77ecf" />
<img width="1920" height="1795" alt="image" src="https://github.com/user-attachments/assets/dcbe89f2-d6b7-484a-a21b-4c3ba650621a" />








---
## Próximos Passos (Semana 3)

- Implementar IA Guardiã com RAG e embeddings
- Criar rotas de mensagens e agenda com limites por plano
- Implementar middlewares de verificação de plano
- Integrar frontend com APIs de trilhas e vídeos
- Adicionar player de vídeo com tracking de progresso

---

## Status do Projeto

### FEITO ✅
- Estrutura de banco para vídeos, trilhas e reflexões
- Rotas backend de conteúdo
- Páginas base do frontend (Consultas, Conteúdos, Mensagens, Planos)

### EM PROGRESSO 🔄
- Integração frontend ↔ backend
- Testes das rotas implementadas

### A FAZER 📋
- IA Guardiã com RAG
- Sistema de planos com limites
- Onboarding completo
