// Enhanced search and filtering functionality for Brazilian teams
(function() {
  const search = document.getElementById('teamSearch');
  const leagueFilter = document.getElementById('leagueFilter');
  
  if (!search) return;
  
  const sections = ['list-today', 'list-tomorrow', 'list-next'].map(id => document.getElementById(id));
  
  // Load comprehensive Brazilian teams database
  function loadBrazilianTeams() {
    if (window.ALL_BRAZILIAN_TEAMS) {
      return window.ALL_BRAZILIAN_TEAMS;
    }
    
    // Fallback comprehensive list if external database not loaded
    return [
      'Flamengo', 'Corinthians', 'Palmeiras', 'São Paulo', 'Santos', 'Vasco', 'Botafogo', 'Fluminense',
      'Grêmio', 'Internacional', 'Atlético-MG', 'Cruzeiro', 'Bahia', 'Fortaleza', 'Ceará', 'Sport',
      'Vitória', 'Athletico-PR', 'Coritiba', 'Cuiabá', 'Bragantino', 'Juventude', 'América-MG',
      'Avaí', 'Chapecoense', 'CRB', 'Goiás', 'Guarani', 'Ituano', 'Londrina', 'Mirassol',
      'Novorizontino', 'Operário-PR', 'Paysandu', 'Ponte Preta', 'Remo', 'Tombense', 'Vila Nova',
      'Volta Redonda', 'ABC', 'Atlético-GO', 'Botafogo-PB', 'Campinense', 'Caxias', 'CSA',
      'Figueirense', 'Manaus', 'Náutico', 'Sampaio Corrêa', 'São Bernardo', 'Ypiranga-RS'
    ];
  }
  
  const brazilianTeams = loadBrazilianTeams();
  
  function applyFilters() {
    const searchQuery = (search.value || '').toLowerCase();
    const leagueQuery = (leagueFilter?.value || '').toLowerCase();
    
    let visibleCount = 0;
    
    sections.forEach(section => {
      if (!section) return;
      
      [...section.children].forEach(card => {
        if (!card.dataset.search) return;
        
        const searchText = card.dataset.search.toLowerCase();
        const leagueText = card.querySelector('.font-semibold')?.textContent.toLowerCase() || '';
        
        // Check search match
        const searchMatch = !searchQuery || searchText.includes(searchQuery);
        
        // Check league filter match
        let leagueMatch = true;
        if (leagueQuery) {
          switch (leagueQuery) {
            case 'brasileirao':
              leagueMatch = leagueText.includes('serie') || leagueText.includes('brasileiro');
              break;
            case 'copa-brasil':
              leagueMatch = leagueText.includes('copa do brasil') || leagueText.includes('copa brasil');
              break;
            case 'libertadores':
              leagueMatch = leagueText.includes('libertadores');
              break;
            case 'sul-americana':
              leagueMatch = leagueText.includes('sul-americana') || leagueText.includes('sudamericana');
              break;
            case 'estaduais':
              leagueMatch = leagueText.includes('carioca') || leagueText.includes('paulista') || 
                          leagueText.includes('mineiro') || leagueText.includes('gaúcho') || 
                          leagueText.includes('baiano') || leagueText.includes('pernambucano');
              break;
          }
        }
        
        const shouldShow = searchMatch && leagueMatch;
        card.style.display = shouldShow ? '' : 'none';
        
        if (shouldShow) visibleCount++;
      });
    });
    
    // Show/hide no results message
    const noGamesToday = document.getElementById('no-games-today');
    if (noGamesToday && searchQuery && visibleCount === 0) {
      noGamesToday.classList.remove('hidden');
      noGamesToday.innerHTML = `
        <p class="text-gray-600 mb-2">🔍 Nenhum jogo encontrado para "${search.value}"</p>
        <p class="text-sm text-gray-500">Tente buscar por outro time ou competição</p>
      `;
    } else if (noGamesToday) {
      noGamesToday.classList.add('hidden');
    }
  }
  
  // Add event listeners
  search.addEventListener('input', applyFilters);
  if (leagueFilter) {
    leagueFilter.addEventListener('change', applyFilters);
  }
  
  // Handle "more" buttons with better UX
  ['more-today', 'more-tomorrow', 'more-next'].forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', function() {
        const sectionId = buttonId.replace('more-', 'list-');
        const section = document.getElementById(sectionId);
        
        if (section) {
          // Show all hidden cards in this section
          [...section.children].forEach(card => {
            if (card.style.display === 'none' && card.dataset.search) {
              card.style.display = '';
            }
          });
          
          // Hide the button and show success message
          button.style.display = 'none';
          
          const successMsg = document.createElement('div');
          successMsg.className = 'text-center text-green-600 text-sm mt-2';
          successMsg.textContent = '✅ Todos os jogos carregados!';
          button.parentNode.appendChild(successMsg);
          
          // Remove success message after 3 seconds
          setTimeout(() => {
            if (successMsg.parentNode) {
              successMsg.parentNode.removeChild(successMsg);
            }
          }, 3000);
        }
      });
    }
  });
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      search.focus();
      search.select();
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      if (leagueFilter) leagueFilter.value = '';
      applyFilters();
    }
  });
  
  // Add search suggestions based on teams in current games
  const teamNames = new Set();
  sections.forEach(section => {
    if (!section) return;
    [...section.children].forEach(card => {
      const searchData = card.dataset.search;
      if (searchData) {
        // Extract team names (basic approach)
        const words = searchData.split(' ');
        words.forEach(word => {
          if (word.length > 3) {
            teamNames.add(word);
          }
        });
      }
    });
  });
  
  // Create datalist for search suggestions
  if (teamNames.size > 0) {
    const datalist = document.createElement('datalist');
    datalist.id = 'team-suggestions';
    
    // Add popular teams and teams from today's games
    const suggestions = [
      'Flamengo', 'Corinthians', 'Palmeiras', 'São Paulo', 'Santos',
      'Vasco', 'Botafogo', 'Fluminense', 'Grêmio', 'Internacional',
      ...Array.from(teamNames)
    ];
    
    [...new Set(suggestions)].slice(0, 20).forEach(team => {
      const option = document.createElement('option');
      option.value = team;
      datalist.appendChild(option);
    });
    
    document.body.appendChild(datalist);
    search.setAttribute('list', 'team-suggestions');
  }
  
})();