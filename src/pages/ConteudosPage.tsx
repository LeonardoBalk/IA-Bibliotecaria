import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/ContentCard';
import type { Document } from '../types';

export default function ConteudosPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const documents: Document[] = [
    {
      id: '1',
      title: 'Introdução à Neurocom',
      description: 'Fundamentos da metodologia e primeiros passos na sua jornada',
      type: 'video',
      level: 'Básico',
      role_min: 'free',
      thumbnail: '',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Exercício: Autopercepção Inicial',
      description: 'Primeiro exercício prático de autoconhecimento',
      type: 'exercise',
      level: 'Básico',
      role_min: 'free',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Neurociência da Transformação',
      description: 'Como o cérebro processa mudanças profundas',
      type: 'article',
      level: 'Intermediário',
      role_min: 'intermediario',
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Imersão Avançada: Expansão',
      description: 'Técnicas avançadas de desenvolvimento pessoal',
      type: 'video',
      level: 'Avançado',
      role_min: 'full',
      thumbnail: '',
      created_at: new Date().toISOString(),
    },
  ];

  const types = [
    { value: 'all', label: 'Todos' },
    { value: 'video', label: 'Vídeos' },
    { value: 'article', label: 'Artigos' },
    { value: 'exercise', label: 'Exercícios' },
  ];

  const levels = [
    { value: 'all', label: 'Todos os níveis' },
    { value: 'Básico', label: 'Básico' },
    { value: 'Intermediário', label: 'Intermediário' },
    { value: 'Avançado', label: 'Avançado' },
  ];

  const filteredDocuments = documents.filter(doc => {
    const typeMatch = selectedType === 'all' || doc.type === selectedType;
    const levelMatch = selectedLevel === 'all' || doc.level === selectedLevel;
    return typeMatch && levelMatch;
  });

  return (
    <MainLayout>
      <div className="p-8 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-2">Sua Jornada</h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">Explore conteúdos selecionados para sua evolução</p>
            </div>
            <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm">{filteredDocuments.length} conteúdos disponíveis</span>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${selectedType === type.value
                    ? 'bg-neuro-green text-white'
                    : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border hover:border-neuro-green/40 hover:text-light-text dark:hover:text-dark-text'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(level.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedLevel === level.value
                    ? 'bg-light-border dark:bg-dark-surface-hover text-light-text dark:text-dark-text'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                    }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="animate-slide-up">
                <ContentCard
                  document={doc}
                  userRole={user?.role || 'free'}
                  onClick={() => console.log('Open document:', doc.id)}
                />
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16 bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border dark:border-dark-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-light-bg dark:bg-dark-bg flex items-center justify-center">
                <svg className="w-8 h-8 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">Nenhum conteúdo encontrado com esses filtros.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
