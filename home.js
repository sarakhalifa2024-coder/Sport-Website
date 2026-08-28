document.addEventListener('DOMContentLoaded', function() {
    initHomePage();
});

async function initHomePage() {
    loadWeather();
    loadExchangeRates();
    loadLiveMatches();
    loadNews('sports', 'sports-news');
    loadNews('entertainment', 'entertainment-news');
    loadNews('politics', 'politics-news');
    loadNews('economy', 'economy-news');
}


async function loadWeather() {
    const container = document.getElementById('weather-widget');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                renderWeather(data, container);
            },
            async () => {
                
                const data = await fetchWeather();
                renderWeather(data, container);
            }
        );
    } else {
        const data = await fetchWeather();
        renderWeather(data, container);
    }
}

function renderWeather(data, container) {
    if (!data) {
        container.innerHTML = `
            <div class="text-center">
                <i class="bi bi-cloud-sun-fill weather-icon mb-2"></i>
                <div class="temperature">22°C</div>
                <div class="city-name">
                    <i class="bi bi-geo-alt-fill me-1"></i>Cairo
                </div>
                <small class="text-muted d-block mt-2">Configure API key</small>
            </div>
        `;
        return;
    }
    
    const iconClass = getWeatherIcon(data.weather[0].icon);
    const temp = Math.round(data.main.temp);
    const city = data.name;
    const description = data.weather[0].description;
    
    container.innerHTML = `
        <div class="text-center">
            <i class="bi ${iconClass} weather-icon mb-2"></i>
            <div class="temperature">${temp}°C</div>
            <div class="city-name">
                <i class="bi bi-geo-alt-fill me-1"></i>${city}
            </div>
            <small class="text-muted d-block mt-2 text-capitalize">${description}</small>
        </div>
    `;
}

async function loadExchangeRates() {
    const container = document.getElementById('exchange-widget');
    const data = await fetchExchangeRates('EGP');
    
    if (!data) {
        container.innerHTML = `
            <div class="exchange-item">
                <div>
                    <span class="currency-code">USD</span>
                    <small class="text-muted d-block">US Dollar</small>
                </div>
                <span class="currency-rate">48.18 EGP</span>
            </div>
            <div class="exchange-item">
                <div>
                    <span class="currency-code">SAR</span>
                    <small class="text-muted d-block">Saudi Riyal</small>
                </div>
                <span class="currency-rate">12.85 EGP</span>
            </div>
            <div class="exchange-item">
                <div>
                    <span class="currency-code">EUR</span>
                    <small class="text-muted d-block">Euro</small>
                </div>
                <span class="currency-rate">52.45 EGP</span>
            </div>
            <small class="text-muted d-block text-center mt-2">Configure API key</small>
        `;
        return;
    }
    
    const rates = data.conversion_rates;
    const usdRate = (1 / rates.USD).toFixed(2);
    const sarRate = (1 / rates.SAR).toFixed(2);
    const eurRate = (1 / rates.EUR).toFixed(2);
    
    container.innerHTML = `
        <div class="exchange-item">
            <div>
                <span class="currency-code">USD</span>
                <small class="text-muted d-block">US Dollar</small>
            </div>
            <span class="currency-rate">${usdRate} EGP</span>
        </div>
        <div class="exchange-item">
            <div>
                <span class="currency-code">SAR</span>
                <small class="text-muted d-block">Saudi Riyal</small>
            </div>
            <span class="currency-rate">${sarRate} EGP</span>
        </div>
        <div class="exchange-item">
            <div>
                <span class="currency-code">EUR</span>
                <small class="text-muted d-block">Euro</small>
            </div>
            <span class="currency-rate">${eurRate} EGP</span>
        </div>
    `;
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('convert-amount').value) || 1;
    const from = document.getElementById('convert-from').value;
    const to = document.getElementById('convert-to').value;
    const resultDiv = document.getElementById('conversion-result');
    
    if (CONFIG.EXCHANGE_API_KEY === 'YOUR_EXCHANGERATE_API_KEY') {
        
        const demoRates = {
            'EGP_USD': 0.0207,
            'EGP_SAR': 0.0778,
            'EGP_EUR': 0.019,
            'USD_EGP': 48.18,
            'USD_SAR': 3.75,
            'USD_EUR': 0.92,
            'SAR_EGP': 12.85,
            'SAR_USD': 0.267,
            'SAR_EUR': 0.245,
            'EUR_EGP': 52.45,
            'EUR_USD': 1.09,
            'EUR_SAR': 4.08
        };
        
        const key = `${from}_${to}`;
        const rate = from === to ? 1 : (demoRates[key] || 1);
        const result = (amount * rate).toFixed(2);
        resultDiv.textContent = `${amount} ${from} = ${result} ${to}`;
        return;
    }
    
    const rate = await getConversionRate(from, to);
    if (rate) {
        const result = (amount * rate).toFixed(2);
        resultDiv.textContent = `${amount} ${from} = ${result} ${to}`;
    } else {
        resultDiv.textContent = 'Conversion failed';
        resultDiv.classList.replace('text-green-600', 'text-red-500');
    }
}

async function loadLiveMatches() {
    const container = document.getElementById('live-matches-widget');
    const data = await fetchLiveMatches();
    
    if (!data || !data.result || data.result.length === 0) {
        container.innerHTML = `
            <div class="match-card live mx-3 my-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1">
                        <img src="https://via.placeholder.com/30" alt="Team 1" class="team-logo-sm">
                        <span class="font-medium text-sm">Liverpool</span>
                    </div>
                    <div class="text-center px-3">
                        <span class="score-display">2 : 1</span>
                        <span class="live-badge d-block mt-1">LIVE</span>
                    </div>
                    <div class="flex items-center gap-2 flex-1 justify-end">
                        <span class="font-medium text-sm">Arsenal</span>
                        <img src="https://via.placeholder.com/30" alt="Team 2" class="team-logo-sm">
                    </div>
                </div>
            </div>
            <div class="match-card live mx-3 mb-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1">
                        <img src="https://via.placeholder.com/30" alt="Team 1" class="team-logo-sm">
                        <span class="font-medium text-sm">Man City</span>
                    </div>
                    <div class="text-center px-3">
                        <span class="score-display">0 : 0</span>
                        <span class="live-badge d-block mt-1">LIVE</span>
                    </div>
                    <div class="flex items-center gap-2 flex-1 justify-end">
                        <span class="font-medium text-sm">Chelsea</span>
                        <img src="https://via.placeholder.com/30" alt="Team 2" class="team-logo-sm">
                    </div>
                </div>
            </div>
            <small class="text-muted d-block text-center pb-3">Demo data - Configure API key</small>
        `;
        return;
    }
    
    let html = '';
    data.result.slice(0, 3).forEach(match => {
        html += `
            <div class="match-card live mx-3 my-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1">
                        <img src="${match.home_team_logo || 'https://via.placeholder.com/30'}" alt="${match.event_home_team}" class="team-logo-sm">
                        <span class="font-medium text-sm">${match.event_home_team}</span>
                    </div>
                    <div class="text-center px-3">
                        <span class="score-display">${match.event_final_result || '0 : 0'}</span>
                        <span class="live-badge d-block mt-1">LIVE</span>
                    </div>
                    <div class="flex items-center gap-2 flex-1 justify-end">
                        <span class="font-medium text-sm">${match.event_away_team}</span>
                        <img src="${match.away_team_logo || 'https://via.placeholder.com/30'}" alt="${match.event_away_team}" class="team-logo-sm">
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function loadNews(category, containerId) {
    const container = document.getElementById(containerId);
    const data = await fetchNews(category);
    
    if (!data || !data.articles) {
        container.innerHTML = generateDemoNews(category);
        return;
    }
    
    let html = '';
    data.articles.slice(0, 3).forEach((article, index) => {
        html += `
            <div class="col-md-4 fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="card news-card h-100">
                    <img src="${article.image || 'https://via.placeholder.com/300x180'}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description || ''}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <small class="text-muted">
                            <i class="bi bi-calendar3 me-1"></i>
                            ${new Date(article.publishedAt).toLocaleDateString()}
                        </small>
                        <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-primary float-end">
                            Read More
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function generateDemoNews(category) {
    const demoData = {
        sports: [
            { title: 'Premier League: Exciting Weekend Matches Ahead', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400' },
            { title: 'Champions League Quarter Finals Draw Announced', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400' },
            { title: 'Breaking: Star Player Signs New Contract', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400' }
        ],
        entertainment: [
            { title: 'New Blockbuster Movie Breaks Box Office Records', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400' },
            { title: 'Celebrity Awards Show Highlights', image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400' },
            { title: 'Streaming Platform Announces New Series', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400' }
        ],
        politics: [
            { title: 'Global Summit Addresses Climate Change', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400' },
            { title: 'New Economic Policy Announced', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400' },
            { title: 'International Trade Agreement Reached', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400' }
        ],
        economy: [
            { title: 'Stock Market Reaches New Highs', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400' },
            { title: 'Central Bank Updates Interest Rates', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400' },
            { title: 'Tech Industry Reports Strong Growth', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' }
        ]
    };
    
    const articles = demoData[category] || demoData.sports;
    
    let html = '';
    articles.forEach((article, index) => {
        html += `
            <div class="col-md-4 fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="card news-card h-100">
                    <img src="${article.image}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <small class="text-muted">
                            <i class="bi bi-calendar3 me-1"></i>
                            ${new Date().toLocaleDateString()}
                        </small>
                        <button class="btn btn-sm btn-outline-primary float-end">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '<small class="text-muted d-block text-center w-100 mt-3">Demo data - Configure API key</small>';
    
    return html;
}
