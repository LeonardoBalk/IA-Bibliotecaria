export default function Header() {
  return (
    <header className="flex items-center justify-between border-b pb-4">
      <span className="font-semibold tracking-wide text-indigo-600">IA Bibliotecária</span>
      <nav className="flex gap-4 text-sm">
        <a className="hover:text-indigo-600" href="#home">Home</a>
        <a className="hover:text-indigo-600" href="#docs">Docs</a>
        <a className="hover:text-indigo-600" href="#sobre">Sobre</a>
      </nav>
    </header>
  );
}
