# Hoje Tem Jogo — site estático

Site simples, bonito e **estático** que mostra os jogos do dia no Brasil e links de onde assistir (Google Search), usando **API-FOOTBALL** no client-side.

> ⚠️ Ideal: mover a chamada de API para um **proxy/serveless** (Netlify Functions, Vercel Edge, Cloudflare Workers) para **não expor** a chave pública. Aqui incluímos um `config.js` por praticidade.

## Como usar

1. **Edite/rotacione a sua chave** em `config.js` (ou copie `config.example.js` para `config.js`).
2. Coloque os arquivos em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
3. Pronto. O site carrega os jogos de hoje; se não houver, mostra os próximos dias. Há busca por time e botão "Ver mais".

### Desenvolvimento local

Abra `index.html` no navegador. Se o CORS do provedor bloquear, use um servidor local (ex.: `python -m http.server 5173`) e acesse `http://localhost:5173`.

## SEO

- Título, descrição, palavras-chave e JSON-LD (SportsEvent / ItemList).
- Conteúdo em português e termos populares: *jogo do [time] hoje*, *horário do jogo*, *onde assistir [time]*, *canal que transmite*, *transmissão ao vivo*, *Brasileirão*, *Libertadores*, *Copa do Brasil*.
- `robots.txt` e `sitemap.xml` incluídos.

## Onde assistir

A API-FOOTBALL nem sempre fornece canais. Por enquanto, apontamos para uma busca "onde assistir [mandante] x [visitante]".
Sugestão: criar um pequeno serviço que faça scraping de fontes confiáveis ou integre um provedor com dados de transmissão, e preencher no front.

## Licença

MIT
