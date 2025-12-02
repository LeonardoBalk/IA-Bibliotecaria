import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentCard from '../../components/ContentCard';
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import './conteudos.css';

// Mock data
const mockContents = [
    {
        id: 1,
        title: 'Introdução à Comunicação Relacional',
        summary: 'Aprenda os fundamentos da comunicação que conecta e transforma relacionamentos profissionais e pessoais.',
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
        type: 'video',
        duration: '45 min',
        tags: ['Comunicação', 'Fundamentos'],
        minRole: 'free'
    },
    {
        id: 2,
        title: 'Neurociência da Liderança',
        summary: 'Como o cérebro funciona em posições de liderança e tomada de decisão sob pressão.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
        type: 'article',
        readTime: '15 min',
        tags: ['Liderança', 'Neurociência'],
        minRole: 'intermediate'
    },
    {
        id: 3,
        title: 'Masterclass: Gestão de Conflitos',
        summary: 'Técnicas avançadas para mediar e resolver conflitos complexos em ambientes corporativos.',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
        type: 'video',
        duration: '1h 20min',
        tags: ['Gestão', 'Conflitos'],
        minRole: 'full'
    },
    {
        id: 4,
        title: 'Inteligência Emocional na Prática',
        summary: 'Exercícios práticos para desenvolver autoconsciência e regulação emocional.',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
        type: 'video',
        duration: '30 min',
        tags: ['Soft Skills', 'Prática'],
        minRole: 'free'
    }
];

export default function Conteudos() {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'free', 'intermediate', 'full'

    // Mock user role - substituir pelo contexto real
    const userRole = 'free';

    const filteredContents = mockContents.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || content.minRole === filter;
        return matchesSearch && matchesFilter;
    });

    const handleUpgrade = () => {
        window.location.href = '/planos';
    };

    return (
        <div className="conteudos-page">
            {/* Header */}
            <header className="conteudos-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Biblioteca de Conteúdos</h1>
                        <p>Explore nosso acervo de conhecimento exclusivo</p>
                    </div>

                    <Link to="/dashboard" className="btn-back">
                        <ArrowLeft size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Voltar ao Dashboard
                    </Link>
                </div>
            </header>

            {/* Filters & Search */}
            <div className="conteudos-filters">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por título, tema ou palavra-chave..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <Filter size={18} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todos os níveis</option>
                            <option value="free">Gratuito</option>
                            <option value="intermediate">Intermediário</option>
                            <option value="full">Completo</option>
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                            aria-label="Visualização em grade"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                            aria-label="Visualização em lista"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className={`conteudos-grid ${viewMode}`}>
                {filteredContents.length > 0 ? (
                    filteredContents.map(content => (
                        <ContentCard
                            key={content.id}
                            content={content}
                            userRole={userRole}
                            onUpgrade={handleUpgrade}
                            onClick={() => console.log('Open content:', content.id)}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>Nenhum conteúdo encontrado para sua busca.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
