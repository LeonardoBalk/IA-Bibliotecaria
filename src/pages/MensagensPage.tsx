import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import MessageForm from '../components/MessageForm';
import type { Message } from '../types';

export default function MensagensPage() {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      user_id: '1',
      content: 'Olá, gostaria de tirar uma dúvida sobre o exercício de autopercepção.',
      created_at: '2025-11-18T10:30:00',
      status: 'read',
    },
    {
      id: '2',
      user_id: 'admin',
      content: 'Claro! Fico feliz em ajudar. Qual é sua dúvida específica sobre o exercício?',
      created_at: '2025-11-18T14:20:00',
      status: 'read',
    },
    {
      id: '3',
      user_id: '1',
      content: 'Estou com dificuldade em identificar os padrões emocionais. Tem alguma orientação?',
      created_at: '2025-11-19T09:15:00',
      status: 'read',
    },
  ]);

  const handleSendMessage = (content: string, attachmentUrl?: string) => {
    console.log('Send message:', content, attachmentUrl);
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <h1 className="text-xl font-semibold text-light-text dark:text-dark-text">Conversas</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Converse diretamente com o Dr. Sérgio</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center gap-3 bg-light-surface dark:bg-dark-surface">
            <div className="w-11 h-11 rounded-full bg-neuro-green/10 dark:bg-dark-surface-hover flex items-center justify-center border border-neuro-green/20 dark:border-dark-border">
              <span className="font-semibold text-neuro-green dark:text-dark-text text-sm">DS</span>
            </div>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text text-sm">Dr. Sérgio Spritzer</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-xs">Neurocientista & Mentor</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neuro-green"></div>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-light-bg dark:bg-dark-bg">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} className="space-y-4">
                <div className="flex justify-center">
                  <span className="text-light-text-secondary dark:text-dark-text-secondary text-xs bg-light-surface dark:bg-dark-surface px-4 py-1.5 rounded-full capitalize border border-light-border dark:border-dark-border">
                    {date}
                  </span>
                </div>

                {msgs.map((message) => {
                  const isUser = message.user_id === '1';
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${isUser
                          ? 'bg-light-border dark:bg-dark-surface-hover text-light-text dark:text-dark-text'
                          : 'bg-neuro-green/10 text-neuro-green border border-neuro-green/20'
                          }`}>
                          {isUser ? 'Eu' : 'DS'}
                        </div>
                      </div>

                      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm ${isUser
                            ? 'bg-neuro-green text-white rounded-br-md'
                            : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-bl-md'
                            }`}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                        <span className="text-light-text-secondary dark:text-dark-text-secondary text-xs mt-1.5">
                          {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {isUser && (
                            <span className="ml-1.5 opacity-70">
                              {message.status === 'read' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
            <MessageForm onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
