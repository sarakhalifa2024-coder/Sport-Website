let statsData = {
    scorers: [],
    yellowCards: [],
    redCards: []
};

let currentSort = 'goals';

document.addEventListener('DOMContentLoaded', function() {
    loadStats();
});

async function loadStats() {
    const data = await fetchTopScorers(CONFIG.DEFAULT_LEAGUE_ID);
    
    if (!data || !data.result) {
        
        showDemoStats();
        return;
    }
    
    statsData.scorers = data.result.slice(0, 10);
    
    showDemoStats();
}

function sortStats(type) {
    currentSort = type;
    
    document.getElementById('sort-goals').className = type === 'goals' ? 'btn btn-primary px-4' : 'btn btn-outline-primary px-4';
    document.getElementById('sort-yellow').className = type === 'yellow' ? 'btn btn-warning px-4' : 'btn btn-outline-warning px-4';
    document.getElementById('sort-red').className = type === 'red' ? 'btn btn-danger px-4' : 'btn btn-outline-danger px-4';
   
    renderStats();
}

function renderStats() {
    renderTopScorers(statsData.scorers);
    renderYellowCards(statsData.yellowCards);
    renderRedCards(statsData.redCards);
}

function renderTopScorers(players) {
    const container = document.getElementById('top-scorers');
    
    if (!players || players.length === 0) {
        container.innerHTML = `
            <div class="empty-state py-4">
                <i class="bi bi-person-x"></i>
                <p>No data available</p>
            </div>
        `;
        return;
    }
    
    if (currentSort === 'goals') {
        players.sort((a, b) => b.goals - a.goals);
    }
    
    let html = '';
    players.forEach((player, index) => {
        html += `
            <div class="player-row fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="rank-badge ${getRankClass(index + 1)} me-3">${index + 1}</div>
                <img src="${player.player_image || 'https://via.placeholder.com/50'}" 
                     alt="${player.player_name}" 
                     class="player-photo"
                     onerror="this.src='https://via.placeholder.com/50'">
                <div class="player-info">
                    <div class="player-name">${player.player_name}</div>
                    <div class="player-team">
                        <img src="${player.team_logo || 'https://via.placeholder.com/20'}" 
                             alt="${player.team_name}" 
                             width="20" height="20"
                             onerror="this.src='https://via.placeholder.com/20'">
                        ${player.team_name}
                    </div>
                </div>
                <div class="stat-value stat-goals">${player.goals}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderYellowCards(players) {
    const container = document.getElementById('yellow-cards');
    
    if (!players || players.length === 0) {
        container.innerHTML = `
            <div class="empty-state py-4">
                <i class="bi bi-person-x"></i>
                <p>No data available</p>
            </div>
        `;
        return;
    }
    
    if (currentSort === 'yellow') {
        players.sort((a, b) => b.yellow_cards - a.yellow_cards);
    }
    
    let html = '';
    players.forEach((player, index) => {
        html += `
            <div class="player-row fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="rank-badge ${getRankClass(index + 1)} me-3">${index + 1}</div>
                <img src="${player.player_image || 'https://via.placeholder.com/50'}" 
                     alt="${player.player_name}" 
                     class="player-photo"
                     onerror="this.src='https://via.placeholder.com/50'">
                <div class="player-info">
                    <div class="player-name">${player.player_name}</div>
                    <div class="player-team">
                        <img src="${player.team_logo || 'https://via.placeholder.com/20'}" 
                             alt="${player.team_name}" 
                             width="20" height="20"
                             onerror="this.src='https://via.placeholder.com/20'">
                        ${player.team_name}
                    </div>
                </div>
                <div class="stat-value stat-yellow">${player.yellow_cards}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderRedCards(players) {
    const container = document.getElementById('red-cards');
    
    if (!players || players.length === 0) {
        container.innerHTML = `
            <div class="empty-state py-4">
                <i class="bi bi-person-x"></i>
                <p>No data available</p>
            </div>
        `;
        return;
    }
    
    if (currentSort === 'red') {
        players.sort((a, b) => b.red_cards - a.red_cards);
    }
    
    let html = '';
    players.forEach((player, index) => {
        html += `
            <div class="player-row fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="rank-badge ${getRankClass(index + 1)} me-3">${index + 1}</div>
                <img src="${player.player_image || 'https://via.placeholder.com/50'}" 
                     alt="${player.player_name}" 
                     class="player-photo"
                     onerror="this.src='https://via.placeholder.com/50'">
                <div class="player-info">
                    <div class="player-name">${player.player_name}</div>
                    <div class="player-team">
                        <img src="${player.team_logo || 'https://via.placeholder.com/20'}" 
                             alt="${player.team_name}" 
                             width="20" height="20"
                             onerror="this.src='https://via.placeholder.com/20'">
                        ${player.team_name}
                    </div>
                </div>
                <div class="stat-value stat-red">${player.red_cards}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getRankClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-default';
}

function showDemoStats() {

    statsData.scorers = [
        { player_name: 'Mohamed Salah', team_name: 'Liverpool', player_image: 'https://via.placeholder.com/50/c8102e/ffffff?text=MS', team_logo: 'https://via.placeholder.com/20/c8102e/ffffff?text=LIV', goals: 22 },
        { player_name: 'Erling Haaland', team_name: 'Manchester City', player_image: 'https://via.placeholder.com/50/6cabdd/ffffff?text=EH', team_logo: 'https://via.placeholder.com/20/6cabdd/ffffff?text=MCI', goals: 20 },
        { player_name: 'Cole Palmer', team_name: 'Chelsea', player_image: 'https://via.placeholder.com/50/034694/ffffff?text=CP', team_logo: 'https://via.placeholder.com/20/034694/ffffff?text=CHE', goals: 15 },
        { player_name: 'Bukayo Saka', team_name: 'Arsenal', player_image: 'https://via.placeholder.com/50/ef0107/ffffff?text=BS', team_logo: 'https://via.placeholder.com/20/ef0107/ffffff?text=ARS', goals: 13 },
        { player_name: 'Son Heung-min', team_name: 'Tottenham', player_image: 'https://via.placeholder.com/50/132257/ffffff?text=SH', team_logo: 'https://via.placeholder.com/20/132257/ffffff?text=TOT', goals: 12 },
        { player_name: 'Ollie Watkins', team_name: 'Aston Villa', player_image: 'https://via.placeholder.com/50/95bfe5/ffffff?text=OW', team_logo: 'https://via.placeholder.com/20/95bfe5/ffffff?text=AVL', goals: 11 },
        { player_name: 'Alexander Isak', team_name: 'Newcastle', player_image: 'https://via.placeholder.com/50/241f20/ffffff?text=AI', team_logo: 'https://via.placeholder.com/20/241f20/ffffff?text=NEW', goals: 10 },
        { player_name: 'Jarrod Bowen', team_name: 'West Ham', player_image: 'https://via.placeholder.com/50/7a263a/ffffff?text=JB', team_logo: 'https://via.placeholder.com/20/7a263a/ffffff?text=WHU', goals: 9 }
    ];
    
    statsData.yellowCards = [
        { player_name: 'Joao Palhinha', team_name: 'Fulham', player_image: 'https://via.placeholder.com/50/000000/ffffff?text=JP', team_logo: 'https://via.placeholder.com/20/000000/ffffff?text=FUL', yellow_cards: 10 },
        { player_name: 'Rodrigo', team_name: 'Manchester City', player_image: 'https://via.placeholder.com/50/6cabdd/ffffff?text=RO', team_logo: 'https://via.placeholder.com/20/6cabdd/ffffff?text=MCI', yellow_cards: 9 },
        { player_name: 'Bruno Fernandes', team_name: 'Manchester United', player_image: 'https://via.placeholder.com/50/da020e/ffffff?text=BF', team_logo: 'https://via.placeholder.com/20/da020e/ffffff?text=MUN', yellow_cards: 8 },
        { player_name: 'Declan Rice', team_name: 'Arsenal', player_image: 'https://via.placeholder.com/50/ef0107/ffffff?text=DR', team_logo: 'https://via.placeholder.com/20/ef0107/ffffff?text=ARS', yellow_cards: 7 },
        { player_name: 'James Maddison', team_name: 'Tottenham', player_image: 'https://via.placeholder.com/50/132257/ffffff?text=JM', team_logo: 'https://via.placeholder.com/20/132257/ffffff?text=TOT', yellow_cards: 7 },
        { player_name: 'Alexis Mac Allister', team_name: 'Liverpool', player_image: 'https://via.placeholder.com/50/c8102e/ffffff?text=AM', team_logo: 'https://via.placeholder.com/20/c8102e/ffffff?text=LIV', yellow_cards: 6 },
        { player_name: 'Pascal Gross', team_name: 'Brighton', player_image: 'https://via.placeholder.com/50/0057b8/ffffff?text=PG', team_logo: 'https://via.placeholder.com/20/0057b8/ffffff?text=BHA', yellow_cards: 6 },
        { player_name: 'Enzo Fernandez', team_name: 'Chelsea', player_image: 'https://via.placeholder.com/50/034694/ffffff?text=EF', team_logo: 'https://via.placeholder.com/20/034694/ffffff?text=CHE', yellow_cards: 5 }
    ];
    
    statsData.redCards = [
        { player_name: 'Bruno Fernandes', team_name: 'Manchester United', player_image: 'https://via.placeholder.com/50/da020e/ffffff?text=BF', team_logo: 'https://via.placeholder.com/20/da020e/ffffff?text=MUN', red_cards: 2 },
        { player_name: 'Trent Alexander-Arnold', team_name: 'Liverpool', player_image: 'https://via.placeholder.com/50/c8102e/ffffff?text=TA', team_logo: 'https://via.placeholder.com/20/c8102e/ffffff?text=LIV', red_cards: 1 },
        { player_name: 'Marc Cucurella', team_name: 'Chelsea', player_image: 'https://via.placeholder.com/50/034694/ffffff?text=MC', team_logo: 'https://via.placeholder.com/20/034694/ffffff?text=CHE', red_cards: 1 },
        { player_name: 'William Saliba', team_name: 'Arsenal', player_image: 'https://via.placeholder.com/50/ef0107/ffffff?text=WS', team_logo: 'https://via.placeholder.com/20/ef0107/ffffff?text=ARS', red_cards: 1 },
        { player_name: 'Casemiro', team_name: 'Manchester United', player_image: 'https://via.placeholder.com/50/da020e/ffffff?text=CA', team_logo: 'https://via.placeholder.com/20/da020e/ffffff?text=MUN', red_cards: 1 },
        { player_name: 'Joelinton', team_name: 'Newcastle', player_image: 'https://via.placeholder.com/50/241f20/ffffff?text=JO', team_logo: 'https://via.placeholder.com/20/241f20/ffffff?text=NEW', red_cards: 1 },
        { player_name: 'James Tarkowski', team_name: 'Everton', player_image: 'https://via.placeholder.com/50/003399/ffffff?text=JT', team_logo: 'https://via.placeholder.com/20/003399/ffffff?text=EVE', red_cards: 1 },
        { player_name: 'Douglas Luiz', team_name: 'Aston Villa', player_image: 'https://via.placeholder.com/50/95bfe5/ffffff?text=DL', team_logo: 'https://via.placeholder.com/20/95bfe5/ffffff?text=AVL', red_cards: 1 }
    ];
    
    renderStats();
    
    const containers = ['top-scorers', 'yellow-cards', 'red-cards'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        container.innerHTML += `
            <div class="text-center py-2 text-muted">
                <small>Demo data - Configure API key</small>
            </div>
        `;
    });
}
