async function safeFetchJSON(url, errorMessage = 'API request failed') {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`${errorMessage} (HTTP ${response.status})`);
        }

        const data = await response.json();

        if (!data) {
            throw new Error(`${errorMessage}: Empty response`);
        }

        return data;
    } catch (error) {
        console.error(errorMessage, error);
        return null;
    }
}

async function fetchWeather(city = CONFIG.DEFAULT_CITY) {
    if (!isWeatherConfigured()) {
        return null;
    }

    const safeCity = encodeURIComponent(city);
    const url = `${CONFIG.WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${CONFIG.WEATHER_API_KEY}&units=metric`;

    return await safeFetchJSON(url, 'Weather fetch failed');
}

async function fetchWeatherByCoords(lat, lon) {
    if (!isWeatherConfigured()) {
        return null;
    }

    if (lat == null || lon == null) {
        console.warn('Invalid coordinates provided');
        return null;
    }

    const url = `${CONFIG.WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${CONFIG.WEATHER_API_KEY}&units=metric`;

    return await safeFetchJSON(url, 'Weather fetch by coordinates failed');
}

async function fetchNews(category, count = 3) {
    if (!isNewsConfigured()) {
        return null;
    }

    if (!category) {
        console.warn('News category is required');
        return null;
    }

    const safeCategory = encodeURIComponent(category);
    const safeCount = Math.max(1, Math.min(count, 10)); // limit between 1 and 10
    const url = `${CONFIG.NEWS_API_URL}?q=${encodeURIComponent(category)}&lang=en&max=${count}&apikey=${CONFIG.NEWS_API_KEY}`;

    return await safeFetchJSON(url, 'News fetch failed');
}

async function fetchExchangeRates(baseCurrency = 'EGP') {
    if (!isExchangeConfigured()) {
        return null;
    }

    const safeBase = encodeURIComponent(baseCurrency.toUpperCase());
    const url = `${CONFIG.EXCHANGE_API_URL}/${CONFIG.EXCHANGE_API_KEY}/latest/${safeBase}`;

    return await safeFetchJSON(url, 'Exchange rates fetch failed');
}

async function fetchLiveMatches(
    leagueId = CONFIG.DEFAULT_LEAGUE_ID,
    dateFrom = formatDate(new Date()),
    dateTo = formatDate(new Date())
) {
    if (!isSportsConfigured()) {
        return null;
    }

    if (!leagueId) {
        console.warn('League ID is required');
        return null;
    }

    const url = `${CONFIG.SPORTS_API_URL}/?met=Livescore&leagueId=${leagueId}&APIkey=${CONFIG.SPORTS_API_KEY}`;
    const data = await safeFetchJSON(url, 'Live matches fetch failed');

    if (!data || !data.result) {
        console.warn('No live matches data returned', data);
        return null;
    }

    return data;
}

async function fetchMatches(
    leagueId = CONFIG.DEFAULT_LEAGUE_ID,
    dateFrom = formatDate(new Date()),
    dateTo = formatDate(new Date())
) {
    if (!isSportsConfigured()) {
        return null;
    }

    if (!leagueId || !dateFrom || !dateTo) {
        console.warn('League ID, dateFrom, and dateTo are required');
        return null;
    }

    const url = `${CONFIG.SPORTS_API_URL}/?met=Fixtures&leagueId=${leagueId}&from=${dateFrom}&to=${dateTo}&APIkey=${CONFIG.SPORTS_API_KEY}`;
    const data = await safeFetchJSON(url, 'Matches fetch failed');

    if (!data || !data.result) {
        console.warn('No matches data returned', data);
        return null;
    }

    return data;
}

async function fetchStandings(leagueId = CONFIG.DEFAULT_LEAGUE_ID) {
    if (!isSportsConfigured()) {
        return null;
    }

    if (!leagueId) {
        console.warn('League ID is required');
        return null;
    }

    const url = `${CONFIG.SPORTS_API_URL}/?met=Standings&leagueId=${leagueId}&APIkey=${CONFIG.SPORTS_API_KEY}`;
    const data = await safeFetchJSON(url, 'Standings fetch failed');

    if (!data || !data.result) {
        console.warn('No standings data returned', data);
        return null;
    }

    return data;
}

async function fetchTopScorers(leagueId = CONFIG.DEFAULT_LEAGUE_ID) {
    if (!isSportsConfigured()) {
        return null;
    }

    if (!leagueId) {
        console.warn('League ID is required');
        return null;
    }

    const url = `${CONFIG.SPORTS_API_URL}/?met=Topscorers&leagueId=${leagueId}&APIkey=${CONFIG.SPORTS_API_KEY}`;
    const data = await safeFetchJSON(url, 'Top scorers fetch failed');

    if (!data || !data.result) {
        console.warn('No top scorers data returned', data);
        return null;
    }

    return data;
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        console.warn('formatDate expects a Date object');
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'bi-sun-fill',
        '01n': 'bi-moon-fill',
        '02d': 'bi-cloud-sun-fill',
        '02n': 'bi-cloud-moon-fill',
        '03d': 'bi-cloud-fill',
        '03n': 'bi-cloud-fill',
        '04d': 'bi-clouds-fill',
        '04n': 'bi-clouds-fill',
        '09d': 'bi-cloud-drizzle-fill',
        '09n': 'bi-cloud-drizzle-fill',
        '10d': 'bi-cloud-rain-fill',
        '10n': 'bi-cloud-rain-fill',
        '11d': 'bi-cloud-lightning-fill',
        '11n': 'bi-cloud-lightning-fill',
        '13d': 'bi-snow-fill',
        '13n': 'bi-snow-fill',
        '50d': 'bi-cloud-haze-fill',
        '50n': 'bi-cloud-haze-fill'
    };

    return iconMap[iconCode] || 'bi-cloud-fill';
}

let exchangeRatesCache = null;

async function getConversionRate(from, to) {
    if (!from || !to) {
        console.warn('Both source and target currencies are required');
        return null;
    }

    const baseCurrency = from.toUpperCase();
    const targetCurrency = to.toUpperCase();

    if (!exchangeRatesCache || exchangeRatesCache.base !== baseCurrency) {
        const data = await fetchExchangeRates(baseCurrency);

        if (data && data.conversion_rates) {
            exchangeRatesCache = {
                base: baseCurrency,
                rates: data.conversion_rates
            };
        } else {
            console.warn('Failed to update exchange rates cache');
            return null;
        }
    }

    if (exchangeRatesCache && exchangeRatesCache.rates[targetCurrency]) {
        return exchangeRatesCache.rates[targetCurrency];
    }

    console.warn(`Conversion rate not found: ${baseCurrency} -> ${targetCurrency}`);
    return null;
}