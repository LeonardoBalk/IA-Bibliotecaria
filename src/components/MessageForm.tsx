import { useState, useRef } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';

interface MessageFormProps {
  onSend: (content: string, attachmentUrl?: string) => void;
}

export default function MessageForm({ onSend }: MessageFormProps) {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsUploading(true);

    // Simula upload de arquivo (substituir por upload real)
    let attachmentUrl: string | undefined;
    if (attachment) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attachmentUrl = `https://example.com/uploads/${attachment.name}`;
    }

    onSend(content, attachmentUrl);
    setContent('');
    setAttachment(null);
    setIsUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        Enviar Mensagem para Dr. Sérgio
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
            Sua mensagem
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva sua mensagem aqui..."
            rows={6}
            className="input resize-none"
            disabled={isUploading}
          />
        </div>

        {/* Attachment */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />

          {attachment ? (
            <div className="flex items-center gap-3 p-3 bg-light-bg dark:bg-dark-bg rounded-neuro">
              <svg className="w-5 h-5 text-neuro-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm text-light-text dark:text-dark-text flex-1 truncate">
                {attachment.name}
              </span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-neuro-blue hover:opacity-80 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Anexar arquivo
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-light-border dark:border-dark-border flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setContent('');
              setAttachment(null);
            }}
            disabled={isUploading}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!content.trim() || isUploading}
            isLoading={isUploading}
          >
            Enviar Mensagem
          </Button>
        </div>
      </form>
    </Card>
  );
}
