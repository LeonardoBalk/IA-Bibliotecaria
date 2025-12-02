import { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
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
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-light-border dark:border-dark-border">
        <div className="w-10 h-10 rounded-full bg-neuro-blue/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-light-text dark:text-dark-text">
            {type === 'conversational' ? 'IA Conversacional' : 'IA Guardiã'}
          </h3>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {type === 'conversational' ? 'Tire suas dúvidas' : 'Guiando sua jornada'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-neuro px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-neuro-blue text-white'
                  : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-white/70' : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}>
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-light-bg dark:bg-dark-bg rounded-neuro px-4 py-2.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neuro-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-neuro-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neuro-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="input flex-1"
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            isLoading={isLoading}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
}
