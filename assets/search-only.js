(function(){
  const search = document.getElementById('teamSearch');
  if (!search) return;
  const sections = ['list-today','list-tomorrow','list-next'].map(id => document.getElementById(id));
  function filter(){
    const q = (search.value||'').toLowerCase();
    sections.forEach(sec => {
      if(!sec) return;
      [...sec.children].forEach(card => {
        const txt = card.getAttribute('data-search') || card.textContent.toLowerCase();
        card.style.display = (!q || txt.includes(q)) ? '' : 'none';
      });
    });
  }
  search.addEventListener('input', filter);
})();