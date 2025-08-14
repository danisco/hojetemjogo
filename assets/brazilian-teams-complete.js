// Comprehensive Brazilian Football Teams Database
// Updated with all Serie A, B, C teams and major regional teams

window.BRAZILIAN_TEAMS = {
  // Serie A 2024 - All 20 teams
  serieA: [
    { name: "Athletico-PR", slug: "athletico-pr", aliases: ["Athletico Paranaense", "CAP", "Furacão"], state: "PR" },
    { name: "Atlético-MG", slug: "atletico-mg", aliases: ["Atlético Mineiro", "Galo", "CAM"], state: "MG" },
    { name: "Bahia", slug: "bahia", aliases: ["Esquadrão de Aço", "Tricolor Baiano"], state: "BA" },
    { name: "Botafogo", slug: "botafogo", aliases: ["Fogão", "Estrela Solitária", "Glorioso"], state: "RJ" },
    { name: "Bragantino", slug: "bragantino", aliases: ["Red Bull Bragantino", "Massa Bruta"], state: "SP" },
    { name: "Corinthians", slug: "corinthians", aliases: ["Timão", "Sport Club Corinthians Paulista", "Alvinegro"], state: "SP" },
    { name: "Criciúma", slug: "criciuma", aliases: ["Tigre", "Criciúma EC"], state: "SC" },
    { name: "Cruzeiro", slug: "cruzeiro", aliases: ["Raposa", "Cruzeiro EC", "Celeste"], state: "MG" },
    { name: "Cuiabá", slug: "cuiaba", aliases: ["Dourado", "Arsenal"], state: "MT" },
    { name: "Flamengo", slug: "flamengo", aliases: ["Mengão", "Rubro-Negro", "CRF", "Fla"], state: "RJ" },
    { name: "Fluminense", slug: "fluminense", aliases: ["Flu", "Tricolor Carioca", "Time de Guerreiros"], state: "RJ" },
    { name: "Fortaleza", slug: "fortaleza", aliases: ["Leão do Pici", "Tricolor de Aço"], state: "CE" },
    { name: "Grêmio", slug: "gremio", aliases: ["Tricolor Gaúcho", "Imortal"], state: "RS" },
    { name: "Internacional", slug: "internacional", aliases: ["Inter", "Colorado", "SC Internacional"], state: "RS" },
    { name: "Juventude", slug: "juventude", aliases: ["Ju", "Papo", "EC Juventude"], state: "RS" },
    { name: "Palmeiras", slug: "palmeiras", aliases: ["Verdão", "Alviverde", "SEP"], state: "SP" },
    { name: "São Paulo", slug: "sao-paulo", aliases: ["SPFC", "Tricolor Paulista", "Soberano"], state: "SP" },
    { name: "Santos", slug: "santos", aliases: ["Peixe", "Alvinegro Praiano", "SFC"], state: "SP" },
    { name: "Vasco", slug: "vasco", aliases: ["Vasco da Gama", "Gigante da Colina", "Cruzmaltino"], state: "RJ" },
    { name: "Vitória", slug: "vitoria", aliases: ["Leão da Barra", "Rubro-Negro Baiano"], state: "BA" }
  ],

  // Serie B 2024 - All 20 teams
  serieB: [
    { name: "América-MG", slug: "america-mg", aliases: ["Coelho", "América Mineiro"], state: "MG" },
    { name: "Avaí", slug: "avai", aliases: ["Leão da Ilha"], state: "SC" },
    { name: "Ceará", slug: "ceara", aliases: ["Vozão", "Alvinegro de Porangabuçu"], state: "CE" },
    { name: "Chapecoense", slug: "chapecoense", aliases: ["Chape", "Verdão do Oeste"], state: "SC" },
    { name: "Coritiba", slug: "coritiba", aliases: ["Coxa", "Verdão"], state: "PR" },
    { name: "CRB", slug: "crb", aliases: ["Clube de Regatas Brasil", "Galo da Pajuçara"], state: "AL" },
    { name: "Goiás", slug: "goias", aliases: ["Verdão", "Esmeraldino"], state: "GO" },
    { name: "Guarani", slug: "guarani", aliases: ["Bugre"], state: "SP" },
    { name: "Ituano", slug: "ituano", aliases: ["Galo de Itu"], state: "SP" },
    { name: "Londrina", slug: "londrina", aliases: ["Tubarão"], state: "PR" },
    { name: "Mirassol", slug: "mirassol", aliases: ["Leão"], state: "SP" },
    { name: "Novorizontino", slug: "novorizontino", aliases: ["Tigre"], state: "SP" },
    { name: "Operário-PR", slug: "operario-pr", aliases: ["Fantasma"], state: "PR" },
    { name: "Paysandu", slug: "paysandu", aliases: ["Papão", "Bicolor"], state: "PA" },
    { name: "Ponte Preta", slug: "ponte-preta", aliases: ["Macaca"], state: "SP" },
    { name: "Remo", slug: "remo", aliases: ["Leão Azul"], state: "PA" },
    { name: "Sport", slug: "sport", aliases: ["Leão da Ilha"], state: "PE" },
    { name: "Tombense", slug: "tombense", aliases: ["Gavião Carcará"], state: "MG" },
    { name: "Vila Nova", slug: "vila-nova", aliases: ["Tigre"], state: "GO" },
    { name: "Volta Redonda", slug: "volta-redonda", aliases: ["Esquadrão de Aço"], state: "RJ" }
  ],

  // Serie C 2024 - Major teams (20 teams)
  serieC: [
    { name: "ABC", slug: "abc", aliases: ["ABC FC"], state: "RN" },
    { name: "Altos", slug: "altos", aliases: ["Jacaré"], state: "PI" },
    { name: "Aparecidense", slug: "aparecidense", aliases: ["Camaleão"], state: "GO" },
    { name: "Athletic Club", slug: "athletic-club", aliases: ["Esquadrão"], state: "MG" },
    { name: "Atlético-GO", slug: "atletico-go", aliases: ["Dragão"], state: "GO" },
    { name: "Botafogo-PB", slug: "botafogo-pb", aliases: ["Belo"], state: "PB" },
    { name: "Botafogo-SP", slug: "botafogo-sp", aliases: ["Pantera"], state: "SP" },
    { name: "Campinense", slug: "campinense", aliases: ["Raposa"], state: "PB" },
    { name: "Caxias", slug: "caxias", aliases: ["Grená"], state: "RS" },
    { name: "CSA", slug: "csa", aliases: ["Azulão"], state: "AL" },
    { name: "Figueirense", slug: "figueirense", aliases: ["Furacão do Estreito"], state: "SC" },
    { name: "Floresta", slug: "floresta", aliases: ["Lobo"], state: "CE" },
    { name: "Londrina", slug: "londrina-ec", aliases: ["Tubarão"], state: "PR" },
    { name: "Manaus", slug: "manaus", aliases: ["Gavião do Norte"], state: "AM" },
    { name: "Náutico", slug: "nautico", aliases: ["Timbu"], state: "PE" },
    { name: "Sampaio Corrêa", slug: "sampaio-correa", aliases: ["Tricolor Boliviano"], state: "MA" },
    { name: "São Bernardo", slug: "sao-bernardo", aliases: ["Cachorrão"], state: "SP" },
    { name: "São José-RS", slug: "sao-jose-rs", aliases: ["Zeca"], state: "RS" },
    { name: "Treze", slug: "treze", aliases: ["Galo da Borborema"], state: "PB" },
    { name: "Ypiranga-RS", slug: "ypiranga-rs", aliases: ["Canarinho"], state: "RS" }
  ],

  // Major regional teams and historical clubs
  regional: [
    { name: "4 de Julho", slug: "4-de-julho", aliases: ["Colorado"], state: "PI" },
    { name: "Alecrim", slug: "alecrim", aliases: ["Diabo Encarnado"], state: "RN" },
    { name: "América-RN", slug: "america-rn", aliases: ["Mecão"], state: "RN" },
    { name: "Atlético Acreano", slug: "atletico-acreano", aliases: ["Galo Carijó"], state: "AC" },
    { name: "Brusque", slug: "brusque", aliases: ["Quadricolor"], state: "SC" },
    { name: "Confiança", slug: "confianca", aliases: ["Dragão do Bairro Industrial"], state: "SE" },
    { name: "Ferroviária", slug: "ferroviaria", aliases: ["Locomotiva"], state: "SP" },
    { name: "Portuguesa", slug: "portuguesa", aliases: ["Lusa"], state: "SP" },
    { name: "Rio Branco-AC", slug: "rio-branco-ac", aliases: ["Estrelão"], state: "AC" },
    { name: "Santa Cruz", slug: "santa-cruz", aliases: ["Cobra Coral"], state: "PE" }
  ]
};

// Flatten all teams for easy searching
window.ALL_BRAZILIAN_TEAMS = [
  ...window.BRAZILIAN_TEAMS.serieA,
  ...window.BRAZILIAN_TEAMS.serieB,
  ...window.BRAZILIAN_TEAMS.serieC,
  ...window.BRAZILIAN_TEAMS.regional
];

// Create search index with all names and aliases
window.TEAM_SEARCH_INDEX = window.ALL_BRAZILIAN_TEAMS.reduce((index, team) => {
  // Add main name
  index[team.name.toLowerCase()] = team;
  
  // Add slug
  index[team.slug.toLowerCase()] = team;
  
  // Add all aliases
  team.aliases.forEach(alias => {
    index[alias.toLowerCase()] = team;
  });
  
  return index;
}, {});

// Function to find team by any name/alias
window.findBrazilianTeam = function(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  return window.TEAM_SEARCH_INDEX[term] || null;
};

// Function to get all team names for search suggestions
window.getAllTeamNames = function() {
  return [
    ...window.ALL_BRAZILIAN_TEAMS.map(team => team.name),
    ...window.ALL_BRAZILIAN_TEAMS.flatMap(team => team.aliases)
  ].sort();
};