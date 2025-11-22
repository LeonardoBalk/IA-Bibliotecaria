import { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: type === 'conversational'
        ? 'Olá! Sou a IA Conversacional da Neurocom. Como posso ajudar você hoje?'
        : 'Olá! Sou a IA Guardiã da sua jornada. Vou recomendar conteúdos e guiar seu desenvolvimento.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simula resposta da IA (substituir por chamada real)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: type === 'conversational'
          ? 'Esta é uma resposta simulada. Integre com sua API de IA aqui.'
          : 'Com base no seu histórico, recomendo explorar os conteúdos de autopercepção.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header - Optional if inside Modal with title, but keeping for context if used elsewhere */}
      {/* <div className="flex items-center gap-3 p-4 border-b border-light-border dark:border-white/5">
        ...
      </div> */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${message.role === 'user'
                  ? 'bg-gradient-to-br from-neuro-green to-neuro-green-dark text-white rounded-br-none'
                  : 'bg-white dark:bg-white/5 border border-light-border dark:border-white/10 text-light-text dark:text-gray-200 rounded-bl-none'
                }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-[10px] mt-1 text-right ${message.role === 'user' ? 'text-white/70' : 'text-light-text-secondary dark:text-gray-500'
                }`}>
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-white/5 border border-light-border dark:border-white/10 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neuro-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-neuro-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neuro-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-light-border dark:border-white/5 bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white dark:bg-black/20 border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-sm text-light-text dark:text-white placeholder-light-text-secondary dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neuro-green/50 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-neuro-green hover:bg-neuro-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-colors shadow-lg shadow-neuro-green/20"
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
