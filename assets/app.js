/* hojetemjogo — static site that fetches daily fixtures client-side from API-FOOTBALL */
(async () => {
  const cfg = window.APP_CONFIG;
  const $ = (sel) => document.querySelector(sel);

  const tz = cfg.TIMEZONE || "America/Sao_Paulo";
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateToday = `${yyyy}-${mm}-${dd}`;
  const dayMs = 86400000;
  const dateTomorrow = new Date(today.getTime()+dayMs);
  const yyyy2 = dateTomorrow.getFullYear();
  const mm2 = String(dateTomorrow.getMonth()+1).padStart(2, "0");
  const dd2 = String(dateTomorrow.getDate()).padStart(2, "0");
  const dateTomorrowStr = `${yyyy2}-${mm2}-${dd2}`;

  $("#date-today").textContent = `(${dateToday})`;
  $("#date-tomorrow").textContent = `(${dateTomorrowStr})`;

  const headers = {
    "x-apisports-key": cfg.API_KEY
  };

  async function fetchFixtures(date) {
    const url = new URL(cfg.API_BASE + "/fixtures");
    url.searchParams.set("date", date);
    url.searchParams.set("timezone", tz);
    url.searchParams.set("country", cfg.COUNTRY); // limitar ao Brasil
    try {
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.response || [];
    } catch (e) {
      console.error("Erro ao buscar fixtures", e);
      showAlert("Não foi possível carregar os jogos agora. Tente novamente em instantes.");
      return [];
    }
  }

  function showAlert(msg) {
    const el = $("#alert");
    el.className = "mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900";
    el.textContent = msg;
  }

  function leagueBadge(league) {
    if (!league) return "";
    const round = league.round ? `<span class="badge" title="Rodada">${league.round}</span>` : "";
    return `<div class="flex items-center gap-2">
      <img src="${league.logo || ""}" alt="${league.name || ""}" class="h-5 w-5 object-contain"/>
      <span class="font-medium">${league.name || ""}</span>
      ${round}
    </div>`;
  }

  function watchLinks(fix) {
    const h = fix.teams?.home?.name || "";
    const a = fix.teams?.away?.name || "";
    const q = encodeURIComponent(`onde assistir ${h} x ${a}`);
    const google = `https://www.google.com/search?q=${q}`;
    return `<a href="${google}" target="_blank" rel="nofollow noopener" class="text-sky-600 hover:underline">Onde assistir</a>`;
  }

  function fixtureCard(fix) {
    const league = fix.league || {};
    const home = fix.teams?.home;
    const away = fix.teams?.away;
    const status = fix.fixture?.status?.long || "";
    const ts = fix.fixture?.date ? new Date(fix.fixture.date) : null;
    const timeStr = ts ? ts.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: tz }) : "";
    const venue = fix.fixture?.venue?.name || "";
    const goals = fix.goals || {};
    const score = (goals.home != null && goals.away != null) ? `${goals.home} - ${goals.away}` : "";
    const live = (fix.fixture?.status?.short || "").includes("1H") || (fix.fixture?.status?.short || "").includes("2H") || (fix.fixture?.status?.short || "") === "LIVE";

    return `<article class="card flex flex-col gap-2">
      <div class="flex items-center justify-between">
        ${leagueBadge(league)}
        ${live ? '<span class="badge bg-red-50 border-red-200 text-red-700">AO VIVO</span>' : ''}
      </div>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <img src="${home?.logo || ''}" alt="${home?.name || ''}" class="h-6 w-6 object-contain" />
          <span class="truncate">${home?.name || ''}</span>
        </div>
        <div class="text-slate-500 text-sm">${timeStr}${score ? " • " + score : ""}</div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="truncate">${away?.name || ''}</span>
          <img src="${away?.logo || ''}" alt="${away?.name || ''}" class="h-6 w-6 object-contain" />
        </div>
      </div>
      <div class="flex items-center justify-between text-sm text-slate-600">
        <div class="truncate">${venue}</div>
        <div class="flex items-center gap-3">
          ${watchLinks(fix)}
          <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((home?.name||'') + ' x ' + (away?.name||''))}&dates=${encodeURIComponent(ts ? ts.toISOString().replace(/[-:]|\\.\\d{3}/g,'') + '/' + new Date(ts.getTime()+2*3600000).toISOString().replace(/[-:]|\\.\\d{3}/g,'') : '')}&details=${encodeURIComponent('Jogo e onde assistir: hojetemjogo.com.br')}" target="_blank" class="text-slate-600 hover:underline">+ calendário</a>
        </div>
      </div>
    </article>`;
  }

  function renderList(containerSel, fixtures, limit, moreBtnSel) {
    const container = $(containerSel);
    container.innerHTML = "";
    const limited = fixtures.slice(0, limit);
    for (const f of limited) container.insertAdjacentHTML("beforeend", fixtureCard(f));
    const moreBtn = $(moreBtnSel);
    if (fixtures.length > limit) {
      moreBtn.classList.remove("hidden");
      moreBtn.onclick = () => {
        const rest = fixtures.slice(container.children.length);
        for (const f of rest) container.insertAdjacentHTML("beforeend", fixtureCard(f));
        moreBtn.classList.add("hidden");
      };
    } else {
      moreBtn.classList.add("hidden");
    }
  }

  function filterByTeam(fixtures, q) {
    if (!q) return fixtures;
    const s = q.toLowerCase();
    return fixtures.filter(f => {
      const h = f.teams?.home?.name?.toLowerCase() || "";
      const a = f.teams?.away?.name?.toLowerCase() || "";
      return h.includes(s) || a.includes(s);
    });
  }

  // Load fixtures for today; if none, roll forward up to 5 days
  async function loadAll() {
    const todayFixtures = await fetchFixtures(dateToday);
    let nextFixtures = [];
    let noToday = todayFixtures.length === 0;
    if (noToday) {
      for (let i = 1; i <= 5; i++) {
        const d = new Date(today.getTime() + i*dayMs);
        const y = d.getFullYear();
        const m = String(d.getMonth()+1).padStart(2,"0");
        const da = String(d.getDate()).padStart(2,"0");
        const ds = `${y}-${m}-${da}`;
        const f = await fetchFixtures(ds);
        if (f.length > 0) { nextFixtures = f; break; }
      }
    }
    const tomorrowFixtures = await fetchFixtures(dateTomorrowStr);

    const limit = cfg.MAX_VISIBLE || 12;
    let currentList = todayFixtures;
    renderList("#list-today", todayFixtures, limit, "#more-today");
    renderList("#list-tomorrow", tomorrowFixtures, limit, "#more-tomorrow");
    renderList("#list-next", noToday ? nextFixtures : [], limit, "#more-next");

    // Search
    const search = $("#teamSearch");
    function applySearch() {
      const q = search.value.trim();
      renderList("#list-today", filterByTeam(todayFixtures, q), limit, "#more-today");
      renderList("#list-tomorrow", filterByTeam(tomorrowFixtures, q), limit, "#more-tomorrow");
      const targetNext = noToday ? nextFixtures : [];
      renderList("#list-next", filterByTeam(targetNext, q), limit, "#more-next");
    }
    search.addEventListener("input", applySearch);

    // JSON-LD for SEO (first 10 items today)
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": (todayFixtures.slice(0,10)).map((f, idx) => {
        const ts = f.fixture?.date;
        const home = f.teams?.home?.name || "";
        const away = f.teams?.away?.name || "";
        return {
          "@type": "ListItem",
          "position": idx+1,
          "url": "https://hojetemjogo.com.br/",
          "item": {
            "@type": "SportsEvent",
            "name": `${home} x ${away}`,
            "startDate": ts,
            "sport": "Soccer",
            "location": {
              "@type": "Place",
              "name": f.fixture?.venue?.name || ""
            }
          }
        };
      })
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  await loadAll();
})();
