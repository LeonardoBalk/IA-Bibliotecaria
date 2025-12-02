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
    // Implementar integração com message service
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

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <MainLayout>
      <div className="h-full relative overflow-hidden flex flex-col">

        {/* elementos de fundo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neuro-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full h-full relative z-10 flex flex-col p-4 md:p-6">
          {/* cabeçalho da página */}
          <div className="flex-shrink-0 mb-4 flex justify-between items-end">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-light-text dark:text-white mb-1 tracking-tight">
                Mensagens
              </h1>
              <p className="text-lg text-light-text-secondary dark:text-gray-400">
                Converse diretamente com o Dr. Sérgio
              </p>
            </div>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="md:hidden text-neuro-green hover:text-neuro-green-dark transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* container do chat - preenche o espaço restante */}
          <div className="flex-1 flex flex-col bg-white/50 dark:bg-white/5 backdrop-blur-md border border-light-border dark:border-white/10 rounded-3xl shadow-xl overflow-hidden animate-slide-up">

            {/* cabeçalho do chat */}
            <div className="p-4 md:p-6 border-b border-light-border dark:border-white/10 flex items-center justify-between bg-white/60 dark:bg-white/5 backdrop-blur-xl z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-neuro-green/10 flex items-center justify-center border-2 border-white dark:border-white/10 shadow-sm">
                    <span className="font-bold text-neuro-green text-lg md:text-xl">DS</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-neuro-green rounded-full border-2 border-white dark:border-[#1a1a1a]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-light-text dark:text-white">
                    Dr. Sérgio
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-gray-400">
                    Neurocientista & Mentor
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInfoOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-neuro-green/10 text-neuro-green hover:bg-neuro-green/20 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sobre
              </button>
            </div>

            {/* lista de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="space-y-8">
                  <div className="flex justify-center">
                    <div className="bg-black/5 dark:bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                      <span className="text-xs font-medium text-light-text-secondary dark:text-gray-300 capitalize">
                        {date}
                      </span>
                    </div>
                  </div>

                  {msgs.map((message) => {
                    const isUser = message.user_id === '1';
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* avatar */}
                        <div className="flex-shrink-0 self-end">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm ${isUser
                            ? 'bg-neuro-blue text-white'
                            : 'bg-neuro-green/10 text-neuro-green border border-neuro-green/20'
                            }`}>
                            <span className="text-sm md:text-base font-bold">
                              {isUser ? 'VC' : 'DS'}
                            </span>
                          </div>
                        </div>

                        {/* balão de mensagem */}
                        <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`rounded-2xl px-6 py-4 shadow-sm text-lg leading-relaxed ${isUser
                              ? 'bg-gradient-to-br from-neuro-green to-neuro-green-dark text-white rounded-br-sm'
                              : 'bg-white dark:bg-white/10 border border-light-border dark:border-white/5 text-light-text dark:text-gray-100 rounded-bl-sm'
                              }`}
                          >
                            <p>{message.content}</p>
                            {message.attachment_url && (
                              <div className="mt-4 pt-3 border-t border-white/20">
                                <a
                                  href={message.attachment_url}
                                  className="flex items-center gap-3 text-sm font-medium hover:opacity-90 transition-opacity bg-black/10 rounded-lg p-2"
                                >
                                  <div className="bg-white/20 p-1.5 rounded">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                  </div>
                                  <span>Ver Anexo</span>
                                </a>
                              </div>
                            )}
                          </div>
                          <span className={`text-xs mt-2 font-medium ${isUser ? 'text-light-text-secondary dark:text-gray-500 mr-1' : 'text-light-text-secondary dark:text-gray-500 ml-1'
                            }`}>
                            {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {isUser && (
                              <span className="ml-2 opacity-60">
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

            {/* formulário de envio */}
            <div className="p-4 md:p-6 bg-white/60 dark:bg-white/5 border-t border-light-border dark:border-white/10 backdrop-blur-xl">
              <MessageForm onSend={handleSendMessage} />
            </div>
          </div>
        </div>

        {/* modal de informações */}
        {isInfoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-3xl p-6 shadow-2xl border border-light-border dark:border-white/10 relative animate-slide-up">
              <button
                onClick={() => setIsInfoOpen(false)}
                className="absolute top-4 right-4 text-light-text-secondary dark:text-gray-400 hover:text-light-text dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="font-bold text-xl text-light-text dark:text-white mb-6">
                Sobre as Mensagens
              </h3>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-neuro-green/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-light-text dark:text-white">Tempo de Resposta</span>
                    <span className="text-sm text-light-text-secondary dark:text-gray-400">Geralmente em até 24h úteis</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-neuro-green/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-light-text dark:text-white">Anexos</span>
                    <span className="text-sm text-light-text-secondary dark:text-gray-400">Envie imagens ou documentos PDF</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-neuro-green/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neuro-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-light-text dark:text-white">Histórico</span>
                    <span className="text-sm text-light-text-secondary dark:text-gray-400">Acesso vitalício às conversas</span>
                  </div>
                </li>
              </ul>

              <div className="bg-gradient-to-br from-neuro-green/10 to-neuro-green/5 border border-neuro-green/20 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-neuro-green text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-neuro-green/30">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-light-text dark:text-white mb-2">
                      Dica do Dr. Sérgio
                    </h4>
                    <p className="text-sm text-light-text-secondary dark:text-gray-300 leading-relaxed">
                      "Ao descrever suas experiências, tente focar nas sensações físicas e emoções que surgiram. Isso nos ajuda a identificar padrões mais rapidamente."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
