import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useUser } from '../context/UserContext';
import ContentCard from '../components/ContentCard';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
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
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Biblioteca de Conteúdos
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Explore vídeos, artigos e exercícios da sua jornada evolutiva
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-wrap gap-4">
            {/* Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
                Tipo de Conteúdo
              </label>
              <div className="flex flex-wrap gap-2">
                {types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2 rounded-neuro text-sm font-medium transition-all ${
                      selectedType === type.value
                        ? 'bg-neuro-blue text-white'
                        : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
                Nível
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`px-4 py-2 rounded-neuro text-sm font-medium transition-all ${
                      selectedLevel === level.value
                        ? 'bg-neuro-blue text-white'
                        : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
          <Badge variant="primary">Seu nível: {user?.role}</Badge>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <ContentCard
              key={doc.id}
              document={doc}
              userRole={user?.role || 'free'}
              onClick={() => console.log('Open document:', doc.id)}
            />
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Nenhum conteúdo encontrado com os filtros selecionados.
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
