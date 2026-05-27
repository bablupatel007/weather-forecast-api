/* ========================================
   ICA STUDIO - INTERACTIVE CONTEXTUAL ANALYTICS
   Multi-City Weather Comparison Intelligence
   ======================================== */

const ICAStudio = {
    // Comprehensive global cities database with country codes and flags
    globalCitiesDatabase: [
        // Europe
        { name: 'London', flag: '🇬🇧', country: 'United Kingdom', countryCode: 'GB' },
        { name: 'Paris', flag: '🇫🇷', country: 'France', countryCode: 'FR' },
        { name: 'Berlin', flag: '🇩🇪', country: 'Germany', countryCode: 'DE' },
        { name: 'Madrid', flag: '🇪🇸', country: 'Spain', countryCode: 'ES' },
        { name: 'Rome', flag: '🇮🇹', country: 'Italy', countryCode: 'IT' },
        { name: 'Amsterdam', flag: '🇳🇱', country: 'Netherlands', countryCode: 'NL' },
        { name: 'Vienna', flag: '🇦🇹', country: 'Austria', countryCode: 'AT' },
        { name: 'Prague', flag: '🇨🇿', country: 'Czech Republic', countryCode: 'CZ' },
        { name: 'Stockholm', flag: '🇸🇪', country: 'Sweden', countryCode: 'SE' },
        { name: 'Copenhagen', flag: '🇩🇰', country: 'Denmark', countryCode: 'DK' },
        { name: 'Oslo', flag: '🇳🇴', country: 'Norway', countryCode: 'NO' },
        { name: 'Helsinki', flag: '🇫🇮', country: 'Finland', countryCode: 'FI' },
        { name: 'Warsaw', flag: '🇵🇱', country: 'Poland', countryCode: 'PL' },
        { name: 'Budapest', flag: '🇭🇺', country: 'Hungary', countryCode: 'HU' },
        { name: 'Athens', flag: '🇬🇷', country: 'Greece', countryCode: 'GR' },
        { name: 'Lisbon', flag: '🇵🇹', country: 'Portugal', countryCode: 'PT' },
        { name: 'Dublin', flag: '🇮🇪', country: 'Ireland', countryCode: 'IE' },
        { name: 'Brussels', flag: '🇧🇪', country: 'Belgium', countryCode: 'BE' },
        { name: 'Zurich', flag: '🇨🇭', country: 'Switzerland', countryCode: 'CH' },
        
        // Asia
        { name: 'Tokyo', flag: '🇯🇵', country: 'Japan', countryCode: 'JP' },
        { name: 'Mumbai', flag: '🇮🇳', country: 'India', countryCode: 'IN' },
        { name: 'Delhi', flag: '🇮🇳', country: 'India', countryCode: 'IN' },
        { name: 'Bangalore', flag: '🇮🇳', country: 'India', countryCode: 'IN' },
        { name: 'Chennai', flag: '🇮🇳', country: 'India', countryCode: 'IN' },
        { name: 'Kolkata', flag: '🇮🇳', country: 'India', countryCode: 'IN' },
        { name: 'Hyderabad', flag: '🇮🇳', country: 'India', countryCode: 'IN' },
        { name: 'Beijing', flag: '🇨🇳', country: 'China', countryCode: 'CN' },
        { name: 'Shanghai', flag: '🇨🇳', country: 'China', countryCode: 'CN' },
        { name: 'Hong Kong', flag: '🇭🇰', country: 'Hong Kong', countryCode: 'HK' },
        { name: 'Singapore', flag: '🇸🇬', country: 'Singapore', countryCode: 'SG' },
        { name: 'Seoul', flag: '🇰🇷', country: 'South Korea', countryCode: 'KR' },
        { name: 'Bangkok', flag: '🇹🇭', country: 'Thailand', countryCode: 'TH' },
        { name: 'Dubai', flag: '🇦🇪', country: 'UAE', countryCode: 'AE' },
        { name: 'Kuala Lumpur', flag: '🇲🇾', country: 'Malaysia', countryCode: 'MY' },
        { name: 'Jakarta', flag: '🇮🇩', country: 'Indonesia', countryCode: 'ID' },
        { name: 'Manila', flag: '🇵🇭', country: 'Philippines', countryCode: 'PH' },
        { name: 'Taipei', flag: '🇹🇼', country: 'Taiwan', countryCode: 'TW' },
        { name: 'Tel Aviv', flag: '🇮🇱', country: 'Israel', countryCode: 'IL' },
        { name: 'Istanbul', flag: '🇹🇷', country: 'Turkey', countryCode: 'TR' },
        
        // Americas
        { name: 'New York', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Los Angeles', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Chicago', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'San Francisco', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Miami', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Seattle', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Boston', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Washington', flag: '🇺🇸', country: 'United States', countryCode: 'US' },
        { name: 'Toronto', flag: '🇨🇦', country: 'Canada', countryCode: 'CA' },
        { name: 'Vancouver', flag: '🇨🇦', country: 'Canada', countryCode: 'CA' },
        { name: 'Montreal', flag: '🇨🇦', country: 'Canada', countryCode: 'CA' },
        { name: 'Mexico City', flag: '🇲🇽', country: 'Mexico', countryCode: 'MX' },
        { name: 'São Paulo', flag: '🇧🇷', country: 'Brazil', countryCode: 'BR' },
        { name: 'Rio de Janeiro', flag: '🇧🇷', country: 'Brazil', countryCode: 'BR' },
        { name: 'Buenos Aires', flag: '🇦🇷', country: 'Argentina', countryCode: 'AR' },
        { name: 'Lima', flag: '🇵🇪', country: 'Peru', countryCode: 'PE' },
        { name: 'Bogotá', flag: '🇨🇴', country: 'Colombia', countryCode: 'CO' },
        { name: 'Santiago', flag: '🇨🇱', country: 'Chile', countryCode: 'CL' },
        
        // Oceania
        { name: 'Sydney', flag: '🇦🇺', country: 'Australia', countryCode: 'AU' },
        { name: 'Melbourne', flag: '🇦🇺', country: 'Australia', countryCode: 'AU' },
        { name: 'Brisbane', flag: '🇦🇺', country: 'Australia', countryCode: 'AU' },
        { name: 'Perth', flag: '🇦🇺', country: 'Australia', countryCode: 'AU' },
        { name: 'Auckland', flag: '🇳🇿', country: 'New Zealand', countryCode: 'NZ' },
        { name: 'Wellington', flag: '🇳🇿', country: 'New Zealand', countryCode: 'NZ' },
        
        // Africa
        { name: 'Cairo', flag: '🇪🇬', country: 'Egypt', countryCode: 'EG' },
        { name: 'Cape Town', flag: '🇿🇦', country: 'South Africa', countryCode: 'ZA' },
        { name: 'Johannesburg', flag: '🇿🇦', country: 'South Africa', countryCode: 'ZA' },
        { name: 'Lagos', flag: '🇳🇬', country: 'Nigeria', countryCode: 'NG' },
        { name: 'Nairobi', flag: '🇰🇪', country: 'Kenya', countryCode: 'KE' },
        { name: 'Casablanca', flag: '🇲🇦', country: 'Morocco', countryCode: 'MA' }
    ],

    // Default cities for quick selection
    defaultCities: [
        { name: 'London', flag: '🇬🇧', country: 'GB' },
        { name: 'Mumbai', flag: '🇮🇳', country: 'IN' },
        { name: 'Delhi', flag: '🇮🇳', country: 'IN' },
        { name: 'Tokyo', flag: '🇯🇵', country: 'JP' },
        { name: 'Paris', flag: '🇫🇷', country: 'FR' },
        { name: 'New York', flag: '🇺🇸', country: 'US' },
        { name: 'Sydney', flag: '🇦🇺', country: 'AU' },
        { name: 'Berlin', flag: '🇩🇪', country: 'DE' }
    ],

    // Trending cities for suggestions
    trendingCities: [
        'Dubai', 'Singapore', 'Tokyo', 'New York', 'London',
        'Paris', 'Sydney', 'Hong Kong', 'Los Angeles', 'Mumbai'
    ],

    selectedCities: [],
    weatherData: {},
    charts: {},
    searchDebounceTimer: null,
    recentSearches: [],
    currentSuggestionIndex: -1,

    // Initialize ICA Studio
    init: function() {
        console.log('🌍 Initializing ICA Studio...');
        this.generateCityChips();
        this.startUTCClock();
        this.setupEventListeners();
        this.animateSubtitle();
    },

    // Generate city selection chips
    generateCityChips: function() {
        const container = document.getElementById('icaCityChips');
        if (!container) return;

        container.innerHTML = '';
        
        this.defaultCities.forEach((city, index) => {
            const chip = document.createElement('div');
            chip.className = 'ica-city-chip';
            chip.setAttribute('data-city', city.name);
            chip.style.animationDelay = `${index * 0.05}s`;
            
            chip.innerHTML = `
                <div class="ica-city-chip-flag">${city.flag}</div>
                <div class="ica-city-chip-info">
                    <div class="ica-city-chip-name">${city.name}</div>
                    <div class="ica-city-chip-temp" id="temp-${city.name.replace(/\s+/g, '-')}">Loading...</div>
                </div>
            `;
            
            chip.addEventListener('click', () => this.toggleCity(city.name, chip));
            container.appendChild(chip);
        });

        // Load preview temperatures
        this.loadCityPreviews();
    },

    // Load preview temperatures for all cities
    loadCityPreviews: async function() {
        for (const city of this.defaultCities) {
            try {
                const response = await fetch(`/weather/${city.name}`);
                if (response.ok) {
                    const data = await response.json();
                    const tempElement = document.getElementById(`temp-${city.name.replace(/\s+/g, '-')}`);
                    if (tempElement) {
                        tempElement.textContent = `${Math.round(data.temperature)}°C`;
                    }
                }
            } catch (error) {
                console.log(`Preview load failed for ${city.name}`);
            }
        }
    },

    // Toggle city selection
    toggleCity: function(cityName, chipElement) {
        const index = this.selectedCities.indexOf(cityName);
        
        if (index > -1) {
            // Deselect city
            this.selectedCities.splice(index, 1);
            chipElement.classList.remove('selected');
        } else {
            // Select city (max 6 cities)
            if (this.selectedCities.length >= 6) {
                this.showNotification('⚠️ Maximum 6 cities can be compared at once', 'warning');
                return;
            }
            this.selectedCities.push(cityName);
            chipElement.classList.add('selected');
        }

        console.log('Selected cities:', this.selectedCities);
    },

    // Compare all selected cities
    compareAll: async function() {
        if (this.selectedCities.length < 2) {
            this.showNotification('⚠️ Please select at least 2 cities to compare', 'warning');
            return;
        }

        this.showNotification('🔄 Loading weather data...', 'info');
        
        // Fetch weather data for all selected cities
        const promises = this.selectedCities.map(city => this.fetchWeatherData(city));
        
        try {
            const results = await Promise.all(promises);
            results.forEach((data, index) => {
                if (data) {
                    this.weatherData[this.selectedCities[index]] = data;
                }
            });

            // Generate all analytics sections
            this.generateContextEngine();
            this.generateVisualization();
            this.generateInsights();
            this.generateWorldMap();
            this.generateTimeline();
            this.generatePredictive();
            this.generateRecommendations();

            // Show all sections
            this.showAllSections();

            this.showNotification('✅ Analysis complete!', 'success');
        } catch (error) {
            console.error('Error comparing cities:', error);
            this.showNotification('❌ Error loading weather data', 'error');
        }
    },

    // Fetch weather data for a city
    fetchWeatherData: async function(cityName) {
        try {
            const response = await fetch(`/weather/${cityName}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error(`Error fetching data for ${cityName}:`, error);
        }
        return null;
    },

    // Generate Context Engine metrics with real-time data
    generateContextEngine: function() {
        const container = document.getElementById('icaMetricsGrid');
        if (!container) return;

        const metrics = this.calculateMetrics();
        container.innerHTML = '';

        const metricCards = [
            { icon: '🌡️', label: 'Avg Temperature', value: `${metrics.avgTemp}°C`, progress: metrics.avgTemp / 50 * 100 },
            { icon: '💧', label: 'Avg Humidity', value: `${metrics.avgHumidity}%`, progress: metrics.avgHumidity },
            { icon: '💨', label: 'Avg Wind Speed', value: `${metrics.avgWind} m/s`, progress: metrics.avgWind / 20 * 100 },
            { icon: '🎯', label: 'Comfort Index', value: metrics.comfortIndex, progress: metrics.comfortScore },
            { icon: '🌿', label: 'Air Quality (AQI)', value: metrics.avgAQI ? `${metrics.avgAQI} - ${metrics.aqiLevel}` : 'N/A', progress: metrics.avgAQI ? (metrics.avgAQI / 500 * 100) : 0 },
            { icon: '☀️', label: 'Avg UV Index', value: metrics.avgUV ? metrics.avgUV.toFixed(1) : 'N/A', progress: metrics.avgUV ? (metrics.avgUV / 11 * 100) : 0 },
            { icon: '⚠️', label: 'Weather Severity', value: metrics.severity, progress: metrics.severityScore },
            { icon: '🌈', label: 'Best Conditions', value: metrics.bestCity, progress: 100 }
        ];

        metricCards.forEach((metric, index) => {
            const card = document.createElement('div');
            card.className = 'ica-metric-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="ica-metric-icon">${metric.icon}</div>
                <div class="ica-metric-label">${metric.label}</div>
                <div class="ica-metric-value">${metric.value}</div>
                <div class="ica-metric-progress">
                    <div class="ica-metric-progress-bar" style="width: ${Math.min(metric.progress, 100)}%"></div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // Calculate aggregate metrics from real-time data
    calculateMetrics: function() {
        const cities = Object.values(this.weatherData);
        if (cities.length === 0) return {};

        const avgTemp = cities.reduce((sum, c) => sum + c.temperature, 0) / cities.length;
        const avgHumidity = cities.reduce((sum, c) => sum + c.humidity, 0) / cities.length;
        const avgWind = cities.reduce((sum, c) => sum + c.windSpeed, 0) / cities.length;

        // Calculate AQI metrics
        const citiesWithAQI = cities.filter(c => c.aqi);
        const avgAQI = citiesWithAQI.length > 0
            ? Math.round(citiesWithAQI.reduce((sum, c) => sum + c.aqi, 0) / citiesWithAQI.length)
            : null;
        const aqiLevel = avgAQI
            ? (avgAQI <= 50 ? 'Good' : avgAQI <= 100 ? 'Moderate' : avgAQI <= 150 ? 'Unhealthy for Sensitive' : 'Unhealthy')
            : 'N/A';

        // Calculate UV Index metrics
        const citiesWithUV = cities.filter(c => c.uvIndex);
        const avgUV = citiesWithUV.length > 0
            ? citiesWithUV.reduce((sum, c) => sum + c.uvIndex, 0) / citiesWithUV.length
            : null;

        // Calculate comfort index (lower humidity + moderate temp = better)
        const comfortScores = cities.map(c => {
            const tempScore = Math.max(0, 100 - Math.abs(c.temperature - 22) * 3);
            const humidityScore = Math.max(0, 100 - Math.abs(c.humidity - 50));
            return (tempScore + humidityScore) / 2;
        });
        const avgComfort = comfortScores.reduce((a, b) => a + b, 0) / comfortScores.length;
        const comfortIndex = avgComfort > 75 ? 'Excellent' : avgComfort > 50 ? 'Good' : 'Moderate';

        // Find best city
        const bestCityIndex = comfortScores.indexOf(Math.max(...comfortScores));
        const bestCity = this.selectedCities[bestCityIndex];

        // Calculate severity
        const maxWind = Math.max(...cities.map(c => c.windSpeed));
        const severityScore = Math.min(100, (maxWind / 20 * 100 + avgHumidity) / 2);
        const severity = severityScore > 70 ? 'High' : severityScore > 40 ? 'Moderate' : 'Low';

        return {
            avgTemp: Math.round(avgTemp),
            avgHumidity: Math.round(avgHumidity),
            avgWind: avgWind.toFixed(1),
            avgAQI,
            aqiLevel,
            avgUV,
            comfortIndex,
            comfortScore: avgComfort,
            severity,
            severityScore,
            bestCity
        };
    },

    // Generate visualization charts
    generateVisualization: function() {
        const cities = this.selectedCities;
        const data = cities.map(city => this.weatherData[city]);

        // Temperature comparison chart
        this.createBarChart('icaTempChart', 'Temperature (°C)', cities, 
            data.map(d => d.temperature), '#667eea');

        // Humidity comparison chart
        this.createBarChart('icaHumidityChart', 'Humidity (%)', cities, 
            data.map(d => d.humidity), '#764ba2');

        // Wind speed comparison chart
        this.createBarChart('icaWindChart', 'Wind Speed (m/s)', cities, 
            data.map(d => d.windSpeed), '#f093fb');

        // Radar chart for multi-factor comparison
        this.createRadarChart('icaRadarChart', cities, data);
    },

    // Create bar chart
    createBarChart: function(canvasId, label, labels, data, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 2,
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                }
            }
        });
    },

    // Create radar chart
    createRadarChart: function(canvasId, labels, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        // Normalize data for radar chart using real-time weather data
        const datasets = labels.map((city, index) => {
            const cityData = data[index];
            // Calculate comfort score dynamically
            const comfortScore = Math.max(0, 100 - Math.abs(cityData.temperature - 22) * 3);
            // Use real AQI data from API (scale 0-500 to 0-100 for chart)
            const aqiScore = cityData.aqi ? Math.min(100, (cityData.aqi / 500) * 100) : 50;
            
            return {
                label: city,
                data: [
                    cityData.temperature / 50 * 100, // Temperature normalized
                    cityData.humidity, // Humidity percentage
                    cityData.windSpeed / 20 * 100, // Wind speed normalized
                    comfortScore, // Comfort index
                    aqiScore // Real AQI data
                ],
                borderColor: this.getChartColor(index),
                backgroundColor: this.getChartColor(index, 0.2),
                borderWidth: 2
            };
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Temperature', 'Humidity', 'Wind', 'Comfort', 'Air Quality'],
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)'
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            backdropColor: 'transparent'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.9)'
                        }
                    }
                }
            }
        });
    },

    // Get chart color
    getChartColor: function(index, alpha = 1) {
        const colors = [
            `rgba(102, 126, 234, ${alpha})`,
            `rgba(118, 75, 162, ${alpha})`,
            `rgba(240, 147, 251, ${alpha})`,
            `rgba(245, 87, 108, ${alpha})`,
            `rgba(254, 202, 87, ${alpha})`,
            `rgba(72, 219, 251, ${alpha})`
        ];
        return colors[index % colors.length];
    },

    // Generate AI insights
    generateInsights: function() {
        const container = document.getElementById('icaInsightsFeed');
        if (!container) return;

        const insights = this.generateAIInsights();
        container.innerHTML = '';

        insights.forEach((insight, index) => {
            const card = document.createElement('div');
            card.className = 'ica-insight-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="ica-insight-header">
                    <div class="ica-insight-icon">${insight.icon}</div>
                    <div class="ica-insight-title">${insight.title}</div>
                </div>
                <div class="ica-insight-text">${insight.text}</div>
            `;
            container.appendChild(card);
        });
    },

    // Generate AI insights based on real-time data
    generateAIInsights: function() {
        const cities = Object.entries(this.weatherData);
        const insights = [];

        // Highest temperature
        const hottest = cities.reduce((max, city) =>
            city[1].temperature > max[1].temperature ? city : max);
        insights.push({
            icon: '🔥',
            title: 'Highest Temperature',
            text: `${hottest[0]} is experiencing the highest temperature at ${Math.round(hottest[1].temperature)}°C. Consider indoor activities during peak hours.`
        });

        // Highest humidity
        const mostHumid = cities.reduce((max, city) =>
            city[1].humidity > max[1].humidity ? city : max);
        insights.push({
            icon: '💧',
            title: 'Humidity Alert',
            text: `${mostHumid[0]} has the highest humidity at ${mostHumid[1].humidity}%. This may cause discomfort and affect outdoor activities.`
        });

        // Best AQI (Air Quality)
        const bestAQI = cities.reduce((min, city) =>
            (city[1].aqi || 999) < (min[1].aqi || 999) ? city : min);
        if (bestAQI[1].aqi) {
            insights.push({
                icon: '🌿',
                title: 'Best Air Quality',
                text: `${bestAQI[0]} has the best air quality with AQI of ${bestAQI[1].aqi} (${bestAQI[1].aqiLevel}). Ideal for outdoor activities and exercise.`
            });
        }

        // Best weather
        const metrics = this.calculateMetrics();
        insights.push({
            icon: '🌟',
            title: 'Best Weather Conditions',
            text: `${metrics.bestCity} currently offers the most comfortable weather conditions with optimal temperature and humidity levels.`
        });

        // Wind conditions
        const windiest = cities.reduce((max, city) =>
            city[1].windSpeed > max[1].windSpeed ? city : max);
        if (windiest[1].windSpeed > 10) {
            insights.push({
                icon: '💨',
                title: 'Strong Wind Alert',
                text: `${windiest[0]} is experiencing strong winds at ${windiest[1].windSpeed.toFixed(1)} m/s. Exercise caution for outdoor activities.`
            });
        }

        // UV Index warning
        const highestUV = cities.reduce((max, city) =>
            (city[1].uvIndex || 0) > (max[1].uvIndex || 0) ? city : max);
        if (highestUV[1].uvIndex && highestUV[1].uvIndex > 6) {
            insights.push({
                icon: '☀️',
                title: 'High UV Index',
                text: `${highestUV[0]} has a high UV index of ${highestUV[1].uvIndex.toFixed(1)}. Use sunscreen and limit sun exposure during peak hours.`
            });
        }

        // Rain probability
        const rainyCity = cities.find(city => city[1].chanceOfRain && city[1].chanceOfRain > 50);
        if (rainyCity) {
            insights.push({
                icon: '🌧️',
                title: 'Rain Expected',
                text: `${rainyCity[0]} has a ${rainyCity[1].chanceOfRain}% chance of rain. Carry an umbrella and plan indoor alternatives.`
            });
        }

        return insights;
    },

    // Generate world map
    generateWorldMap: function() {
        const container = document.getElementById('icaMapCanvas');
        if (!container) return;

        container.innerHTML = '';

        this.selectedCities.forEach((city, index) => {
            const data = this.weatherData[city];
            const marker = document.createElement('div');
            marker.className = 'ica-map-marker';
            marker.style.animationDelay = `${index * 0.2}s`;
            marker.innerHTML = `
                <div style="font-size: 1.2em; margin-bottom: 5px;">${this.defaultCities.find(c => c.name === city)?.flag || '🌍'}</div>
                <div style="font-weight: 700;">${city}</div>
                <div style="font-size: 0.9em; margin-top: 3px;">${Math.round(data.temperature)}°C</div>
            `;
            container.appendChild(marker);
        });
    },

    // Generate timeline with dynamic temperature trends
    generateTimeline: function() {
        const container = document.getElementById('icaTimelineGrid');
        if (!container) return;

        const avgTemp = this.calculateAverageTemp();
        const cities = Object.values(this.weatherData);
        
        // Calculate temperature variations based on typical daily patterns
        const periods = [
            {
                name: 'Morning',
                icon: '🌅',
                time: '06:00-12:00',
                tempAdjust: -3 // Typically cooler in morning
            },
            {
                name: 'Afternoon',
                icon: '☀️',
                time: '12:00-18:00',
                tempAdjust: 2 // Peak temperature
            },
            {
                name: 'Evening',
                icon: '🌆',
                time: '18:00-21:00',
                tempAdjust: -1 // Cooling down
            },
            {
                name: 'Night',
                icon: '🌙',
                time: '21:00-06:00',
                tempAdjust: -4 // Coolest period
            }
        ];

        container.innerHTML = '';

        periods.forEach((period, index) => {
            const periodTemp = Math.round(avgTemp + period.tempAdjust);
            const card = document.createElement('div');
            card.className = 'ica-timeline-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="ica-timeline-period">${period.name}</div>
                <div class="ica-timeline-icon">${period.icon}</div>
                <div class="ica-timeline-data">${periodTemp}°C</div>
                <div style="font-size: 0.85em; color: rgba(255,255,255,0.8); margin-top: 8px;">${period.time}</div>
            `;
            container.appendChild(card);
        });
    },

    // Generate predictive analytics based on real weather data
    generatePredictive: function() {
        const container = document.getElementById('icaPredictiveGrid');
        if (!container) return;

        const cities = Object.values(this.weatherData);
        const predictions = [];

        // Storm Risk - based on wind speed and precipitation
        const maxWind = Math.max(...cities.map(c => c.windSpeed));
        const avgPrecip = cities.reduce((sum, c) => sum + (c.precipitation || 0), 0) / cities.length;
        const stormRisk = maxWind > 15 || avgPrecip > 5 ? 'High' : maxWind > 10 ? 'Moderate' : 'Low';
        const stormDesc = stormRisk === 'High'
            ? 'Strong winds and precipitation detected. Stay indoors and monitor weather updates.'
            : stormRisk === 'Moderate'
            ? 'Moderate wind conditions. Exercise caution for outdoor activities.'
            : 'No significant storm activity expected. Weather conditions are stable.';
        predictions.push({
            icon: '⛈️',
            title: 'Storm Risk',
            value: stormRisk,
            desc: stormDesc
        });

        // Heatwave Alert - based on temperature
        const maxTemp = Math.max(...cities.map(c => c.temperature));
        const avgTemp = cities.reduce((sum, c) => sum + c.temperature, 0) / cities.length;
        const heatwaveLevel = maxTemp > 38 ? 'High' : maxTemp > 35 ? 'Moderate' : 'Low';
        const heatwaveDesc = heatwaveLevel === 'High'
            ? `Extreme heat detected (${Math.round(maxTemp)}°C). Stay hydrated and avoid prolonged sun exposure.`
            : heatwaveLevel === 'Moderate'
            ? `Warm temperatures (${Math.round(maxTemp)}°C). Take precautions during outdoor activities.`
            : `Comfortable temperatures across all cities (avg ${Math.round(avgTemp)}°C).`;
        predictions.push({
            icon: '🔥',
            title: 'Heatwave Alert',
            value: heatwaveLevel,
            desc: heatwaveDesc
        });

        // Travel Conditions - based on overall weather
        const avgHumidity = cities.reduce((sum, c) => sum + c.humidity, 0) / cities.length;
        const travelScore = (maxWind < 12 && avgHumidity < 80 && maxTemp < 35) ? 'Excellent'
            : (maxWind < 15 && avgHumidity < 85) ? 'Good' : 'Fair';
        const travelDesc = travelScore === 'Excellent'
            ? 'Ideal weather conditions for travel across all cities. Safe and comfortable journey expected.'
            : travelScore === 'Good'
            ? 'Generally favorable conditions. Minor weather variations may occur.'
            : 'Weather conditions require attention. Plan accordingly and check updates.';
        predictions.push({
            icon: '✈️',
            title: 'Travel Conditions',
            value: travelScore,
            desc: travelDesc
        });

        // Outdoor Activity - based on UV, temp, and AQI
        const avgUV = cities.reduce((sum, c) => sum + (c.uvIndex || 0), 0) / cities.length;
        const avgAQI = cities.reduce((sum, c) => sum + (c.aqi || 50), 0) / cities.length;
        const outdoorScore = (avgUV < 6 && avgAQI < 100 && avgTemp < 32 && avgTemp > 15) ? 'Excellent'
            : (avgUV < 8 && avgAQI < 150) ? 'Good' : 'Moderate';
        const outdoorDesc = outdoorScore === 'Excellent'
            ? 'Perfect conditions for outdoor activities. Low UV, good air quality, and comfortable temperatures.'
            : outdoorScore === 'Good'
            ? 'Suitable for outdoor activities with basic precautions. Use sunscreen if UV is elevated.'
            : 'Consider indoor alternatives or take extra precautions for outdoor activities.';
        predictions.push({
            icon: '🏃',
            title: 'Outdoor Activity',
            value: outdoorScore,
            desc: outdoorDesc
        });

        // Climate Anomaly - based on temperature variance
        const tempVariance = Math.max(...cities.map(c => c.temperature)) - Math.min(...cities.map(c => c.temperature));
        const anomalyLevel = tempVariance > 20 ? 'High' : tempVariance > 10 ? 'Moderate' : 'Normal';
        const anomalyDesc = anomalyLevel === 'High'
            ? `Significant temperature variation (${Math.round(tempVariance)}°C difference) across cities. Regional climate differences detected.`
            : anomalyLevel === 'Moderate'
            ? `Moderate temperature variation (${Math.round(tempVariance)}°C) between cities. Expected seasonal patterns.`
            : `Consistent weather patterns across all cities. Temperature variance within normal range.`;
        predictions.push({
            icon: '🌡️',
            title: 'Climate Anomaly',
            value: anomalyLevel,
            desc: anomalyDesc
        });

        container.innerHTML = '';

        predictions.forEach((pred, index) => {
            const card = document.createElement('div');
            card.className = 'ica-predictive-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="ica-predictive-icon">${pred.icon}</div>
                <div class="ica-predictive-title">${pred.title}</div>
                <div class="ica-predictive-value">${pred.value}</div>
                <div class="ica-predictive-desc">${pred.desc}</div>
            `;
            container.appendChild(card);
        });
    },

    // Generate recommendations
    generateRecommendations: function() {
        const container = document.getElementById('icaRecommendationsGrid');
        if (!container) return;

        const metrics = this.calculateMetrics();
        const recommendations = [
            {
                icon: '🏖️',
                title: 'Best City for Travel',
                text: `${metrics.bestCity} offers the most comfortable weather conditions today. Ideal for sightseeing and outdoor activities.`,
                badge: 'Recommended'
            },
            {
                icon: '🌡️',
                title: 'Temperature Advisory',
                text: `Average temperature across selected cities is ${metrics.avgTemp}°C. Dress accordingly and stay hydrated.`,
                badge: 'Advisory'
            },
            {
                icon: '💧',
                title: 'Humidity Impact',
                text: `Current humidity levels average ${metrics.avgHumidity}%. Consider indoor activities during peak humidity hours.`,
                badge: 'Info'
            },
            {
                icon: '🎯',
                title: 'Optimal Conditions',
                text: `Weather severity is ${metrics.severity.toLowerCase()}. All cities are suitable for normal outdoor activities.`,
                badge: 'All Clear'
            }
        ];

        container.innerHTML = '';

        recommendations.forEach((rec, index) => {
            const card = document.createElement('div');
            card.className = 'ica-recommendation-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="ica-rec-header">
                    <div class="ica-rec-icon">${rec.icon}</div>
                    <div class="ica-rec-title">${rec.title}</div>
                </div>
                <div class="ica-rec-text">${rec.text}</div>
                <div class="ica-rec-badge">${rec.badge}</div>
            `;
            container.appendChild(card);
        });
    },

    // Calculate average temperature
    calculateAverageTemp: function() {
        const temps = Object.values(this.weatherData).map(d => d.temperature);
        return temps.reduce((a, b) => a + b, 0) / temps.length;
    },

    // Show all sections
    showAllSections: function() {
        const sections = [
            'icaContextEngine',
            'icaVisualization',
            'icaInsights',
            'icaWorldMap',
            'icaTimeline',
            'icaPredictive',
            'icaRecommendations'
        ];

        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'block';
            }
        });
    },

    // Reset cities
    resetCities: function() {
        this.selectedCities = [];
        this.weatherData = {};
        
        // Remove selected class from all chips
        document.querySelectorAll('.ica-city-chip').forEach(chip => {
            chip.classList.remove('selected');
        });

        // Hide all sections
        const sections = [
            'icaContextEngine',
            'icaVisualization',
            'icaInsights',
            'icaWorldMap',
            'icaTimeline',
            'icaPredictive',
            'icaRecommendations'
        ];

        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });

        this.showNotification('🔄 Selection reset', 'info');
    },

    // Start UTC clock
    startUTCClock: function() {
        const updateClock = () => {
            const now = new Date();
            const utcTime = now.toUTCString().split(' ')[4];
            const clockElement = document.getElementById('icaUtcClock');
            if (clockElement) {
                clockElement.textContent = `UTC: ${utcTime}`;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    },

    // Animate subtitle with typing effect
    animateSubtitle: function() {
        const subtitle = document.getElementById('icaSubtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.display = 'inline-block';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Load recent searches from localStorage
        this.loadRecentSearches();

        // Search box
        const searchInput = document.getElementById('icaCitySearch');
        const suggestionsBox = document.getElementById('icaSuggestions');
        
        if (searchInput) {
            // Input event with debouncing
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            // Focus event - show trending/recent cities
            searchInput.addEventListener('focus', () => {
                if (!searchInput.value.trim()) {
                    this.showTrendingCities();
                }
            });

            // Blur event - hide suggestions after a delay
            searchInput.addEventListener('blur', (e) => {
                // Use a longer delay to ensure click/mousedown events on suggestions fire first
                setTimeout(() => {
                    if (suggestionsBox) {
                        // Only hide if the related target is not within the suggestions box
                        const relatedTarget = e.relatedTarget;
                        if (!relatedTarget || !suggestionsBox.contains(relatedTarget)) {
                            suggestionsBox.style.display = 'none';
                        }
                    }
                }, 500); // Increased delay to 500ms for better reliability
            });

            // Keyboard navigation
            searchInput.addEventListener('keydown', (e) => {
                // Handle Enter key to add city directly
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        this.addCityFromSearchInput(query);
                    }
                    return;
                }
                this.handleKeyboardNavigation(e);
            });
        }

        // Add City Button
        const addCityBtn = document.getElementById('icaAddCityBtn');
        if (addCityBtn) {
            addCityBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.addCityFromSearchInput(query);
                } else {
                    this.showToast('⚠️ Please enter a city name', 'warning');
                }
            });
        }

        // Global delegated event listener for suggestion items (fallback mechanism)
        document.addEventListener('mousedown', (e) => {
            const suggestionItem = e.target.closest('.ica-suggestion-item');
            if (suggestionItem) {
                e.preventDefault();
                e.stopPropagation();
                const cityName = suggestionItem.getAttribute('data-city');
                if (cityName) {
                    console.log('🌍 Global handler: Adding city from suggestion:', cityName);
                    const city = this.globalCitiesDatabase.find(c => c.name === cityName);
                    if (city) {
                        this.addCityFromSearch(city);
                    }
                }
            }
        });

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    },

    // Handle search input with debouncing
    handleSearchInput: function(query) {
        console.log('🔍 Search input:', query);
        clearTimeout(this.searchDebounceTimer);
        
        const suggestionsBox = document.getElementById('icaSuggestions');
        if (!suggestionsBox) {
            console.error('❌ Suggestions box not found!');
            return;
        }

        if (!query.trim()) {
            this.showTrendingCities();
            return;
        }

        // Show loading state
        suggestionsBox.innerHTML = '<div class="ica-suggestion-loading">🔍 Searching...</div>';
        suggestionsBox.style.display = 'block';
        console.log('✅ Suggestions box displayed');

        // Debounce search
        this.searchDebounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    },

    // Perform city search
    performSearch: async function(query) {
        const suggestionsBox = document.getElementById('icaSuggestions');
        if (!suggestionsBox) return;

        const searchTerm = query.toLowerCase().trim();
        
        // Filter cities from database
        const matches = this.globalCitiesDatabase.filter(city =>
            city.name.toLowerCase().includes(searchTerm) ||
            city.country.toLowerCase().includes(searchTerm)
        ).slice(0, 8); // Limit to 8 results

        if (matches.length === 0) {
            suggestionsBox.innerHTML = `
                <div class="ica-suggestion-empty">
                    <div class="ica-empty-icon">🌍</div>
                    <div class="ica-empty-text">No matching cities found</div>
                    <div class="ica-empty-hint">Try searching for major cities worldwide</div>
                </div>
            `;
            suggestionsBox.style.display = 'block';
            return;
        }

        // Fetch temperature previews for matched cities
        const citiesWithTemp = await Promise.all(
            matches.map(async (city) => {
                try {
                    const response = await fetch(`/weather/${city.name}`);
                    if (response.ok) {
                        const data = await response.json();
                        return { ...city, temperature: Math.round(data.temperature) };
                    }
                } catch (error) {
                    console.log(`Preview failed for ${city.name}`);
                }
                return { ...city, temperature: null };
            })
        );

        // Display suggestions
        this.displaySuggestions(citiesWithTemp, searchTerm);
    },

    // Display search suggestions
    displaySuggestions: function(cities, searchTerm = '') {
        const suggestionsBox = document.getElementById('icaSuggestions');
        if (!suggestionsBox) return;

        suggestionsBox.innerHTML = '';
        this.currentSuggestionIndex = -1;

        cities.forEach((city, index) => {
            const item = document.createElement('div');
            item.className = 'ica-suggestion-item';
            item.setAttribute('data-index', index);
            item.setAttribute('data-city', city.name);
            
            // Highlight matching text
            const cityNameHighlighted = this.highlightMatch(city.name, searchTerm);
            const countryHighlighted = this.highlightMatch(city.country, searchTerm);
            
            item.innerHTML = `
                <div class="ica-suggestion-content">
                    <div class="ica-suggestion-flag">${city.flag}</div>
                    <div class="ica-suggestion-info">
                        <div class="ica-suggestion-name">${cityNameHighlighted}</div>
                        <div class="ica-suggestion-country">${countryHighlighted}</div>
                    </div>
                    <div class="ica-suggestion-temp">
                        ${city.temperature !== null ? `${city.temperature}°C` : ''}
                    </div>
                </div>
            `;

            // Use mousedown instead of click to fire before blur event
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent blur from firing
                e.stopPropagation(); // Stop event bubbling
                console.log('🖱️ Mousedown on suggestion:', city.name);
                this.addCityFromSearch(city);
            });
            
            // Keep click as backup for keyboard navigation
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Click on suggestion:', city.name);
                this.addCityFromSearch(city);
            });

            item.addEventListener('mouseenter', () => {
                this.currentSuggestionIndex = index;
                this.highlightSuggestion(index);
            });

            suggestionsBox.appendChild(item);
        });

        suggestionsBox.style.display = 'block';
    },

    // Highlight matching text
    highlightMatch: function(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="ica-highlight">$1</span>');
    },

    // Show trending cities
    showTrendingCities: function() {
        const suggestionsBox = document.getElementById('icaSuggestions');
        if (!suggestionsBox) return;

        suggestionsBox.innerHTML = '';

        // Show recent searches if available
        if (this.recentSearches.length > 0) {
            const recentHeader = document.createElement('div');
            recentHeader.className = 'ica-suggestion-header';
            recentHeader.innerHTML = '🕒 Recent Searches';
            suggestionsBox.appendChild(recentHeader);

            this.recentSearches.slice(0, 3).forEach(cityName => {
                const city = this.globalCitiesDatabase.find(c => c.name === cityName);
                if (city) {
                    this.addSuggestionItem(suggestionsBox, city);
                }
            });
        }

        // Show trending cities
        const trendingHeader = document.createElement('div');
        trendingHeader.className = 'ica-suggestion-header';
        trendingHeader.innerHTML = '🔥 Trending Cities';
        suggestionsBox.appendChild(trendingHeader);

        this.trendingCities.slice(0, 5).forEach(cityName => {
            const city = this.globalCitiesDatabase.find(c => c.name === cityName);
            if (city) {
                this.addSuggestionItem(suggestionsBox, city);
            }
        });

        suggestionsBox.style.display = 'block';
    },

    // Add suggestion item helper
    addSuggestionItem: function(container, city) {
        const item = document.createElement('div');
        item.className = 'ica-suggestion-item';
        item.innerHTML = `
            <div class="ica-suggestion-content">
                <div class="ica-suggestion-flag">${city.flag}</div>
                <div class="ica-suggestion-info">
                    <div class="ica-suggestion-name">${city.name}</div>
                    <div class="ica-suggestion-country">${city.country}</div>
                </div>
            </div>
        `;
        // Use mousedown instead of click to fire before blur event
        item.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent blur from firing
            e.stopPropagation(); // Stop event bubbling
            console.log('🖱️ Mousedown on trending city:', city.name);
            this.addCityFromSearch(city);
        });
        
        // Keep click as backup for keyboard navigation
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Click on trending city:', city.name);
            this.addCityFromSearch(city);
        });
        container.appendChild(item);
    },

    // Handle keyboard navigation
    handleKeyboardNavigation: function(e) {
        const suggestionsBox = document.getElementById('icaSuggestions');
        if (!suggestionsBox || suggestionsBox.style.display === 'none') return;

        const items = suggestionsBox.querySelectorAll('.ica-suggestion-item');
        if (items.length === 0) return;

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentSuggestionIndex = Math.min(this.currentSuggestionIndex + 1, items.length - 1);
                this.highlightSuggestion(this.currentSuggestionIndex);
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                this.currentSuggestionIndex = Math.max(this.currentSuggestionIndex - 1, 0);
                this.highlightSuggestion(this.currentSuggestionIndex);
                break;
            
            case 'Enter':
                e.preventDefault();
                if (this.currentSuggestionIndex >= 0 && this.currentSuggestionIndex < items.length) {
                    const cityName = items[this.currentSuggestionIndex].getAttribute('data-city');
                    const city = this.globalCitiesDatabase.find(c => c.name === cityName);
                    if (city) {
                        this.addCityFromSearch(city);
                    }
                }
                break;
            
            case 'Escape':
                e.preventDefault();
                suggestionsBox.style.display = 'none';
                document.getElementById('icaCitySearch').blur();
                break;
        }
    },

    // Highlight suggestion
    highlightSuggestion: function(index) {
        const items = document.querySelectorAll('.ica-suggestion-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('ica-suggestion-active');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('ica-suggestion-active');
            }
        });
    },
    // Add city from search input (text-based)
    addCityFromSearchInput: async function(query) {
        console.log('🔍 Adding city from input:', query);
        const searchInput = document.getElementById('icaCitySearch');
        const suggestionsBox = document.getElementById('icaSuggestions');

        // Search for the city in the database
        const city = this.globalCitiesDatabase.find(c => 
            c.name.toLowerCase() === query.toLowerCase()
        );

        if (city) {
            // City found in database, use existing function
            await this.addCityFromSearch(city);
        } else {
            // City not in database, try to add by name directly
            console.log('⚠️ City not in database, attempting direct add:', query);
            
            // Check if city already added
            if (this.selectedCities.includes(query)) {
                this.showToast('🔔 City already added', 'warning');
                if (searchInput) searchInput.value = '';
                if (suggestionsBox) suggestionsBox.style.display = 'none';
                return;
            }

            // Check maximum limit
            if (this.selectedCities.length >= 10) {
                this.showMaxLimitWarning();
                return;
            }

            // Add to recent searches
            this.addToRecentSearches(query);

            // Add city to selected cities
            this.selectedCities.push(query);

            // Fetch weather data
            this.showToast('🔄 Loading weather data...', 'info');
            const weatherData = await this.fetchWeatherData(query);
            
            if (weatherData) {
                this.weatherData[query] = weatherData;
                
                // Add city chip to UI (create minimal city object)
                const cityObj = {
                    name: query,
                    country: weatherData.sys?.country || 'Unknown',
                    flag: this.getCountryFlag(weatherData.sys?.country || ''),
                    temperature: weatherData.main?.temp || null
                };
                this.addCityChip(cityObj);
                
                // Update all analytics if we have at least 2 cities
                if (this.selectedCities.length >= 2) {
                    this.updateAllAnalytics();
                }
                
                this.showToast(`✅ ${query} added successfully!`, 'success');
            } else {
                // Remove from selected if fetch failed
                this.selectedCities = this.selectedCities.filter(c => c !== query);
                this.showToast(`❌ Failed to load data for ${query}. Please check the city name.`, 'error');
            }

            // Clear search
            if (searchInput) searchInput.value = '';
            if (suggestionsBox) suggestionsBox.style.display = 'none';
        }
    },


    // Add city from search
    addCityFromSearch: async function(city) {
        console.log('🏙️ Adding city:', city.name);
        const searchInput = document.getElementById('icaCitySearch');
        const suggestionsBox = document.getElementById('icaSuggestions');

        // Check if city already added
        if (this.selectedCities.includes(city.name)) {
            console.log('⚠️ City already added');
            this.showToast('🔔 City already added', 'warning');
            if (searchInput) searchInput.value = '';
            if (suggestionsBox) suggestionsBox.style.display = 'none';
            return;
        }

        // Check maximum limit (10 cities)
        if (this.selectedCities.length >= 10) {
            this.showMaxLimitWarning();
            return;
        }

        // Add to recent searches
        this.addToRecentSearches(city.name);

        // Add city to selected cities
        this.selectedCities.push(city.name);

        // Fetch weather data
        this.showToast('🔄 Loading weather data...', 'info');
        const weatherData = await this.fetchWeatherData(city.name);
        
        if (weatherData) {
            this.weatherData[city.name] = weatherData;
            
            // Add city chip to UI
            this.addCityChip(city);
            
            // Update all analytics if we have at least 2 cities
            if (this.selectedCities.length >= 2) {
                this.updateAllAnalytics();
            }
            
            this.showToast(`✅ ${city.name} added successfully!`, 'success');
        } else {
            // Remove from selected if fetch failed
            this.selectedCities = this.selectedCities.filter(c => c !== city.name);
            this.showToast(`❌ Failed to load data for ${city.name}`, 'error');
        }

        // Clear search
        if (searchInput) searchInput.value = '';
        if (suggestionsBox) suggestionsBox.style.display = 'none';
    },

    // Add city chip dynamically
    addCityChip: function(city) {
        const container = document.getElementById('icaCityChips');
        if (!container) return;

        const chip = document.createElement('div');
        chip.className = 'ica-city-chip selected ica-city-chip-dynamic';
        chip.setAttribute('data-city', city.name);
        chip.style.animation = 'chipSlideIn 0.4s ease-out';
        
        chip.innerHTML = `
            <div class="ica-city-chip-flag">${city.flag}</div>
            <div class="ica-city-chip-info">
                <div class="ica-city-chip-name">${city.name}</div>
                <div class="ica-city-chip-temp">${Math.round(this.weatherData[city.name].temperature)}°C</div>
            </div>
            <div class="ica-city-chip-remove" title="Remove city">×</div>
        `;
        
        // Add remove functionality
        const removeBtn = chip.querySelector('.ica-city-chip-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeCity(city.name, chip);
        });

        // Toggle functionality
        chip.addEventListener('click', () => {
            // Dynamic chips are always selected, but we can add visual feedback
            chip.style.transform = 'scale(0.95)';
            setTimeout(() => {
                chip.style.transform = '';
            }, 100);
        });

        container.appendChild(chip);
    },

    // Remove city
    removeCity: function(cityName, chipElement) {
        // Remove from selected cities
        this.selectedCities = this.selectedCities.filter(c => c !== cityName);
        
        // Remove weather data
        delete this.weatherData[cityName];
        
        // Animate and remove chip
        chipElement.style.animation = 'chipSlideOut 0.3s ease-out';
        setTimeout(() => {
            chipElement.remove();
        }, 300);
        
        // Update analytics if we still have at least 2 cities
        if (this.selectedCities.length >= 2) {
            this.updateAllAnalytics();
        } else if (this.selectedCities.length < 2) {
            // Hide all sections if less than 2 cities
            this.hideAllSections();
        }
        
        this.showToast(`🗑️ ${cityName} removed`, 'info');
    },

    // Update all analytics
    updateAllAnalytics: function() {
        this.generateContextEngine();
        this.generateVisualization();
        this.generateInsights();
        this.generateWorldMap();
        this.generateTimeline();
        this.generatePredictive();
        this.generateRecommendations();
        this.showAllSections();
    },

    // Hide all sections
    hideAllSections: function() {
        const sections = [
            'icaContextEngine',
            'icaVisualization',
            'icaInsights',
            'icaWorldMap',
            'icaTimeline',
            'icaPredictive',
            'icaRecommendations'
        ];

        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    },

    // Show max limit warning
    showMaxLimitWarning: function() {
        const warning = document.createElement('div');
        warning.className = 'ica-max-limit-warning';
        warning.innerHTML = `
            <div class="ica-warning-content">
                <div class="ica-warning-icon">⚠️</div>
                <div class="ica-warning-title">Maximum Limit Reached</div>
                <div class="ica-warning-text">You can compare up to 10 cities at once. Please remove a city to add a new one.</div>
                <button class="ica-warning-close" onclick="this.parentElement.parentElement.remove()">Got it</button>
            </div>
        `;
        document.body.appendChild(warning);

        setTimeout(() => {
            warning.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => warning.remove(), 300);
        }, 5000);
    },

    // Load recent searches from localStorage
    loadRecentSearches: function() {
        try {
            const stored = localStorage.getItem('icaRecentSearches');
            if (stored) {
                this.recentSearches = JSON.parse(stored);
            }
        } catch (error) {
            console.log('Failed to load recent searches');
        }
    },

    // Add to recent searches
    addToRecentSearches: function(cityName) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(c => c !== cityName);
        
        // Add to beginning
        this.recentSearches.unshift(cityName);
        
        // Keep only last 10
        this.recentSearches = this.recentSearches.slice(0, 10);
        
        // Save to localStorage
        try {
            localStorage.setItem('icaRecentSearches', JSON.stringify(this.recentSearches));
        } catch (error) {
            console.log('Failed to save recent searches');
        }
    },

    // Get country flag emoji from country code
    getCountryFlag: function(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🌍';
        
        // Convert country code to flag emoji
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    },

    // Enhanced toast notification
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `ica-toast ica-toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="ica-toast-icon">${icons[type] || icons.info}</div>
            <div class="ica-toast-message">${message}</div>
        `;
        
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('ica-toast-show'), 10);

        setTimeout(() => {
            toast.classList.remove('ica-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Show notification (legacy support)
    showNotification: function(message, type = 'info') {
        this.showToast(message, type);
    }
};

// Initialize ICA Studio when Multi-City page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for navigation to Multi-City page
    const observer = new MutationObserver(() => {
        const multiCityPage = document.getElementById('page-multi-city');
        if (multiCityPage && multiCityPage.classList.contains('active')) {
            ICAStudio.init();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
    });
});

// Make ICAStudio globally available
window.ICAStudio = ICAStudio;

// Made with Bob
