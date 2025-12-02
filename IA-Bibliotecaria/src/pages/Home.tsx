export default function Home() {
  return (
    <section id="home" className="space-y-2">
      <h2 className="text-xl font-semibold">Página Inicial</h2>
      <p className="text-gray-700">Este é um ponto de partida limpo para evoluir sua aplicação.</p>
      <ul className="list-disc pl-5 text-gray-600 space-y-1">
        <li>Componentes reutilizáveis em <code>src/components</code></li>
        <li>Contexto global em <code>src/context</code></li>
        <li>Hooks customizados em <code>src/hooks</code></li>
        <li>Estilos Tailwind em <code>src/assets/styles</code></li>
      </ul>
    </section>
  );
}
