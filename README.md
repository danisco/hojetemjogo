
# Hoje Tem Jogo — build estático com atualização programada

- Gera **HTML no servidor** (index + `/dias/YYYY-MM-DD/` + `/times/<slug>` ) com dados da **API-FOOTBALL**.
- **Atualização automática 2x por dia** via _Deploy Hook do Vercel_ (ou GitHub Actions).
- Ótimo para **SEO**: conteúdo já vem no HTML (JSON-LD incluído).

## Como funciona
Durante o build (`node scripts/build.js`), o script busca os jogos de **hoje e amanhã** e escreve:
- `index.html` (Hoje e Amanhã)
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

### Atualização Automática Diária

**IMPORTANTE:** O site deve ser reconstruído diariamente para mostrar sempre os jogos de HOJE.

#### Opção 1: GitHub Actions (Recomendado)
1. No GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. Adicione o secret: `VERCEL_DEPLOY_HOOK_URL` com a URL do seu Deploy Hook do Vercel
3. O arquivo `.github/workflows/scheduled-redeploy.yml` já está configurado para:
   - Executar 2x por dia (9h e 21h UTC = 6h e 18h Brasil)
   - Triggerar automaticamente rebuild do Vercel
   - Garantir que "hoje" sempre seja a data atual

#### Opção 2: Vercel Cron Jobs  
1. Em Vercel → Project → Settings → **Deploy Hooks** → crie um Hook (`main`)
2. Em **Settings → Cron Jobs**, adicione 2 crons (UTC):
   - `0 9 * * *` → chama o Deploy Hook  
   - `0 21 * * *` → chama o Deploy Hook

#### Para testar manualmente:
```bash
npm run build  # Sempre gera com a data de HOJE
```

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
