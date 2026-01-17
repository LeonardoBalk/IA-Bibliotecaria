# Relatório - IA Bibliotecária

---

## Visão Geral do Projeto

A IA Bibliotecária é uma plataforma de autodesenvolvimento que integra chatbot com RAG (Retrieval-Augmented Generation), sistema de planos, agendamento de consultorias, mensagens diretas com especialistas e conteúdos evolutivos personalizados.

---

## Escopo do MVP (20h)

Este MVP implementa o fluxo de entrada e dashboard inicial, representando as funcionalidades essenciais para validação do conceito.

### Frontend (React + TypeScript + Tailwind)

**Páginas Implementadas:**

1. **ConvitePage** (`/convite`)
   - Página de boas-vindas com vídeo manifesto
   - Logo da Neurocom
   - CTA "Entrar na Jornada"
   - Design glassmorphism com paleta verde

2. **InicioPage** (`/inicio`)
   - Apresentação da metodologia Neurocom
   - Vídeo introdutório
   - Modal de cadastro (nome + email)
   - Registro automático com role 'free'

3. **DashboardPage** (`/dashboard`)
   - Exibição do plano atual do usuário
   - Grid de acesso rápido (Conteúdos, Consultas, Mensagens, Planos)
   - Botão flutuante "IA Guardiã" com modal de chat
   - Design minimalista

**Componentes Criados:**
- `MainLayout` - Layout principal com sidebar e navegação
- `Button` - Botão reutilizável com variantes
- `Modal` - Modal glassmorphic responsivo
- `Input` - Input estilizado com label
- `AIChat` - Interface de chat com a IA

**Contextos:**
- `UserContext` - Gerenciamento de autenticação e dados do usuário
- `ThemeContext` - Suporte a tema claro/escuro

**Estilização:**
- Paleta de cores Neurocom (verde-centric)
- Efeitos glassmorphism
- Animações suaves (fade-in, slide-up, pulse)
- Design responsivo mobile-first
- Comentários naturalizados em pt-br

---

## Alterações no Banco de Dados

### Extensões Habilitadas
```sql
CREATE EXTENSION IF NOT EXISTS vector;    -- índices vetoriais para RAG
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()
```

### Tabela `usuarios` - Alterações
Campos adicionados para suportar planos e limites:
- `role` - Tipo de plano (free, intermediate, full)
- `stripe_customer_id` - ID do cliente no Stripe
- `stripe_subscription_id` - ID da assinatura
- `stripe_subscription_status` - Status da assinatura
- `mensagens_enviadas_mes` - Contador mensal de mensagens
- `consultorias_agendadas_mes` - Contador mensal de consultorias

Constraint adicionado:
```sql
CHECK (role IN ('free','intermediate','full'))
```

### Tabela `documents` - Alterações
Campos adicionados para categorização e RAG:
- `title` - Título do documento
- `tags` - Array de tags para filtros
- `summary` - Resumo do conteúdo
- `topic` - Tema principal
- `format` - Formato (vídeo, texto, exercício)
- `level` - Nível de complexidade
- `role_min` - Plano mínimo necessário
- `source` - Origem do conteúdo
- `popularity_score` - Score de popularidade
- `extra` - Metadados adicionais (JSONB)
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- `embedding` - Convertido para vector(768) para busca semântica

**Índices criados:**
- `documents_topic_idx` - Busca por tema
- `documents_tags_gin` - Busca por tags (GIN)
- `documents_level_idx` - Filtro por nível
- `documents_embedding_idx` - Busca vetorial (IVFFlat com 100 listas)

### Novas Tabelas

#### `plans`
Definição dos planos disponíveis:
- `key` (PK) - Identificador único do plano
- `name` - Nome do plano
- `description` - Descrição
- `stripe_price_id` - ID do preço no Stripe
- `allows_consultorias` - Limite mensal de consultorias
- `allows_mensagens` - Limite mensal de mensagens
- `features` - Array de features
- `created_at` - Data de criação

**Dados iniciais:**
- Free: 0 consultorias, 0 mensagens
- Intermediário: 2 consultorias, 5 mensagens
- Full: ilimitado

#### `user_subscriptions`
Histórico de assinaturas dos usuários:
- `id` (PK) - UUID
- `usuario_id` (FK) - Referência a usuarios
- `plan_key` (FK) - Referência a plans
- `stripe_subscription_id` - ID da assinatura no Stripe
- `status` - Status da assinatura
- `current_period_end` - Fim do período atual
- `created_at` - Data de criação

Índice: `user_subscriptions_usuario_idx`

#### `messages`
Sistema de mensagens diretas:
- `id` (PK) - UUID
- `usuario_id` (FK) - Referência a usuarios
- `text` - Conteúdo da mensagem
- `file_url` - URL de anexo
- `status` - Status (pending, handled, error)
- `created_at` - Data de criação
- `handled_at` - Data de tratamento
- `meta` - Metadados (JSONB)

Índice: `messages_usuario_status_idx`

#### `schedule_events`
Agendamento de consultorias:
- `id` (PK) - UUID
- `usuario_id` (FK) - Referência a usuarios
- `starts_at` - Início do evento
- `ends_at` - Fim do evento
- `status` - Status (booked, canceled, completed)
- `google_event_id` - ID do evento no Google Calendar
- `created_at` - Data de criação
- `canceled_at` - Data de cancelamento
- `notes` - Observações

Índices:
- `schedule_events_usuario_idx`
- `schedule_events_time_range_idx`

#### `document_interactions`
Rastreamento de interações para personalização:
- `id` (PK) - Serial
- `usuario_id` (FK) - Referência a usuarios
- `document_id` (FK) - Referência a documents
- `tipo` - Tipo de interação (view, click, like, completion)
- `peso` - Peso para ponderação (padrão: 1)
- `created_at` - Data de criação

Índices:
- `document_interactions_user_doc_idx`
- `document_interactions_doc_idx`

#### `ia_logs`
Logs de uso da IA:
- `id` (PK) - Serial
- `usuario_id` (FK) - Referência a usuarios
- `sessao_id` (FK) - Referência a sessoes
- `evento` - Tipo de evento (chat, recommendation, classification)
- `prompt_tokens` - Tokens do prompt
- `completion_tokens` - Tokens da resposta
- `modelo` - Modelo utilizado
- `created_at` - Data de criação
- `meta` - Metadados (JSONB)

Índices:
- `ia_logs_usuario_idx`
- `ia_logs_sessao_idx`

### Views

#### `user_document_usage_month`
Agregação mensal de uso de documentos por usuário:
```sql
SELECT usuario_id,
       date_trunc('month', created_at) AS mes,
       count(*) FILTER (WHERE tipo='view')   AS views,
       count(*) FILTER (WHERE tipo='click')  AS clicks,
       count(*) FILTER (WHERE tipo='like')   AS likes
FROM public.document_interactions
GROUP BY usuario_id, date_trunc('month', created_at)
```

### Triggers

**`documents_updated_at_trg`**
Atualiza automaticamente o campo `updated_at` em modificações na tabela `documents`:
```sql
CREATE OR REPLACE FUNCTION public.touch_documents_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Kanban do Projeto

### A FAZER
- Criar a estrutura do novo frontend
- Adicionar funcionalidades no backend

### EM PROGRESSO
- Reorganizar os documentos no banco de dados vetorial

### FEITO
- banco
- Corrigir e atualizar tabelas e informações que já existem
- Criar as primeiras páginas do frontend
- Revisar o backend
- Criar a página imersão
- Criar a página convite
- Criar a página dashboard
- Melhorar o estilo das páginas

---

## Design System

### Paleta de Cores
```css
neuro-green: #10b981 (principal)
neuro-green-light: #34d399
neuro-green-dark: #059669
neuro-blue: #3b82f6
neuro-purple: #8b5cf6
```

### Efeitos Visuais
- Glassmorphism: `backdrop-blur-md` com transparência
- Animações: fade-in, slide-up, pulse
- Hover states: scale, translate, shadow
- Bordas: rounded-2xl, rounded-3xl

---

## Fluxo de Usuário (MVP)

```mermaid
graph LR
    A[/convite] --> B[/inicio]
    B --> C{Cadastro}
    C --> D[/dashboard]
    D --> E[Quick Actions]
    E --> F[Conteúdos*]
    E --> G[Consultas*]
    E --> H[Mensagens*]
    E --> I[Planos*]
    
    style F fill:#666,color:#fff
    style G fill:#666,color:#fff
    style H fill:#666,color:#fff
    style I fill:#666,color:#fff
```

Páginas marcadas com * não foram incluídas no MVP mas estão comentadas no código.

---

## Páginas do Projeto Implementadas

### ConvitePage
![ConvitePage - Screenshot]()

**Descrição:** Página inicial de boas-vindas com vídeo manifesto da Neurocom.

---

### InicioPage
![InicioPage - Screenshot]()

**Descrição:** Apresentação da metodologia com modal de cadastro.

---

### DashboardPage
![DashboardPage - Screenshot]()

**Descrição:** Dashboard minimalista com plano atual e acesso rápido às funcionalidades.

---

## Estimativa de Tempo Realizado

- Frontend Base: 20h
- Banco de Dados: 4h
- Total: 24h

---

## Repositório

**GitHub**: https://github.com/LeonardoBalk/IA-Bibliotecaria  
**Branch MVP**: `mvp-20h`  
**Pull Request**: https://github.com/LeonardoBalk/IA-Bibliotecaria/pull/new/mvp-20h

---

**Última atualização**: 22/11/2025 20:04
