export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-gray-400">
        <p>
          © {year} Hoje Tem Jogo. Dados fornecidos por{' '}
          <a
            href="https://www.api-football.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-700"
          >
            API-Football
          </a>
          . Informações de transmissão podem variar — confirme na programação da emissora.
        </p>
      </div>
    </footer>
  );
}
