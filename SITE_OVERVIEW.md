# Hoje Tem Jogo - Site Overview

## What This Site Is About

**Hoje Tem Jogo** (hojetemjogo.com.br) is a comprehensive Brazilian football website that displays daily match schedules, broadcast information, and betting odds for Brazilian football competitions.

## Target Content & Filtering

The site focuses exclusively on:
- **Men's Brazilian football only** (no women's tournaments)
- **First division competitions only** (no 2a, 3a divisão state tournaments)
- **International matches only if Brazilian teams participate** (Libertadores, Sul-Americana)

### Supported Competitions
- Brasileirão Série A & B
- Copa do Brasil  
- CONMEBOL Libertadores (when Brazilian teams play)
- CONMEBOL Sul-Americana (when Brazilian teams play)
- State championships (first division only - Carioca, Paulista, etc.)

## Technical Architecture

### Data Source
- **API-Football** via RapidAPI for match data
- **The Odds API** for betting odds (free tier: 500 requests/month)

### Build Process
- Static site generated via `scripts/build.js`
- Runs daily to fetch fresh match data
- Applies strict content filtering
- Integrates betting odds when available
- Generates pages for dates, teams, and main index

### Content Filtering Logic
Located in `scripts/build.js`, the filtering removes:

**Women's tournaments:**
```javascript
if (league.includes('women') || league.includes('feminino') || league.includes('female') ||
    league.includes('w ') || league.endsWith(' w') || homeTeam.includes(' w ') || 
    awayTeam.includes(' w ') || homeTeam.endsWith(' w') || awayTeam.endsWith(' w')) {
  return false;
}
```

**Lower divisions:**
```javascript
if (league.includes('2a divisao') || league.includes('3a divisao') || league.includes('4a divisao') ||
    league.includes('segunda divisao') || league.includes('terceira divisao') || 
    league.includes('division 2') || league.includes('division 3') ||
    league.includes('serie c2') || league.includes('serie d') ||
    league.includes('2º divisão') || league.includes('3º divisão') ||
    league.includes('segunda categoria') || league.includes('terceira categoria')) {
  return false;
}
```

### Betting Odds Integration

**API Configuration:**
- Uses The Odds API (free tier)
- API key stored in `ODDS_API_KEY` environment variable
- Fetches odds for Brazilian leagues when available
- Graceful fallback when odds unavailable

**Odds Display:**
- Shows home/draw/away odds in match cards
- Color-coded: blue (home), gray (draw), red (away)
- Only displays when odds data is available
- Includes bookmaker attribution

## File Structure

```
/
├── scripts/build.js          # Main build script with filtering logic
├── data/YYYY-MM-DD.json     # Daily match data cache
├── index.html               # Main homepage
├── dias/YYYY-MM-DD/         # Daily match pages
├── times/[team-name]/       # Individual team pages
├── assets/                  # CSS, JS, images
└── SITE_OVERVIEW.md         # This documentation
```

## Key Features

1. **Daily Updates**: Automatically fetches and displays current match schedules
2. **Broadcast Information**: Shows where to watch (Globo, SporTV, Premiere, etc.)
3. **Team Pages**: Individual pages for 70+ Brazilian teams
4. **Calendar Navigation**: Easy browsing between dates
5. **Search & Filtering**: Find matches by team or competition
6. **Betting Odds**: Live odds display when available
7. **Mobile Responsive**: Optimized for all devices
8. **SEO Optimized**: Rich metadata and structured data

## Environment Variables

- `API_FOOTBALL_KEY`: API-Football access key
- `ODDS_API_KEY`: The Odds API key (optional, odds features disabled if missing)

## Recent Major Changes

**August 2025 Updates:**
- Implemented strict women's tournament filtering
- Added lower division state tournament exclusions
- Integrated The Odds API for betting odds
- Enhanced match cards with odds display
- Improved content filtering logic

## Running the Build

```bash
node scripts/build.js
```

This generates all static pages with current match data, applying all filters and fetching odds when possible.

## Content Philosophy

The site serves Brazilian football fans who want:
- Quick access to today's men's professional matches
- Reliable broadcast information
- Optional betting odds for informed decisions
- Clean, fast, mobile-friendly experience
- Focus on first-division Brazilian football only

No women's football, no amateur/lower divisions, no non-Brazilian content unless it involves Brazilian teams in international competitions.