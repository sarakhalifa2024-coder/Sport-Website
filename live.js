let allMatches = [];

document.addEventListener('DOMContentLoaded', function() {
    initLivePage();
});

function initLivePage() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('date-from').value = formatDate(startOfMonth);
    document.getElementById('date-to').value = formatDate(endOfMonth);
    
    loadMatches();
}

async function loadMatches() {
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    const data = await fetchMatches(CONFIG.DEFAULT_LEAGUE_ID, dateFrom, dateTo);
    
    if (!data || !data.result) {
        
        showDemoMatches();
        return;
    }
    
    allMatches = data.result;
    filterAndDisplayMatches();
}

function searchMatches() {
    filterAndDisplayMatches();
}

function filterAndDisplayMatches() {
    const teamFilter = document.getElementById('team-filter').value.toLowerCase();
    
    let filtered = allMatches;
    
    if (teamFilter) {
        filtered = allMatches.filter(match => 
            match.event_home_team.toLowerCase().includes(teamFilter) ||
            match.event_away_team.toLowerCase().includes(teamFilter)
        );
    }
    
    const liveMatches = filtered.filter(m => m.event_status === 'Live' || m.event_status === 'Half Time');
    const finishedMatches = filtered.filter(m => m.event_status === 'Finished');
    const upcomingMatches = filtered.filter(m => m.event_status === '' || m.event_status === 'Not Started');
    
    renderMatches('all-matches', filtered);
    renderMatches('live-matches', liveMatches);
    renderMatches('finished-matches', finishedMatches);
    renderMatches('upcoming-matches', upcomingMatches);
}

function renderMatches(containerId, matches) {
    const container = document.getElementById(containerId);
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="bi bi-calendar-x"></i>
                    <h5>No matches found</h5>
                    <p>Try adjusting your date range or filters</p>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    matches.forEach((match, index) => {
        const status = getMatchStatus(match);
        const statusClass = status.class;
        const score = getMatchScore(match);
        
        html += `
            <div class="col-lg-6 fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="match-card ${statusClass}">
                    <div class="flex items-center justify-between">
                        <!-- Home Team -->
                        <div class="flex items-center gap-3 flex-1">
                            <img src="${match.home_team_logo || 'https://via.placeholder.com/40'}" 
                                 alt="${match.event_home_team}" 
                                 class="team-logo"
                                 onerror="this.src='https://via.placeholder.com/40'">
                            <div>
                                <div class="font-semibold">${match.event_home_team}</div>
                                <small class="text-muted">Home</small>
                            </div>
                        </div>
                        
                        <!-- Score -->
                        <div class="text-center px-4">
                            <div class="score-display">${score}</div>
                            <span class="${status.badgeClass}">${status.text}</span>
                        </div>
                        
                        <!-- Away Team -->
                        <div class="flex items-center gap-3 flex-1 justify-end text-end">
                            <div>
                                <div class="font-semibold">${match.event_away_team}</div>
                                <small class="text-muted">Away</small>
                            </div>
                            <img src="${match.away_team_logo || 'https://via.placeholder.com/40'}" 
                                 alt="${match.event_away_team}" 
                                 class="team-logo"
                                 onerror="this.src='https://via.placeholder.com/40'">
                        </div>
                    </div>
                    
                    <!-- Match Info -->
                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <small class="text-muted">
                            <i class="bi bi-calendar3 me-1"></i>
                            ${match.event_date || 'TBD'}
                        </small>
                        <small class="text-muted">
                            <i class="bi bi-clock me-1"></i>
                            ${match.event_time || 'TBD'}
                        </small>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getMatchStatus(match) {
    const status = match.event_status || '';
    
    if (status === 'Live' || status === 'Half Time' || status.includes("'")) {
        return {
            text: status.includes("'") ? status : 'LIVE',
            class: 'live',
            badgeClass: 'live-badge'
        };
    } else if (status === 'Finished') {
        return {
            text: 'FT',
            class: 'finished',
            badgeClass: 'badge bg-success'
        };
    } else {
        return {
            text: match.event_time || 'Upcoming',
            class: 'upcoming',
            badgeClass: 'badge bg-primary'
        };
    }
}

function getMatchScore(match) {
    const status = match.event_status || '';
    
    if (status === 'Finished' || status === 'Live' || status === 'Half Time' || status.includes("'")) {
        return match.event_final_result || '0 - 0';
    } else {
        return 'vs';
    }
}

function showDemoMatches() {
    const demoMatches = [
        {
            event_home_team: 'Liverpool',
            event_away_team: 'Arsenal',
            home_team_logo: 'https://via.placeholder.com/40/c8102e/ffffff?text=LIV',
            away_team_logo: 'https://via.placeholder.com/40/ef0107/ffffff?text=ARS',
            event_final_result: '2 - 1',
            event_status: 'Live',
            event_date: '2026-03-14',
            event_time: '15:00'
        },
        {
            event_home_team: 'Manchester City',
            event_away_team: 'Chelsea',
            home_team_logo: 'https://via.placeholder.com/40/6cabdd/ffffff?text=MCI',
            away_team_logo: 'https://via.placeholder.com/40/034694/ffffff?text=CHE',
            event_final_result: '0 - 0',
            event_status: "45'+2",
            event_date: '2026-03-14',
            event_time: '15:00'
        },
        {
            event_home_team: 'Manchester United',
            event_away_team: 'Tottenham',
            home_team_logo: 'https://via.placeholder.com/40/da020e/ffffff?text=MUN',
            away_team_logo: 'https://via.placeholder.com/40/132257/ffffff?text=TOT',
            event_final_result: '3 - 2',
            event_status: 'Finished',
            event_date: '2026-03-13',
            event_time: '20:00'
        },
        {
            event_home_team: 'Newcastle',
            event_away_team: 'Aston Villa',
            home_team_logo: 'https://via.placeholder.com/40/241f20/ffffff?text=NEW',
            away_team_logo: 'https://via.placeholder.com/40/95bfe5/ffffff?text=AVL',
            event_final_result: '1 - 1',
            event_status: 'Finished',
            event_date: '2026-03-13',
            event_time: '17:30'
        },
        {
            event_home_team: 'Brighton',
            event_away_team: 'West Ham',
            home_team_logo: 'https://via.placeholder.com/40/0057b8/ffffff?text=BHA',
            away_team_logo: 'https://via.placeholder.com/40/7a263a/ffffff?text=WHU',
            event_final_result: '',
            event_status: '',
            event_date: '2026-03-15',
            event_time: '14:00'
        },
        {
            event_home_team: 'Everton',
            event_away_team: 'Wolves',
            home_team_logo: 'https://via.placeholder.com/40/003399/ffffff?text=EVE',
            away_team_logo: 'https://via.placeholder.com/40/fdb913/000000?text=WOL',
            event_final_result: '',
            event_status: '',
            event_date: '2026-03-15',
            event_time: '16:30'
        }
    ];
    
    allMatches = demoMatches;
    filterAndDisplayMatches();
    
    const container = document.getElementById('all-matches');
    container.innerHTML += '<small class="text-muted d-block text-center w-100 mt-3">Demo data - Configure API key</small>';
}
