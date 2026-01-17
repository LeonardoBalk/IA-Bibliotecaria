import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { enviarMensagem, enviarMensagemGuardia, gerarSessionId } from '../services/chat.service';
import api from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  type: 'conversational' | 'guardian';
}

export default function AIChat({ type }: AIChatProps) {
  const { user, isAuthenticated } = useAuth();
  const [sessionId] = useState(() => gerarSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Carrega histórico da IA Guardiã ao montar
  useEffect(() => {
    if (type === 'guardian' && isAuthenticated) {
      loadHistory();
    } else if (messages.length === 0) {
      // Mensagem de boas-vindas para chat conversacional
      setMessages([getWelcomeMessage()]);
    }
  }, [type, isAuthenticated]);

  const getWelcomeMessage = (): Message => ({
    id: '1',
    role: 'assistant',
    content: type === 'guardian'
      ? `Olá${user?.nome ? `, ${user.nome}` : ''}! Sou a IA Guardiã, sua companheira nesta jornada de autodesenvolvimento. Estou aqui para guiar seu caminho, recomendar conteúdos adequados ao seu momento e ajudar você a evoluir um passo de cada vez. Como está se sentindo hoje?`
      : `Olá${user?.nome ? `, ${user.nome}` : ''}! Sou a assistente da Neurocom. Posso esclarecer dúvidas sobre a metodologia do Dr. Sérgio Spritzer e ajudar você a agendar uma reunião de alinhamento. Como posso ajudar?`,
    timestamp: new Date(),
  });

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await api.get('/guia/historico?limit=30');
      const historico = response.data.mensagens || [];

      if (historico.length === 0) {
        // Sem histórico, mostra mensagem de boas-vindas
        setMessages([getWelcomeMessage()]);
      } else {
        // Converte histórico para formato de mensagens
        const historicoMessages: Message[] = [];
        historico.forEach((msg: { id: number, pergunta: string, resposta: string, criado_em: string }) => {
          historicoMessages.push({
            id: `user-${msg.id}`,
            role: 'user',
            content: msg.pergunta,
            timestamp: new Date(msg.criado_em),
          });
          historicoMessages.push({
            id: `assistant-${msg.id}`,
            role: 'assistant',
            content: msg.resposta,
            timestamp: new Date(msg.criado_em),
          });
        });
        setMessages(historicoMessages);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setMessages([getWelcomeMessage()]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isAuthenticated) {
      setError('Você precisa fazer login para usar o chat.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (type === 'guardian') {
        response = await enviarMensagemGuardia(input);
      } else {
        response = await enviarMensagem(input, sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.resposta,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      setError(err.message || 'Desculpe, ocorreu um erro. Tente novamente.');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema técnico. Pode tentar novamente?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-light-bg dark:bg-dark-bg">
        {isLoadingHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-neuro-green/30 border-t-neuro-green rounded-full animate-spin mx-auto mb-2" />
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Carregando conversas...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${message.role === 'user'
                    ? 'bg-neuro-green/20 text-neuro-green'
                    : 'bg-neuro-blue/20 text-neuro-blue'
                    }`}>
                    {message.role === 'user' ? (user?.nome?.charAt(0) || 'U') : 'IA'}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                      ? 'bg-neuro-green text-white rounded-br-md'
                      : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-bl-md'
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-white/70' : 'text-light-text-secondary dark:text-dark-text-secondary'
                      }`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-neuro-blue/20 flex items-center justify-center text-xs font-semibold text-neuro-blue">
                    IA
                  </div>
                  <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-neuro-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-neuro-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-neuro-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl text-light-text dark:text-dark-text placeholder-light-text-secondary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:border-neuro-green focus:ring-2 focus:ring-neuro-green/20 transition-all text-sm"
            disabled={isLoading || isLoadingHistory}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isLoadingHistory}
            className="px-4 bg-neuro-green hover:bg-neuro-green-dark text-white rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
