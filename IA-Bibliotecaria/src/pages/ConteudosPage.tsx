import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import ContentCard from '../components/ContentCard';
import type { Document } from '../types';

export default function ConteudosPage() {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Mock documents
  const documents: Document[] = [
    {
      id: '1',
      title: 'Introdução à Neurocom',
      description: 'Fundamentos da metodologia e primeiros passos',
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
      description: 'Técnicas avançadas de desenvolvimento',
      type: 'video',
      level: 'Avançado',
      role_min: 'full',
      thumbnail: '',
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Protocolo de Estabilização',
      description: 'Consolidando mudanças e criando estrutura',
      type: 'exercise',
      level: 'Avançado',
      role_min: 'full',
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
    { value: 'all', label: 'Todos os Níveis' },
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
      <div className="min-h-full p-8 md:p-12 relative overflow-hidden">

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-neuro-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neuro-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-light-text dark:text-white tracking-tight mb-2">
                Biblioteca
              </h1>
              <p className="text-light-text-secondary dark:text-gray-400">
                Explore conteúdos para sua evolução
              </p>
            </div>
            <div className="text-sm text-light-text-secondary dark:text-gray-500">
              {filteredDocuments.length} resultados
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 animate-slide-up">
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedType === type.value
                      ? 'bg-neuro-green text-white border-neuro-green shadow-lg shadow-neuro-green/20'
                      : 'bg-white/50 dark:bg-white/5 text-light-text-secondary dark:text-gray-400 border-light-border dark:border-white/10 hover:border-neuro-green/50 hover:text-neuro-green'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Level Filters (Optional - can be collapsible or secondary) */}
            <div className="flex flex-wrap gap-2">
              {levels.map(level => (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(level.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${selectedLevel === level.value
                      ? 'bg-neuro-blue/10 text-neuro-blue border-neuro-blue/20'
                      : 'bg-transparent text-light-text-secondary dark:text-gray-500 border-transparent hover:bg-white/5'
                    }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="group">
                <ContentCard
                  document={doc}
                  userRole={user?.role || 'free'}
                  onClick={() => console.log('Open document:', doc.id)}
                />
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-20 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-light-border dark:border-white/10">
              <svg className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-light-text-secondary dark:text-gray-400">
                Nenhum conteúdo encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
