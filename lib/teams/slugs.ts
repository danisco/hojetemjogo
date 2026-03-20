/**
 * Maps URL slugs → API-Football team IDs.
 * These IDs can be verified at: https://www.api-football.com/documentation-v3#tag/Teams
 *
 * Ported from assets/brazilian-teams-complete.js, enriched with API IDs from the build script.
 */

export interface TeamInfo {
  apiId: number;
  name: string;
  slug: string;
  aliases: string[];
  state: string;
}

export const TEAMS: TeamInfo[] = [
  // ── Série A ──────────────────────────────────────────────────────────────
  { apiId: 122, name: 'Athletico-PR',   slug: 'athletico-pr',  aliases: ['Athletico Paranaense', 'CAP', 'Furacão'],                          state: 'PR' },
  { apiId: 130, name: 'Atlético-MG',    slug: 'atletico-mg',   aliases: ['Atlético Mineiro', 'Galo', 'CAM'],                                 state: 'MG' },
  { apiId: 0,   name: 'Bahia',          slug: 'bahia',         aliases: ['Esquadrão de Aço', 'Tricolor Baiano'],                             state: 'BA' },
  { apiId: 120, name: 'Botafogo',       slug: 'botafogo',      aliases: ['Fogão', 'Estrela Solitária', 'Glorioso'],                          state: 'RJ' },
  { apiId: 0,   name: 'Bragantino',     slug: 'bragantino',    aliases: ['Red Bull Bragantino', 'Massa Bruta'],                              state: 'SP' },
  { apiId: 119, name: 'Corinthians',    slug: 'corinthians',   aliases: ['Timão', 'Sport Club Corinthians Paulista', 'Alvinegro'],           state: 'SP' },
  { apiId: 0,   name: 'Criciúma',       slug: 'criciuma',      aliases: ['Tigre', 'Criciúma EC'],                                            state: 'SC' },
  { apiId: 129, name: 'Cruzeiro',       slug: 'cruzeiro',      aliases: ['Raposa', 'Cruzeiro EC', 'Celeste'],                                state: 'MG' },
  { apiId: 0,   name: 'Cuiabá',         slug: 'cuiaba',        aliases: ['Dourado', 'Arsenal'],                                              state: 'MT' },
  { apiId: 127, name: 'Flamengo',       slug: 'flamengo',      aliases: ['Mengão', 'Rubro-Negro', 'CRF', 'Fla'],                            state: 'RJ' },
  { apiId: 125, name: 'Fluminense',     slug: 'fluminense',    aliases: ['Flu', 'Tricolor Carioca', 'Time de Guerreiros'],                   state: 'RJ' },
  { apiId: 0,   name: 'Fortaleza',      slug: 'fortaleza',     aliases: ['Leão do Pici', 'Tricolor de Aço'],                                state: 'CE' },
  { apiId: 131, name: 'Grêmio',         slug: 'gremio',        aliases: ['Tricolor Gaúcho', 'Imortal'],                                     state: 'RS' },
  { apiId: 132, name: 'Internacional',  slug: 'internacional', aliases: ['Inter', 'Colorado', 'SC Internacional'],                          state: 'RS' },
  { apiId: 0,   name: 'Juventude',      slug: 'juventude',     aliases: ['Ju', 'Papo', 'EC Juventude'],                                     state: 'RS' },
  { apiId: 121, name: 'Palmeiras',      slug: 'palmeiras',     aliases: ['Verdão', 'Alviverde', 'SEP'],                                     state: 'SP' },
  { apiId: 126, name: 'São Paulo',      slug: 'sao-paulo',     aliases: ['SPFC', 'Tricolor Paulista', 'Soberano'],                          state: 'SP' },
  { apiId: 128, name: 'Santos',         slug: 'santos',        aliases: ['Peixe', 'Alvinegro Praiano', 'SFC'],                              state: 'SP' },
  { apiId: 124, name: 'Vasco',          slug: 'vasco',         aliases: ['Vasco da Gama', 'Gigante da Colina', 'Cruzmaltino'],              state: 'RJ' },
  { apiId: 0,   name: 'Vitória',        slug: 'vitoria',       aliases: ['Leão da Barra', 'Rubro-Negro Baiano'],                            state: 'BA' },

  // ── Série B ──────────────────────────────────────────────────────────────
  { apiId: 155, name: 'América-MG',    slug: 'america-mg',    aliases: ['Coelho', 'América Mineiro'],                                       state: 'MG' },
  { apiId: 0,   name: 'Avaí',          slug: 'avai',          aliases: ['Leão da Ilha'],                                                    state: 'SC' },
  { apiId: 0,   name: 'Ceará',         slug: 'ceara',         aliases: ['Vozão', 'Alvinegro de Porangabuçu'],                              state: 'CE' },
  { apiId: 0,   name: 'Chapecoense',   slug: 'chapecoense',   aliases: ['Chape', 'Verdão do Oeste'],                                       state: 'SC' },
  { apiId: 123, name: 'Coritiba',      slug: 'coritiba',      aliases: ['Coxa', 'Verdão'],                                                 state: 'PR' },
  { apiId: 0,   name: 'CRB',           slug: 'crb',           aliases: ['Clube de Regatas Brasil', 'Galo da Pajuçara'],                    state: 'AL' },
  { apiId: 156, name: 'Goiás',         slug: 'goias',         aliases: ['Verdão', 'Esmeraldino'],                                          state: 'GO' },
  { apiId: 0,   name: 'Guarani',       slug: 'guarani',       aliases: ['Bugre'],                                                          state: 'SP' },
  { apiId: 0,   name: 'Sport',         slug: 'sport',         aliases: ['Leão da Ilha'],                                                   state: 'PE' },
  { apiId: 0,   name: 'Vila Nova',     slug: 'vila-nova',     aliases: ['Tigre'],                                                          state: 'GO' },
];

/** Slug → TeamInfo */
const slugIndex = new Map(TEAMS.map((t) => [t.slug, t]));

/** API team ID → TeamInfo (only for teams with known IDs) */
const apiIdIndex = new Map(
  TEAMS.filter((t) => t.apiId > 0).map((t) => [t.apiId, t])
);

export function getTeamBySlug(slug: string): TeamInfo | undefined {
  return slugIndex.get(slug);
}

export function getTeamByApiId(apiId: number): TeamInfo | undefined {
  return apiIdIndex.get(apiId);
}

/** All teams that have a known API ID (can be used for team-page generation) */
export const TEAMS_WITH_API_IDS = TEAMS.filter((t) => t.apiId > 0);
