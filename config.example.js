// Rename this to config.js and set your API key.
// Atenção: usar a chave no front-end é menos seguro. Ideal: proxy/serveless para esconder a chave.
window.APP_CONFIG = {
  API_BASE: "https://v3.football.api-sports.io",
  API_KEY: "YOUR_API_FOOTBALL_KEY", // ex.: 64dbbac01db6ca5c41fefe0e061937a8
  TIMEZONE: "America/Sao_Paulo",
  COUNTRY: "Brazil", // filtra partidas no Brasil
  MAX_VISIBLE: 12 // quantidade mostrada antes de "Ver mais"
};
