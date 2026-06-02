/**
 * AI Weather Advisor - Enhanced Professional Dashboard
 * With Severity Color Coding and Category-Based Recommendations
 * Based on Weather Intelligence Documentation
 */

// Category Configuration with Icons and Priorities
const RECOMMENDATION_CATEGORIES = {
    AQI: {
        icon: '🌫️',
        title: 'Air Quality Intelligence',
        priority: 1,
        keywords: ['aqi', 'air quality', 'pollution', 'pm2.5', 'pm10', 'ozone', 'pollutant']
    },
    HEALTH: {
        icon: '🏥',
        title: 'Health Alerts & Precautions',
        priority: 2,
        keywords: ['health', 'medical', 'respiratory', 'asthma', 'heart', 'elderly', 'children', 'sensitive']
    },
    OUTDOOR: {
        icon: '🏃',
        title: 'Outdoor Activity Suggestions',
        priority: 3,
        keywords: ['activity', 'outdoor', 'exercise', 'running', 'cycling', 'hiking', 'sports', 'recreation']
    },
    RAIN: {
        icon: '🌧️',
        title: 'Rain Alerts & Forecasts',
        priority: 4,
        keywords: ['rain', 'precipitation', 'shower', 'drizzle', 'storm', 'flooding', 'umbrella']
    },
    TRAVEL: {
        icon: '🚗',
        title: 'Travel Recommendations',
        priority: 5,
        keywords: ['travel', 'driving', 'commute', 'road', 'traffic', 'visibility', 'journey']
    },
    WEATHER_RISK: {
        icon: '⚠️',
        title: 'Weather Risk Analysis',
        priority: 6,
        keywords: ['risk', 'warning', 'alert', 'danger', 'hazard', 'extreme', 'severe']
    },
    UV: {
        icon: '☀️',
        title: 'UV Index & Sun Protection',
        priority: 7,
        keywords: ['uv', 'sun', 'sunscreen', 'protection', 'exposure', 'radiation']
    },
    WIND: {
        icon: '💨',
        title: 'Wind Conditions',
        priority: 8,
        keywords: ['wind', 'gust', 'breeze', 'storm', 'cyclone']
    },
    TEMPERATURE: {
        icon: '🌡️',
        title: 'Temperature Advisory',
        priority: 9,
        keywords: ['temperature', 'heat', 'cold', 'hot', 'warm', 'cool', 'freezing']
    }
};

/**
 * Determine severity level based on weather parameters
 */
function determineSeverity(weatherData, category) {
    if (!weatherData) return 'moderate';
    
    const aqi = weatherData.aqi || 50;
    const temp = weatherData.main?.temp || weatherData.temperature || 25;
    const uvIndex = weatherData.uvIndex || 5;
    const rain = weatherData.rain?.['1h'] || 0;
    
    switch (category) {
        case 'AQI':
            if (aqi <= 50) return 'good';
            if (aqi <= 100) return 'moderate';
            if (aqi <= 150) return 'unhealthy-sensitive';
            if (aqi <= 200) return 'unhealthy';
            if (aqi <= 300) return 'very-unhealthy';
            return 'hazardous';
            
        case 'TEMPERATURE':
            if (temp >= 10 && temp <= 30) return 'comfortable';
            if ((temp >= 5 && temp < 10) || (temp > 30 && temp <= 35)) return 'warm';
            if ((temp >= 0 && temp < 5) || (temp > 35 && temp <= 40)) return 'hot';
            return 'extreme';
            
        case 'UV':
            if (uvIndex <= 2) return 'low';
            if (uvIndex <= 5) return 'moderate';
            if (uvIndex <= 7) return 'high';
            return 'very-high';
            
        case 'RAIN':
            if (rain < 2.5) return 'low';
            if (rain < 10) return 'moderate';
            if (rain < 50) return 'high';
            return 'severe';
            
        case 'TRAVEL':
            // Combine multiple factors
            if (aqi > 150 || rain > 10 || temp > 40 || temp < 0) return 'dangerous';
            if (aqi > 100 || rain > 2.5 || temp > 35 || temp < 5) return 'not-recommended';
            if (aqi > 50 || rain > 0) return 'caution';
            return 'safe';
            
        default:
            return 'moderate';
    }
}

/**
 * Get severity badge HTML
 */
function getSeverityBadge(severity) {
    const badges = {
        'good': '<span class="severity-badge good">Good</span>',
        'moderate': '<span class="severity-badge moderate">Moderate</span>',
        'unhealthy-sensitive': '<span class="severity-badge unhealthy">Unhealthy for Sensitive</span>',
        'unhealthy': '<span class="severity-badge unhealthy">Unhealthy</span>',
        'very-unhealthy': '<span class="severity-badge dangerous">Very Unhealthy</span>',
        'hazardous': '<span class="severity-badge hazardous">Hazardous</span>',
        'comfortable': '<span class="severity-badge good">Comfortable</span>',
        'warm': '<span class="severity-badge moderate">Warm</span>',
        'hot': '<span class="severity-badge unhealthy">Hot</span>',
        'extreme': '<span class="severity-badge dangerous">Extreme</span>',
        'low': '<span class="severity-badge good">Low</span>',
        'high': '<span class="severity-badge unhealthy">High</span>',
        'very-high': '<span class="severity-badge dangerous">Very High</span>',
        'severe': '<span class="severity-badge dangerous">Severe</span>',
        'safe': '<span class="severity-badge good">Safe</span>',
        'caution': '<span class="severity-badge moderate">Caution</span>',
        'not-recommended': '<span class="severity-badge unhealthy">Not Recommended</span>',
        'dangerous': '<span class="severity-badge dangerous">Dangerous</span>'
    };
    
    return badges[severity] || badges['moderate'];
}

/**
 * Get severity CSS class
 */
function getSeverityClass(category, severity) {
    const prefix = category.toLowerCase();
    return `severity-${prefix}-${severity}`;
}

/**
 * Categorize recommendation based on content
 */
function categorizeRecommendation(text) {
    const lowerText = text.toLowerCase();
    
    for (const [key, config] of Object.entries(RECOMMENDATION_CATEGORIES)) {
        if (config.keywords.some(keyword => lowerText.includes(keyword))) {
            return key;
        }
    }
    
    return 'WEATHER_RISK'; // Default category
}

/**
 * Parse and organize MCP recommendations into categories
 */
function organizeRecommendations(mcpData, weatherData) {
    const organized = {};
    
    // Initialize categories
    Object.keys(RECOMMENDATION_CATEGORIES).forEach(key => {
        organized[key] = [];
    });
    
    // Extract recommendations from MCP response
    let recommendations = [];
    
    if (mcpData && mcpData.data) {
        const result = mcpData.data;
        
        // Handle different MCP response structures
        if (result.recommendations) {
            recommendations = Array.isArray(result.recommendations)
                ? result.recommendations
                : [result.recommendations];
        }
        
        if (result.contexts || result.results) {
            const contexts = result.contexts || result.results || [];
            contexts.forEach(context => {
                if (context.content || context.text) {
                    recommendations.push(context.content || context.text);
                }
            });
        }
        
        // If we have a simple text response
        if (typeof result === 'string') {
            recommendations.push(result);
        }
    }
    
    // Categorize each recommendation
    recommendations.forEach(rec => {
        if (typeof rec === 'string' && rec.trim()) {
            const category = categorizeRecommendation(rec);
            organized[category].push({
                text: rec.trim(),
                severity: determineSeverity(weatherData, category),
                timestamp: new Date()
            });
        }
    });
    
    // Remove duplicates within each category
    Object.keys(organized).forEach(category => {
        const seen = new Set();
        organized[category] = organized[category].filter(item => {
            const key = item.text.substring(0, 50); // Use first 50 chars as key
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    });
    
    return organized;
}

/**
 * Render recommendations dashboard
 */
function renderRecommendationsDashboard(organizedRecs, weatherData) {
    const container = document.getElementById('aiRecommendationsContainer');
    if (!container) {
        console.error('Recommendations container not found');
        return;
    }
    
    // Check if we have any recommendations
    const hasRecommendations = Object.values(organizedRecs).some(arr => arr.length > 0);
    
    if (!hasRecommendations) {
        container.innerHTML = `
            <div class="recommendations-empty">
                <div class="recommendations-empty-icon">🤖</div>
                <div class="recommendations-empty-title">AI Weather Advisor Ready</div>
                <div class="recommendations-empty-text">
                    Waiting for weather data to generate intelligent recommendations.<br>
                    MCP Context Studio will provide personalized insights based on current conditions.
                </div>
            </div>
        `;
        return;
    }
    
    let html = '<div class="recommendations-container">';
    
    // Sort categories by priority and render
    const sortedCategories = Object.entries(RECOMMENDATION_CATEGORIES)
        .sort((a, b) => a[1].priority - b[1].priority);
    
    sortedCategories.forEach(([key, config]) => {
        const items = organizedRecs[key];
        if (items && items.length > 0) {
            const severity = items[0].severity;
            const severityClass = getSeverityClass(key, severity);
            
            html += `
                <div class="recommendation-category ${severityClass}">
                    <div class="category-header">
                        <div class="category-icon">${config.icon}</div>
                        <div class="category-title">${config.title}</div>
                        ${getSeverityBadge(severity)}
                    </div>
                    <div class="category-items">
            `;
            
            items.forEach((item, index) => {
                const priority = index === 0 ? 'high' : (index === 1 ? 'medium' : 'low');
                html += `
                    <div class="recommendation-item">
                        <div class="recommendation-content">
                            <div class="recommendation-icon">${config.icon}</div>
                            <div class="recommendation-text">${item.text}</div>
                        </div>
                        <div class="recommendation-meta">
                            <span class="recommendation-priority priority-${priority}">${priority}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Show loading state
 */
function showLoadingState() {
    const container = document.getElementById('aiRecommendationsContainer');
    if (container) {
        container.innerHTML = `
            <div class="recommendations-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">Fetching AI recommendations from Context Studio...</div>
            </div>
        `;
    }
}

/**
 * Update AI Advisor with enhanced dashboard
 */
function updateEnhancedAIAdvisor(mcpData, weatherData) {
    console.log('🎨 Rendering enhanced AI Weather Advisor dashboard...');
    
    try {
        // Organize recommendations by category
        const organized = organizeRecommendations(mcpData, weatherData);
        
        // Render the dashboard
        renderRecommendationsDashboard(organized, weatherData);
        
        console.log('✅ Enhanced dashboard rendered successfully');
        console.log('📊 Categories with recommendations:', 
            Object.entries(organized)
                .filter(([_, items]) => items.length > 0)
                .map(([cat, items]) => `${cat}(${items.length})`)
                .join(', ')
        );
        
    } catch (error) {
        console.error('❌ Error rendering enhanced dashboard:', error);
        showErrorState();
    }
}

/**
 * Show error state
 */
function showErrorState() {
    const container = document.getElementById('aiRecommendationsContainer');
    if (container) {
        container.innerHTML = `
            <div class="recommendations-empty">
                <div class="recommendations-empty-icon">⚠️</div>
                <div class="recommendations-empty-title">Unable to Load Recommendations</div>
                <div class="recommendations-empty-text">
                    There was an error loading AI recommendations.<br>
                    Please try refreshing the page or check back later.
                </div>
            </div>
        `;
    }
}

// Export functions for use in main AI advisor script
window.AIAdvisorEnhanced = {
    updateEnhancedAIAdvisor,
    showLoadingState,
    organizeRecommendations,
    determineSeverity,
    RECOMMENDATION_CATEGORIES
};

console.log('✅ AI Weather Advisor Enhanced module loaded');

// Made with Bob
