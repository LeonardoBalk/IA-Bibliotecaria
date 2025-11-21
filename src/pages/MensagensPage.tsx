import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import MessageForm from '../components/MessageForm';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
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
    // Implementar integração com message service
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('pt-BR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <MainLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Mensagens
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Converse diretamente com o Dr. Sérgio
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-light-border dark:border-dark-border">
                <div className="w-12 h-12 rounded-full bg-neuro-blue/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-neuro-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text">
                    Dr. Sérgio
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neuro-green rounded-full" />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Responde em até 24h
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-6 mb-6">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-light-border dark:bg-dark-border" />
                      <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {date}
                      </span>
                      <div className="h-px flex-1 bg-light-border dark:bg-dark-border" />
                    </div>

                    {msgs.map((message) => {
                      const isUser = message.user_id === '1';
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-neuro p-4 ${
                                isUser
                                  ? 'bg-neuro-blue text-white'
                                  : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              {message.attachment_url && (
                                <div className="mt-3 pt-3 border-t border-white/20">
                                  <a
                                    href={message.attachment_url}
                                    className="flex items-center gap-2 text-sm hover:opacity-80"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    Anexo
                                  </a>
                                </div>
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${
                              isUser ? 'text-right' : 'text-left'
                            } text-light-text-secondary dark:text-dark-text-secondary`}>
                              {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>

            {/* Send Message Form */}
            <MessageForm onSend={handleSendMessage} />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">
                Sobre as Mensagens
              </h3>
              <ul className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Resposta garantida em até 24h</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Envie anexos (imagens, PDFs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Histórico completo disponível</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Comunicação segura e privada</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-neuro-blue/5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-neuro-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-light-text dark:text-dark-text mb-1">
                    Dica
                  </h4>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Seja específico nas suas perguntas para receber orientações mais precisas.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
