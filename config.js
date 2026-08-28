const CONFIG = {
    
    WEATHER_API_KEY: 'a42a00a3e1daba7089518ba2b5471fac', // Get from https://openweathermap.org/api
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    
   
    NEWS_API_KEY: '9b54a79f7ab64d0bd302483129574948', // Get from https://gnews.io
    NEWS_API_URL: 'https://gnews.io/api/v4/search',
    
    
    SPORTS_API_KEY: '6ae7d65a5165d8bfd6811f30761d24c842b78a39384f99e0ac4af2f07553a97c', // Get from https://allsportsapi.com
    SPORTS_API_URL: 'https://apiv2.allsportsapi.com/football',
    
    EXCHANGE_API_KEY: '7699e0dd2a7a0910651256b3', // Get from https://exchangerate-api.com
    EXCHANGE_API_URL: 'https://v6.exchangerate-api.com/v6',
    
    
    DEFAULT_LEAGUE_ID: '152',
    
    DEFAULT_CITY: 'Cairo'
};

function isWeatherConfigured() {
    return !!CONFIG.WEATHER_API_KEY && CONFIG.WEATHER_API_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY';
}

function isNewsConfigured() {
    return !!CONFIG.NEWS_API_KEY && CONFIG.NEWS_API_KEY !== 'YOUR_GNEWS_API_KEY';
}

function isSportsConfigured() {
    return !!CONFIG.SPORTS_API_KEY && CONFIG.SPORTS_API_KEY !== 'YOUR_ALLSPORTS_API_KEY';
}

function isExchangeConfigured() {
    return !!CONFIG.EXCHANGE_API_KEY && CONFIG.EXCHANGE_API_KEY !== 'YOUR_EXCHANGERATE_API_KEY';
}

function areAllAPIsConfigured() {
    return isWeatherConfigured() &&
           isNewsConfigured() &&
           isSportsConfigured() &&
           isExchangeConfigured();
}

function showAPISetupMessage(containerId, apiName) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-4">
            <i class="bi bi-key-fill text-4xl text-muted mb-3 d-block"></i>
            <p class="text-muted mb-2">API Key Required</p>
            <small class="text-muted">
                Please configure your ${apiName} API key in js/config.js
            </small>
        </div>
    `;
}


