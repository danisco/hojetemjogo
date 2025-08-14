
# Hoje Tem Jogo — build estático com atualização programada

- Gera **HTML no servidor** (index + `/dias/YYYY-MM-DD/` + `/times/<slug>` ) com dados da **API-FOOTBALL**.
- **Atualização automática 2x por dia** via _Deploy Hook do Vercel_ (ou GitHub Actions).
- Ótimo para **SEO**: conteúdo já vem no HTML (JSON-LD incluído).

## Como funciona
Durante o build (`node scripts/build.js`), o script busca os jogos de **hoje e próximos dias** e escreve:
- `index.html` (Hoje, Amanhã e Próximos)
- `dias/YYYY-MM-DD/index.html` (páginas por data)
- `times/<time>/index.html` (páginas por time)
- `data/YYYY-MM-DD.json` (dados brutos, útil para debug)
- `sitemap.xml` (inclui raiz, dias e times)

## Variáveis de ambiente
- `API_FOOTBALL_KEY` — sua chave da API-FOOTBALL (coloque no Vercel → Project → Settings → Environment Variables).
- `TZ` (opcional) — padrão `America/Sao_Paulo`.

## Vercel
- O repo tem `vercel.json` com `framework=other` e `buildCommand=node scripts/build.js`.
- Configure **Environment Variable** `API_FOOTBALL_KEY`.
- Faça um deploy para testar.

### Atualização 2x por dia (Deploy Hook)
1. Em Vercel → Project → Settings → **Deploy Hooks** → crie um Hook (`main`).
2. Em **Settings → Cron Jobs**, adicione 2 crons (UTC):
   - `0 9 * * *` → chama o Deploy Hook
   - `0 21 * * *` → chama o Deploy Hook
3. Cada cron dispara um deploy que roda o **build** e atualiza o HTML.

> Alternativa: use o GitHub Actions (arquivo em `.github/workflows/scheduled-redeploy.yml`) para chamar o Deploy Hook nos mesmos horários.

## Desenvolvimento local
```bash
# exporte sua chave localmente
export API_FOOTBALL_KEY="SUA_CHAVE"
npm run build
# abra index.html no navegador (ou sirva com um server estático)
```

## SEO
- Metatags + `keywords` (não mostram texto ao usuário).
- Páginas por time e por dia geram muita cauda longa ("onde assistir Flamengo", "jogo do Vasco hoje"...).
- JSON-LD (`ItemList`/`SportsEvent`) incluído.
