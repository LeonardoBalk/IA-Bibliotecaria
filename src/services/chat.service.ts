// Serviço de comunicação com a IA do backend
// Conecta o frontend com o endpoint /chat-rag

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  resposta: string;
  fontes?: string[];
  sessionId?: string;
  followups?: string[];
  agendamento?: {
    googleEventId?: string;
    inicio?: string;
    fim?: string;
    linkMeet?: string;
  };
}

/**
 * Envia mensagem para a IA Conversacional (chat-rag) - com agendamento
 */
export async function enviarMensagem(
  mensagem: string,
  sessionId?: string
): Promise<ChatResponse> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token não fornecido');
  }
  
  const response = await fetch(`${API_BASE_URL}/chat-rag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mensagem,
      sessionId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.erro || `Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Envia mensagem para a IA Guardiã (guia/chat) - mentor de jornada
 */
export async function enviarMensagemGuardia(mensagem: string): Promise<{
  resposta: string;
  proxima_etapa?: any;
  onboarding?: { etapa: number; total: number; completo: boolean };
  trilha_recomendada?: any;
}> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token não fornecido');
  }
  
  const response = await fetch(`${API_BASE_URL}/guia/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensagem }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.erro || `Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Busca dashboard do usuário (progresso, trilhas, etc)
 */
export async function buscarDashboard(): Promise<any> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token não fornecido');
  }
  
  const response = await fetch(`${API_BASE_URL}/guia/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar dashboard: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Busca horários disponíveis para agendamento
 */
export async function buscarHorariosDisponiveis(): Promise<any[]> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/horarios-disponiveis`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar horários: ${response.statusText}`);
  }

  const data = await response.json();
  return data.horarios || [];
}

/**
 * Gera um ID de sessão único para o chat
 */
export function gerarSessionId(): string {
  const stored = sessionStorage.getItem('neurocom-chat-session');
  if (stored) return stored;
  
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('neurocom-chat-session', newId);
  return newId;
}
