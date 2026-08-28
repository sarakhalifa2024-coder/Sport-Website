
document.addEventListener('DOMContentLoaded', function() {
    loadStandings();
});

async function loadStandings() {
    const data = await fetchStandings(CONFIG.DEFAULT_LEAGUE_ID);
    
    if (!data || !data.result || !data.result.total) {
        showDemoStandings();
        return;
    }
    
    renderStandings(data.result.total);
}

function renderStandings(standings) {
    const tbody = document.getElementById('standings-table');
    
    if (!standings || standings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="empty-state">
                        <i class="bi bi-table"></i>
                        <h5>No standings data available</h5>
                        <p>Please check back later</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    standings.forEach((team, index) => {
        const rank = index + 1;
        const rankClass = getRankClass(rank);
        const zoneClass = getZoneClass(rank, standings.length);
        
        html += `
            <tr class="${zoneClass} fade-in" style="animation-delay: ${index * 0.03}s">
                <td class="text-center">
                    <span class="rank-badge ${rankClass}">${rank}</span>
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <img src="${team.team_logo || 'https://via.placeholder.com/35'}" 
                             alt="${team.standing_team}" 
                             class="team-logo-sm"
                             onerror="this.src='https://via.placeholder.com/35'">
                        <span class="font-semibold">${team.standing_team}</span>
                    </div>
                </td>
                <td class="text-center">${team.standing_P || team.standing_played || 0}</td>
                <td class="text-center text-green-600 font-medium">${team.standing_W || team.standing_W || 0}</td>
                <td class="text-center text-amber-600">${team.standing_D || team.standing_D || 0}</td>
                <td class="text-center text-red-500">${team.standing_L || team.standing_L || 0}</td>
                <td class="text-center">${team.standing_GF || team.standing_F || 0}</td>
                <td class="text-center">${team.standing_GA || team.standing_A || 0}</td>
                <td class="text-center font-medium ${getGDClass(team.standing_GD || (team.standing_GF - team.standing_GA))}">
                    ${formatGD(team.standing_GD || (team.standing_GF - team.standing_GA) || 0)}
                </td>
                <td class="text-center">
                    <span class="font-bold text-lg">${team.standing_PTS || team.standing_pts || 0}</span>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function getRankClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-default';
}

function getZoneClass(rank, total) {
    if (rank <= 4) return 'border-l-4 border-l-green-500'; // Champions League
    if (rank === 5) return 'border-l-4 border-l-blue-500'; // Europa League
    if (rank === 6) return 'border-l-4 border-l-amber-500'; // Conference League
    if (rank > total - 3) return 'border-l-4 border-l-red-500'; // Relegation
    return '';
}

function getGDClass(gd) {
    if (gd > 0) return 'text-green-600';
    if (gd < 0) return 'text-red-500';
    return 'text-gray-500';
}

function formatGD(gd) {
    if (gd > 0) return `+${gd}`;
    return gd.toString();
}

function showDemoStandings() {
    const demoStandings = [
        { standing_team: 'Liverpool', team_logo: 'https://via.placeholder.com/35/c8102e/ffffff?text=LIV', standing_P: 28, standing_W: 21, standing_D: 5, standing_L: 2, standing_GF: 65, standing_GA: 22, standing_GD: 43, standing_PTS: 68 },
        { standing_team: 'Arsenal', team_logo: 'https://via.placeholder.com/35/ef0107/ffffff?text=ARS', standing_P: 28, standing_W: 19, standing_D: 6, standing_L: 3, standing_GF: 58, standing_GA: 25, standing_GD: 33, standing_PTS: 63 },
        { standing_team: 'Manchester City', team_logo: 'https://via.placeholder.com/35/6cabdd/ffffff?text=MCI', standing_P: 28, standing_W: 18, standing_D: 5, standing_L: 5, standing_GF: 62, standing_GA: 30, standing_GD: 32, standing_PTS: 59 },
        { standing_team: 'Chelsea', team_logo: 'https://via.placeholder.com/35/034694/ffffff?text=CHE', standing_P: 28, standing_W: 16, standing_D: 7, standing_L: 5, standing_GF: 52, standing_GA: 28, standing_GD: 24, standing_PTS: 55 },
        { standing_team: 'Aston Villa', team_logo: 'https://via.placeholder.com/35/95bfe5/ffffff?text=AVL', standing_P: 28, standing_W: 15, standing_D: 6, standing_L: 7, standing_GF: 48, standing_GA: 35, standing_GD: 13, standing_PTS: 51 },
        { standing_team: 'Newcastle', team_logo: 'https://via.placeholder.com/35/241f20/ffffff?text=NEW', standing_P: 28, standing_W: 14, standing_D: 7, standing_L: 7, standing_GF: 45, standing_GA: 32, standing_GD: 13, standing_PTS: 49 },
        { standing_team: 'Manchester United', team_logo: 'https://via.placeholder.com/35/da020e/ffffff?text=MUN', standing_P: 28, standing_W: 13, standing_D: 6, standing_L: 9, standing_GF: 42, standing_GA: 38, standing_GD: 4, standing_PTS: 45 },
        { standing_team: 'Tottenham', team_logo: 'https://via.placeholder.com/35/132257/ffffff?text=TOT', standing_P: 28, standing_W: 12, standing_D: 7, standing_L: 9, standing_GF: 50, standing_GA: 42, standing_GD: 8, standing_PTS: 43 },
        { standing_team: 'Brighton', team_logo: 'https://via.placeholder.com/35/0057b8/ffffff?text=BHA', standing_P: 28, standing_W: 11, standing_D: 9, standing_L: 8, standing_GF: 45, standing_GA: 40, standing_GD: 5, standing_PTS: 42 },
        { standing_team: 'West Ham', team_logo: 'https://via.placeholder.com/35/7a263a/ffffff?text=WHU', standing_P: 28, standing_W: 11, standing_D: 6, standing_L: 11, standing_GF: 38, standing_GA: 42, standing_GD: -4, standing_PTS: 39 },
        { standing_team: 'Bournemouth', team_logo: 'https://via.placeholder.com/35/d71920/ffffff?text=BOU', standing_P: 28, standing_W: 10, standing_D: 7, standing_L: 11, standing_GF: 40, standing_GA: 45, standing_GD: -5, standing_PTS: 37 },
        { standing_team: 'Crystal Palace', team_logo: 'https://via.placeholder.com/35/1b458f/ffffff?text=CRY', standing_P: 28, standing_W: 9, standing_D: 9, standing_L: 10, standing_GF: 35, standing_GA: 38, standing_GD: -3, standing_PTS: 36 },
        { standing_team: 'Fulham', team_logo: 'https://via.placeholder.com/35/000000/ffffff?text=FUL', standing_P: 28, standing_W: 9, standing_D: 8, standing_L: 11, standing_GF: 38, standing_GA: 42, standing_GD: -4, standing_PTS: 35 },
        { standing_team: 'Wolves', team_logo: 'https://via.placeholder.com/35/fdb913/000000?text=WOL', standing_P: 28, standing_W: 8, standing_D: 9, standing_L: 11, standing_GF: 35, standing_GA: 45, standing_GD: -10, standing_PTS: 33 },
        { standing_team: 'Brentford', team_logo: 'https://via.placeholder.com/35/e30613/ffffff?text=BRE', standing_P: 28, standing_W: 8, standing_D: 8, standing_L: 12, standing_GF: 38, standing_GA: 48, standing_GD: -10, standing_PTS: 32 },
        { standing_team: 'Nottm Forest', team_logo: 'https://via.placeholder.com/35/e53233/ffffff?text=NFO', standing_P: 28, standing_W: 7, standing_D: 9, standing_L: 12, standing_GF: 32, standing_GA: 42, standing_GD: -10, standing_PTS: 30 },
        { standing_team: 'Everton', team_logo: 'https://via.placeholder.com/35/003399/ffffff?text=EVE', standing_P: 28, standing_W: 6, standing_D: 9, standing_L: 13, standing_GF: 28, standing_GA: 45, standing_GD: -17, standing_PTS: 27 },
        { standing_team: 'Ipswich', team_logo: 'https://via.placeholder.com/35/0033a0/ffffff?text=IPS', standing_P: 28, standing_W: 5, standing_D: 8, standing_L: 15, standing_GF: 25, standing_GA: 52, standing_GD: -27, standing_PTS: 23 },
        { standing_team: 'Leicester', team_logo: 'https://via.placeholder.com/35/003090/ffffff?text=LEI', standing_P: 28, standing_W: 4, standing_D: 8, standing_L: 16, standing_GF: 28, standing_GA: 55, standing_GD: -27, standing_PTS: 20 },
        { standing_team: 'Southampton', team_logo: 'https://via.placeholder.com/35/d71920/ffffff?text=SOU', standing_P: 28, standing_W: 3, standing_D: 6, standing_L: 19, standing_GF: 20, standing_GA: 58, standing_GD: -38, standing_PTS: 15 }
    ];
    
    renderStandings(demoStandings);
    
    const tbody = document.getElementById('standings-table');
    tbody.innerHTML += `
        <tr>
            <td colspan="10" class="text-center text-muted py-2">
                <small>Demo data - Configure API key for live standings</small>
            </td>
        </tr>
    `;
}
