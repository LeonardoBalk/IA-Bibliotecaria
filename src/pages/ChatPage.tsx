import { useState, useEffect, useRef, useCallback, useMemo, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import TypewriterText from '../components/TypewriterText';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Mensagem {
    remetente: 'usuario' | 'bot';
    texto: string;
}

interface Sessao {
    id: string;
    titulo: string | null;
    created_at: string;
    _tituloExibicao?: string;
}

interface Agent {
    id: string;
    name: string;
    icon: string;
    description: string;
    starters?: string[];
}

export default function ChatPage() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Estados principais
    const [mensagem, setMensagem] = useState('');
    const [historico, setHistorico] = useState<Mensagem[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [dots, setDots] = useState('');
    const [sessions, setSessions] = useState<Sessao[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [typingMessageIdx, setTypingMessageIdx] = useState<number | null>(null);

    // Estados para Agentes
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [loadingAgents, setLoadingAgents] = useState(false);

    // Renomear sessão
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingTitleValue, setEditingTitleValue] = useState('');

    // Seleção / exclusão múltipla
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState(false);

    // Pesquisa sessões
    const [sessionSearch, setSessionSearch] = useState('');

    // UI state
    const [showSidebar, setShowSidebar] = useState(true);
    const [showSessionsPanel, setShowSessionsPanel] = useState(true);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Token
    const token = localStorage.getItem('token');

    // Scroll to bottom
    const scrollToBottom = (smooth = true) => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'end'
        });
    };

    // Animação typing dots
    useEffect(() => {
        if (!isTyping) return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 500);
        return () => clearInterval(interval);
    }, [isTyping]);

    // Scroll ao mudar sessão ou mensagens
    useEffect(() => {
        scrollToBottom(false);
    }, [currentSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [historico, isTyping]);

    // Detectar scroll para botão
    useEffect(() => {
        const el = chatAreaRef.current;
        if (!el) return;
        const onScroll = () => {
            if (el.scrollHeight - el.scrollTop - el.clientHeight > 120) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };
        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = Math.min(200, ta.scrollHeight) + 'px';
    }, [mensagem]);

    // Carregar sessões
    const fetchSessions = useCallback(async () => {
        if (!token) return;
        setLoadingSessions(true);
        try {
            setErrorMsg('');
            const res = await fetch(`${API_BASE_URL}/sessoes`, {
                headers: { Authorization: 'Bearer ' + token }
            });
            const data = await res.json();
            if (data.sessoes) {
                setSessions(data.sessoes);
                if (data.sessoes.length > 0) {
                    setCurrentSessionId((prev) => prev || data.sessoes[0].id);
                } else {
                    await handleNewChat(true);
                }
            } else {
                setSessions([]);
            }
        } catch (err) {
            console.error('Erro carregando sessões:', err);
            setErrorMsg('Erro ao carregar sessões.');
        } finally {
            setLoadingSessions(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;
        fetchSessions();
    }, [token, fetchSessions]);

    // Carregar Agentes
    useEffect(() => {
        const fetchAgents = async () => {
            setLoadingAgents(true);
            try {
                const res = await fetch(`${API_BASE_URL}/chat/agents`);
                const data = await res.json();
                if (data.agents) {
                    setAgents(data.agents);
                }
            } catch (err) {
                console.error('Erro carregando agentes:', err);
            } finally {
                setLoadingAgents(false);
            }
        };
        fetchAgents();
    }, []);

    // Carregar histórico da sessão ativa
    useEffect(() => {
        if (!token || !currentSessionId) return;
        const loadHistory = async () => {
            setLoadingHistory(true);
            try {
                setErrorMsg('');
                const res = await fetch(
                    `${API_BASE_URL}/chat-historico/${currentSessionId}`,
                    {
                        headers: { Authorization: 'Bearer ' + token }
                    }
                );
                const data = await res.json();
                if (data.mensagens) {
                    const formatado = data.mensagens.flatMap((m: { pergunta: string; resposta: string }) => [
                        { remetente: 'usuario' as const, texto: m.pergunta },
                        { remetente: 'bot' as const, texto: m.resposta }
                    ]);
                    setHistorico(formatado);
                } else {
                    setHistorico([]);
                }
            } catch (err) {
                console.error('Erro histórico:', err);
                setErrorMsg('Erro ao carregar histórico.');
                setHistorico([]);
            } finally {
                setLoadingHistory(false);
            }
        };
        loadHistory();
    }, [token, currentSessionId]);

    // Enviar mensagem
    const enviarMensagem = async () => {
        if (!mensagem.trim() || !token || sending) return;

        const userMsg: Mensagem = { remetente: 'usuario', texto: mensagem };
        setHistorico((prev) => [...prev, userMsg]);
        const mensagemAtual = mensagem;
        setMensagem('');
        setIsTyping(true);
        setSending(true);
        setErrorMsg('');

        try {
            const res = await fetch(`${API_BASE_URL}/chat-rag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({
                    mensagem: mensagemAtual,
                    sessionId: currentSessionId,
                    agentId: selectedAgent?.id || null
                })
            });
            const data = await res.json();
            if (data.erro) throw new Error(data.erro);

            if (data.sessionId && data.sessionId !== currentSessionId) {
                setCurrentSessionId(data.sessionId);
                fetchSessions();
            }

            const botMsg: Mensagem = {
                remetente: 'bot',
                texto: data.resposta || '(Sem resposta)'
            };
            setHistorico((prev) => {
                setTypingMessageIdx(prev.length);
                return [...prev, botMsg];
            });
        } catch (err) {
            console.error('Erro no chat-rag:', err);
            setErrorMsg('Erro ao enviar mensagem.');
            const botMsg: Mensagem = {
                remetente: 'bot',
                texto: 'Erro ao processar a pergunta.'
            };
            setHistorico((prev) => {
                setTypingMessageIdx(prev.length);
                return [...prev, botMsg];
            });
        } finally {
            setIsTyping(false);
            setDots('');
            setSending(false);
        }
    };

    // Nova sessão
    const handleNewChat = async (silent = false) => {
        if (!token) return;
        try {
            if (!silent) setLoadingSessions(true);
            const res = await fetch(`${API_BASE_URL}/sessoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.sessao) {
                setSessions((prev) => [data.sessao, ...prev]);
                setCurrentSessionId(data.sessao.id);
                setHistorico([]);
            } else {
                throw new Error('Não foi possível criar sessão');
            }
        } catch (err) {
            console.error('Erro criando sessão:', err);
            setErrorMsg('Erro ao criar novo chat.');
        } finally {
            if (!silent) setLoadingSessions(false);
        }
    };

    // Selecionar sessão
    const handleSelectSession = (id: string) => {
        if (selectionMode) {
            toggleSelect(id);
            return;
        }
        if (id === currentSessionId) return;
        setCurrentSessionId(id);
        setHistorico([]);
    };

    // Renomear sessão
    const startRename = (sessao: Sessao) => {
        if (selectionMode) return;
        setEditingSessionId(sessao.id);
        setEditingTitleValue(sessao.titulo || '');
    };

    const commitRename = async () => {
        const id = editingSessionId;
        if (!id) return;
        const newTitle = editingTitleValue.trim();
        setEditingSessionId(null);
        if (!newTitle) return;
        try {
            const res = await fetch(`${API_BASE_URL}/sessoes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({ titulo: newTitle })
            });
            const data = await res.json();
            if (data.sessao) {
                setSessions((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, titulo: data.sessao.titulo } : s))
                );
            }
        } catch (err) {
            console.error('Erro renomeando sessão:', err);
            setErrorMsg('Falha ao renomear.');
        }
    };

    // Seleção múltipla
    const toggleSelectionMode = () => {
        if (selectionMode) setSelectedSessions(new Set());
        setSelectionMode((m) => !m);
    };

    const toggleSelect = (id: string) => {
        setSelectedSessions((prev) => {
            const ns = new Set(prev);
            if (ns.has(id)) ns.delete(id);
            else ns.add(id);
            return ns;
        });
    };

    // Excluir sessões
    const handleDeleteSelected = async () => {
        if (selectedSessions.size === 0) return;
        if (!window.confirm(`Apagar ${selectedSessions.size} conversa(s)? Isso não pode ser desfeito.`)) return;
        setDeleting(true);
        try {
            for (const id of selectedSessions) {
                await fetch(`${API_BASE_URL}/sessoes/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: 'Bearer ' + token }
                }).catch(() => { });
            }
            await fetchSessions();
            if (currentSessionId && selectedSessions.has(currentSessionId)) {
                setCurrentSessionId(null);
                setHistorico([]);
            }
            setSelectedSessions(new Set());
        } catch (err) {
            console.error('Erro apagando sessões:', err);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteSingle = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Apagar esta conversa?')) return;
        try {
            await fetch(`${API_BASE_URL}/sessoes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: 'Bearer ' + token }
            });
            if (id === currentSessionId) {
                setCurrentSessionId(null);
                setHistorico([]);
            }
            await fetchSessions();
        } catch (err) {
            console.error('Erro apagando conversa:', err);
            setErrorMsg('Falha ao apagar conversa.');
        }
    };

    // Filtrar sessões
    const normalizedSessions = useMemo(
        () =>
            sessions.map((s) => ({
                ...s,
                _tituloExibicao: s.titulo && s.titulo.trim() ? s.titulo : '(Sem título)'
            })),
        [sessions]
    );

    const filteredSessions = useMemo(() => {
        const q = sessionSearch.trim().toLowerCase();
        if (!q) return normalizedSessions;
        return normalizedSessions.filter((s) =>
            s._tituloExibicao?.toLowerCase().includes(q)
        );
    }, [sessionSearch, normalizedSessions]);

    // Copiar texto
    const copyToClipboard = (texto: string) => {
        try {
            navigator.clipboard.writeText(texto);
        } catch { }
    };

    // Regenerar última
    const regenerateLast = async () => {
        const lastUser = [...historico].reverse().find((m) => m.remetente === 'usuario');
        if (lastUser) {
            setMensagem(lastUser.texto);
            setTimeout(() => enviarMensagem(), 50);
        }
    };

    // Handle Enter
    const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    };

    // Selecionar agente e iniciar chat
    const handleStartWithAgent = async (agent: Agent) => {
        setSelectedAgent(agent);
        await handleNewChat();
    };

    return (
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
            {/* Sidebar Esquerda */}
            <aside className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col`}>
                <div className="p-4 border-b border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                        >
                            <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <img src="https://i.imgur.com/X6sfs4c.png" alt="Neurocom" className="w-8 h-8" />
                            <span className="font-semibold text-light-text dark:text-dark-text">Neurocom</span>
                        </Link>
                    </div>
                </div>

                {/* Pesquisa */}
                <div className="p-3">
                    <input
                        type="text"
                        placeholder="Pesquisar chats..."
                        value={sessionSearch}
                        onChange={(e) => setSessionSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary text-sm focus:outline-none focus:border-neuro-green transition-colors"
                    />
                </div>

                {/* Menu */}
                <nav className="p-3 space-y-1">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm">Dashboard</span>
                    </Link>
                </nav>

                {/* User */}
                <div className="mt-auto p-4 border-t border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neuro-green/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-neuro-green">
                                {user?.nome?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                                {user?.nome}
                            </p>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500 transition-colors text-center py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {/* Área Principal */}
            <main className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                        >
                            <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowSessionsPanel(!showSessionsPanel)}
                            className="p-2 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                            title="Alternar lista de conversas"
                        >
                            <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleNewChat()}
                            disabled={selectionMode || sending}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neuro-green/10 text-neuro-green hover:bg-neuro-green/20 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nova conversa
                        </button>
                    </div>

                    <h1 className="text-lg font-semibold text-light-text dark:text-dark-text truncate max-w-md">
                        {sessions.find((s) => s.id === currentSessionId)?.titulo || 'Chat'}
                    </h1>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-light-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex min-h-0">
                    {/* Chat Area */}
                    <section
                        ref={chatAreaRef}
                        className="flex-1 overflow-y-auto px-4 py-6 relative"
                    >
                        {loadingHistory && (
                            <div className="text-center text-light-text-secondary dark:text-dark-text-secondary py-4">
                                Carregando histórico...
                            </div>
                        )}

                        {/* Tela de boas-vindas */}
                        {!loadingHistory && historico.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center py-12">
                                <div className="w-20 h-20 mb-6 rounded-full bg-neuro-green/10 flex items-center justify-center">
                                    <img
                                        src="https://i.imgur.com/lvJTfiM.png"
                                        alt="IA Noesis"
                                        className="w-14 h-14 object-contain"
                                    />
                                </div>
                                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                                    IA Noesis
                                </h1>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
                                    {selectedAgent
                                        ? `Agente ${selectedAgent.name} ativo. Como posso te ajudar?`
                                        : 'Qual agente você quer ativar hoje?'}
                                </p>

                                {!selectedAgent && (
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                                        {loadingAgents ? (
                                            <div className="col-span-2 text-light-text-secondary dark:text-dark-text-secondary">
                                                Carregando agentes...
                                            </div>
                                        ) : (
                                            agents.map((agent) => (
                                                <button
                                                    key={agent.id}
                                                    onClick={() => handleStartWithAgent(agent)}
                                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-neuro-green hover:bg-neuro-green/5 transition-all duration-200"
                                                >
                                                    <span className="text-3xl">{agent.icon}</span>
                                                    <span className="font-medium text-light-text dark:text-dark-text">
                                                        {agent.name}
                                                    </span>
                                                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary text-center">
                                                        {agent.description}
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}

                                {selectedAgent && (
                                    <div className="w-full max-w-lg">
                                        <div className="flex items-center justify-center gap-2 mb-6">
                                            <span className="text-2xl">{selectedAgent.icon}</span>
                                            <span className="font-medium text-light-text dark:text-dark-text">
                                                {selectedAgent.name}
                                            </span>
                                            <button
                                                onClick={() => setSelectedAgent(null)}
                                                className="ml-2 p-1 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg text-light-text-secondary"
                                                title="Trocar agente"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {selectedAgent.starters && selectedAgent.starters.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
                                                    Comece por:
                                                </p>
                                                <div className="space-y-2">
                                                    {selectedAgent.starters.map((starter, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setMensagem(starter)}
                                                            className="w-full text-left px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-neuro-green text-sm text-light-text dark:text-dark-text transition-colors"
                                                        >
                                                            {starter}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mensagens */}
                        {historico.map((msg, idx) => {
                            const isUser = msg.remetente === 'usuario';
                            return (
                                <div
                                    key={idx}
                                    className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ${isUser ? 'bg-neuro-green/20' : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border'}`}>
                                        {isUser ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-neuro-green">
                                                    {user?.nome?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                src="https://i.imgur.com/lvJTfiM.png"
                                                alt="IA"
                                                className="w-full h-full object-contain p-1"
                                            />
                                        )}
                                    </div>
                                    <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-sm font-medium ${isUser ? 'text-neuro-green' : 'text-light-text dark:text-dark-text'}`}>
                                                {isUser ? 'Você' : 'Assistente'}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(msg.texto)}
                                                className="p-1 rounded hover:bg-light-bg dark:hover:bg-dark-bg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Copiar"
                                            >
                                                <svg className="w-4 h-4 text-light-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            {!isUser && idx === historico.length - 1 && (
                                                <button
                                                    onClick={regenerateLast}
                                                    disabled={sending}
                                                    className="p-1 rounded hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                                                    title="Regenerar"
                                                >
                                                    <svg className="w-4 h-4 text-light-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className={`inline-block px-4 py-3 rounded-2xl ${isUser ? 'bg-neuro-green text-white' : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text'}`}>
                                            {!isUser && idx === historico.length - 1 && typingMessageIdx === idx ? (
                                                <TypewriterText
                                                    text={msg.texto}
                                                    speed={8}
                                                    onComplete={() => setTypingMessageIdx(null)}
                                                />
                                            ) : (
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <ReactMarkdown>{msg.texto}</ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden">
                                    <img
                                        src="https://i.imgur.com/lvJTfiM.png"
                                        alt="IA"
                                        className="w-full h-full object-contain p-1"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="inline-block px-4 py-3 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                                        <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                            Gerando{dots}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {errorMsg && (
                            <div className="flex justify-center mb-6">
                                <div className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                                    {errorMsg}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />

                        {/* Scroll to bottom button */}
                        {showScrollButton && (
                            <button
                                onClick={() => scrollToBottom()}
                                className="fixed bottom-24 right-8 p-3 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-lg hover:bg-neuro-green/10 transition-colors z-10"
                                title="Ir para o final"
                            >
                                <svg className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                        )}
                    </section>

                    {/* Sessions Panel */}
                    <aside className={`${showSessionsPanel ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden bg-light-surface dark:bg-dark-surface border-l border-light-border dark:border-dark-border flex flex-col`}>
                        <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                            <button
                                onClick={() => handleNewChat()}
                                disabled={selectionMode}
                                className="flex-1 px-4 py-2 rounded-xl bg-neuro-green text-white font-medium text-sm hover:bg-neuro-green-dark transition-colors disabled:opacity-50"
                            >
                                Novo chat
                            </button>
                            <button
                                onClick={toggleSelectionMode}
                                className="ml-2 px-3 py-2 rounded-xl text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                            >
                                {selectionMode ? 'Cancelar' : 'Selecionar'}
                            </button>
                        </div>

                        {selectionMode && selectedSessions.size > 0 && (
                            <div className="p-3 bg-red-50 dark:bg-red-500/10 border-b border-light-border dark:border-dark-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-red-600 dark:text-red-400">
                                        {selectedSessions.size} selecionada(s)
                                    </span>
                                    <button
                                        onClick={handleDeleteSelected}
                                        disabled={deleting}
                                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {deleting ? '...' : 'Apagar'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-3 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                            {loadingSessions ? 'Carregando...' : 'Seus chats'}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredSessions.map((sessao) => {
                                const active = sessao.id === currentSessionId;
                                const checked = selectedSessions.has(sessao.id);
                                return (
                                    <div
                                        key={sessao.id}
                                        onClick={() => handleSelectSession(sessao.id)}
                                        onDoubleClick={() => startRename(sessao)}
                                        className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${active
                                                ? 'bg-neuro-green/10 border-l-2 border-neuro-green'
                                                : 'hover:bg-light-bg dark:hover:bg-dark-bg'
                                            } ${checked ? 'bg-neuro-green/5' : ''}`}
                                        title={selectionMode ? 'Clique para selecionar' : 'Duplo clique para renomear'}
                                    >
                                        {selectionMode && (
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleSelect(sessao.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-4 h-4 rounded border-light-border dark:border-dark-border text-neuro-green focus:ring-neuro-green"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {editingSessionId === sessao.id ? (
                                                <input
                                                    autoFocus
                                                    value={editingTitleValue}
                                                    onChange={(e) => setEditingTitleValue(e.target.value)}
                                                    onBlur={commitRename}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') commitRename();
                                                        else if (e.key === 'Escape') setEditingSessionId(null);
                                                    }}
                                                    className="w-full px-2 py-1 rounded bg-light-bg dark:bg-dark-bg border border-neuro-green text-sm text-light-text dark:text-dark-text focus:outline-none"
                                                />
                                            ) : (
                                                <span className={`block truncate text-sm ${active ? 'font-semibold text-neuro-green' : 'text-light-text dark:text-dark-text'}`}>
                                                    {sessao._tituloExibicao}
                                                </span>
                                            )}
                                        </div>
                                        {!selectionMode && (
                                            <button
                                                onClick={(e) => handleDeleteSingle(e, sessao.id)}
                                                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 text-light-text-secondary hover:text-red-500 transition-all"
                                                title="Apagar"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            {filteredSessions.length === 0 && !loadingSessions && (
                                <div className="px-4 py-8 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    Nenhum chat encontrado.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Footer Input */}
                <footer className="border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-end gap-3 bg-light-bg dark:bg-dark-bg rounded-2xl border border-light-border dark:border-dark-border p-3">
                            <textarea
                                ref={textareaRef}
                                className="flex-1 resize-none bg-transparent text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary focus:outline-none text-sm min-h-[24px] max-h-[200px]"
                                placeholder={sending ? 'Enviando...' : 'Digite sua mensagem (Enter envia, Shift+Enter quebra linha)...'}
                                value={mensagem}
                                disabled={sending}
                                onChange={(e) => setMensagem(e.target.value)}
                                onKeyDown={handleTextareaKeyDown}
                                rows={1}
                            />
                            <button
                                onClick={enviarMensagem}
                                disabled={sending || !mensagem.trim()}
                                className="flex-shrink-0 p-3 rounded-xl bg-neuro-green text-white hover:bg-neuro-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Enviar mensagem"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
