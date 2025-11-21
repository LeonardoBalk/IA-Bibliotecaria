# NEUROCOM Frontend

Plataforma completa de autodesenvolvimento guiado com IA personalizada, construída com React + TypeScript + Tailwind CSS.

## 🎨 Identidade Visual

Cores oficiais da marca:
- **Azul Neurocom** (`#1E88E5`) - Primário: ação, tecnologia, confiança
- **Verde Neurocom** (`#4CAF50`) - Secundário: evolução, crescimento, progresso
- **Preto Profundo** (`#0C0C0C`) - Base dark mode, elegância, modernidade

Suporte completo a **Dark Mode** e **Light Mode** com tokens CSS.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Card, Input, Modal, etc)
│   ├── ContentCard.tsx  # Card de conteúdo com lock
│   ├── SubscriptionWidget.tsx  # Widget de plano/upgrade
│   ├── AIChat.tsx       # Chat com IA (Conversacional/Guardiã)
│   ├── ConsultationBooking.tsx  # Agendamento de consultorias
│   ├── MessageForm.tsx  # Formulário de mensagens
│   ├── UpgradeModal.tsx # Modal de upgrade de plano
│   └── MainLayout.tsx   # Layout principal com sidebar
├── pages/
│   ├── ConvitePage.tsx      # Página de convite (pública)
│   ├── InicioPage.tsx       # Página inicial com cadastro (pública)
│   ├── DashboardPage.tsx    # Hub principal (autenticada)
│   ├── ConteudosPage.tsx    # Biblioteca de conteúdos (autenticada)
│   ├── PlanosPage.tsx       # Comparação de planos (autenticada)
│   ├── ConsultasPage.tsx    # Agendamento (autenticada)
│   └── MensagensPage.tsx    # Mensagens diretas (autenticada)
├── context/
│   ├── ThemeContext.tsx  # Gerenciamento de tema (light/dark)
│   └── UserContext.tsx   # Gerenciamento de usuário e autenticação
├── services/
│   ├── api.ts                # Cliente HTTP centralizado
│   ├── document.service.ts   # Serviço de conteúdos
│   ├── payment.service.ts    # Serviço de pagamentos
│   ├── schedule.service.ts   # Serviço de agendamentos
│   └── message.service.ts    # Serviço de mensagens
├── types/
│   └── index.ts  # Tipos TypeScript (User, Document, Subscription, etc)
└── assets/styles/
    └── index.css # Estilos globais com tokens Neurocom
```

## 🧩 Páginas e Funcionalidades

### Páginas Públicas
- **`/convite`** - Landing page com vídeo manifesto e CTA
- **`/inicio`** - Explicação da metodologia + modal de cadastro

### Páginas Autenticadas
- **`/dashboard`** - Hub principal com:
  - IA Conversacional (tire dúvidas)
  - IA Guardiã (recomendações personalizadas)
  - Últimos conteúdos vistos
  - Acesso rápido para funcionalidades
  
- **`/conteudos`** - Biblioteca com:
  - Filtros por tipo (vídeo, artigo, exercício) e nível
  - Cards com lock visual para conteúdos bloqueados
  - Sistema de recomendação
  
- **`/planos`** - Comparação entre:
  - **Free (Presença Aberta)** - Básico
  - **Intermediário (Círculo Implicado)** - Consultorias limitadas
  - **Full (Círculo Integral)** - Acesso total + consultorias ilimitadas
  
- **`/consultas`** - Agendamento:
  - Datepicker integrado
  - Bloqueio visual para plano free
  - Limite para intermediário
  - Ilimitado para full
  
- **`/mensagens`** - Inbox premium:
  - Mensagens diretas com Dr. Sérgio
  - Upload de anexos
  - Timeline organizada por data

## 🎯 Conceitos Principais

### Duas IAs Distintas

1. **IA Conversacional** - Chatbot para tirar dúvidas
2. **IA Guardiã da Jornada** - Recomenda conteúdos, analisa histórico, sugere upgrades

### Sistema de Níveis (UserRole)

```typescript
type UserRole = 'free' | 'intermediario' | 'full';
```

Cada conteúdo tem `role_min` que define o nível mínimo necessário para acesso.

### Design Philosophy

- ✅ Minimalismo extremo
- ✅ Cores sólidas (sem gradientes chamativos)
- ✅ Tipografia moderna e respirada
- ✅ Sombras sutis
- ✅ Bordas arredondadas (10px)
- ✅ Foco no conteúdo, zero ruído visual
- ✅ Animações leves (fade, slide)

## 🔌 Integração com Backend

Os services em `src/services/` estão prontos para integração:

```typescript
// Configurar variável de ambiente
// .env
VITE_API_URL=http://localhost:3000/api
```

Estrutura esperada do backend:
- `GET /documents` - Lista conteúdos
- `GET /documents/recommendations` - Recomendações da IA Guardiã
- `POST /schedule` - Agendar consultoria
- `GET /messages` - Buscar mensagens
- `POST /messages` - Enviar mensagem
- `GET /plans` - Listar planos
- `POST /payments/checkout` - Criar sessão de pagamento

## 🎨 Customização

### Alterar cores da marca

Edite `tailwind.config.js`:

```javascript
colors: {
  neuro: {
    blue: '#1E88E5',    // Cor primária
    green: '#4CAF50',   // Cor secundária
    black: '#0C0C0C',   // Base dark
  }
}
```

### Adicionar novo componente

Componentes UI base ficam em `src/components/ui/`.
Componentes específicos da plataforma ficam em `src/components/`.

## 📦 Dependências Principais

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Navegação

## 🛠️ Próximos Passos

- [ ] Integrar APIs reais do backend
- [ ] Implementar upload de arquivos
- [ ] Adicionar player de vídeo
- [ ] Configurar testes (Vitest)
- [ ] Deploy (Vercel/Netlify)

## 📄 Licença

Propriedade de NEUROCOM - Uso interno.
