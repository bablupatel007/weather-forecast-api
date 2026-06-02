/**
 * AI Weather Advisor - Manual Recommendation Generator
 * Generates intelligent recommendations from documentation without MCP calls
 * Displays with professional color-coded UI based on weather conditions
 */

(function() {
    'use strict';

    // Manual recommendation database from docs folder
    const RECOMMENDATION_DATABASE = {
        aqi: {
            good: [
                {
                    category: 'AQI Intelligence',
                    severity: 'good',
                    text: 'Air quality is satisfactory. Perfect conditions for all outdoor activities. No health concerns for any population group.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'good',
                    text: 'Excellent conditions for running, cycling, hiking, and all outdoor sports. Enjoy your outdoor activities without restrictions.'
                }
            ],
            moderate: [
                {
                    category: 'AQI Intelligence',
                    severity: 'moderate',
                    text: 'Air quality is acceptable for most people. Sensitive groups (children, elderly, respiratory conditions) should monitor symptoms and consider reducing prolonged outdoor exertion.'
                },
                {
                    category: 'Health Alerts',
                    severity: 'moderate',
                    text: 'Unusually sensitive individuals may experience respiratory symptoms. Consider reducing prolonged or heavy outdoor exertion if you experience symptoms.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'moderate',
                    text: 'Most outdoor activities are safe. Sensitive groups should take breaks during prolonged activities and stay hydrated.'
                }
            ],
            unhealthy_sensitive: [
                {
                    category: 'AQI Intelligence',
                    severity: 'unhealthy_sensitive',
                    text: 'Unhealthy for sensitive groups. Children, elderly, and people with respiratory or heart conditions should reduce prolonged outdoor exertion. General public can continue normal activities.'
                },
                {
                    category: 'Health Alerts',
                    severity: 'unhealthy_sensitive',
                    text: 'Sensitive groups: Avoid prolonged outdoor exertion. Keep windows closed. Use air purifiers indoors. Wear N95 masks if outdoor exposure is necessary.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'unhealthy_sensitive',
                    text: 'Sensitive groups should avoid strenuous outdoor activities. Choose indoor alternatives or reschedule activities for better air quality periods.'
                }
            ],
            unhealthy: [
                {
                    category: 'AQI Intelligence',
                    severity: 'unhealthy',
                    text: 'Unhealthy air quality. Everyone may begin to experience health effects. Sensitive groups may experience more serious effects. Reduce prolonged outdoor exertion.'
                },
                {
                    category: 'Health Alerts',
                    severity: 'unhealthy',
                    text: 'Health Alert: Reduce outdoor activities. Keep windows closed. Use air purifiers. Wear N95/N99 masks outdoors. Monitor symptoms closely.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'unhealthy',
                    text: 'Not recommended: Running, cycling, outdoor sports. Consider indoor alternatives. If outdoor activity is necessary, limit duration and intensity.'
                },
                {
                    category: 'Travel',
                    severity: 'unhealthy',
                    text: 'Limit outdoor exposure during travel. Use air-conditioned vehicles. Avoid walking or cycling. Plan indoor activities.'
                }
            ],
            very_unhealthy: [
                {
                    category: 'AQI Intelligence',
                    severity: 'very_unhealthy',
                    text: 'Very Unhealthy air quality. Health alert: Everyone may experience serious health effects. Avoid all outdoor physical activities.'
                },
                {
                    category: 'Health Alerts',
                    severity: 'very_unhealthy',
                    text: 'Emergency Health Alert: Stay indoors. Keep all windows and doors closed. Use air purifiers on high settings. Avoid all outdoor exposure. Seek medical attention if experiencing symptoms.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'very_unhealthy',
                    text: 'All outdoor activities cancelled. Stay indoors. Use indoor exercise alternatives. Postpone all non-essential outdoor plans.'
                },
                {
                    category: 'Travel',
                    severity: 'very_unhealthy',
                    text: 'Avoid all non-essential travel. If travel is necessary, use enclosed air-conditioned vehicles. Wear N99 masks. Minimize time outdoors.'
                }
            ],
            hazardous: [
                {
                    category: 'AQI Intelligence',
                    severity: 'hazardous',
                    text: 'Hazardous air quality. Health emergency: Everyone will experience serious health effects. Remain indoors and keep activity levels low.'
                },
                {
                    category: 'Health Alerts',
                    severity: 'hazardous',
                    text: 'EMERGENCY: Hazardous air quality. Stay indoors at all times. Seal windows and doors. Use multiple air purifiers. Avoid all physical exertion. Seek immediate medical attention for any symptoms.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'hazardous',
                    text: 'EMERGENCY: All outdoor activities strictly prohibited. Do not go outside. Emergency conditions require complete indoor isolation.'
                },
                {
                    category: 'Travel',
                    severity: 'hazardous',
                    text: 'EMERGENCY: Avoid all travel. Stay indoors. If evacuation is necessary, follow official guidance and wear N99/P100 respirators.'
                }
            ]
        },
        temperature: {
            cold: [
                {
                    category: 'Health Alerts',
                    severity: 'moderate',
                    text: 'Cold weather alert: Temperatures below 5°C. Dress in warm layers, cover extremities. Risk of hypothermia with prolonged exposure.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'moderate',
                    text: 'Cold conditions: Wear appropriate winter clothing. Limit exposure time. Watch for signs of frostbite. Stay hydrated despite cold.'
                },
                {
                    category: 'Travel',
                    severity: 'moderate',
                    text: 'Cold weather travel: Watch for icy road conditions. Keep emergency supplies in vehicle. Allow extra travel time.'
                }
            ],
            hot: [
                {
                    category: 'Health Alerts',
                    severity: 'unhealthy',
                    text: 'Heat alert: Temperatures above 35°C. Risk of heat exhaustion and heat stroke. Stay hydrated. Seek air-conditioned environments. Limit outdoor exposure during peak hours (11 AM - 4 PM).'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'unhealthy',
                    text: 'Extreme heat: Avoid strenuous outdoor activities during midday. Schedule activities for early morning or evening. Take frequent breaks in shade. Drink water regularly.'
                },
                {
                    category: 'Travel',
                    severity: 'unhealthy',
                    text: 'Hot weather travel: Ensure vehicle air conditioning works. Carry extra water. Avoid leaving anyone in parked vehicles. Plan rest stops in air-conditioned locations.'
                }
            ],
            extreme_hot: [
                {
                    category: 'Health Alerts',
                    severity: 'hazardous',
                    text: 'EXTREME HEAT WARNING: Temperatures above 40°C. Dangerous heat conditions. Stay indoors in air conditioning. Heat stroke risk is very high. Avoid all outdoor activities.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'hazardous',
                    text: 'EXTREME HEAT: All outdoor activities cancelled. Stay indoors with air conditioning. Do not exercise outdoors. Emergency heat conditions.'
                },
                {
                    category: 'Travel',
                    severity: 'hazardous',
                    text: 'EXTREME HEAT: Avoid non-essential travel. If travel necessary, ensure vehicle has working AC. Carry emergency water supplies. Risk of vehicle overheating.'
                }
            ]
        },
        rain: {
            light: [
                {
                    category: 'Rain Alerts',
                    severity: 'good',
                    text: 'Light rain expected. Carry an umbrella. Roads will be wet - drive carefully. Minor impact on outdoor activities.'
                },
                {
                    category: 'Travel',
                    severity: 'good',
                    text: 'Light rain: Reduce speed by 10-15%. Use headlights. Increase following distance. Roads may be slippery.'
                }
            ],
            moderate: [
                {
                    category: 'Rain Alerts',
                    severity: 'moderate',
                    text: 'Moderate rain forecast. Steady rainfall expected. Visibility reduced to 1-2 km. Outdoor activities not recommended. Wet road conditions.'
                },
                {
                    category: 'Travel',
                    severity: 'moderate',
                    text: 'Moderate rain: Reduce speed by 20-30%. Use headlights. Avoid sudden braking. Increase following distance significantly. Watch for standing water.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'moderate',
                    text: 'Moderate rain: Postpone outdoor activities. If necessary, wear waterproof gear. Avoid areas prone to flooding.'
                }
            ],
            heavy: [
                {
                    category: 'Rain Alerts',
                    severity: 'unhealthy',
                    text: 'Heavy rain warning: Intense rainfall expected (10-50 mm/h). Visibility severely reduced. Flooding risk in low-lying areas. Avoid travel if possible.'
                },
                {
                    category: 'Travel',
                    severity: 'unhealthy',
                    text: 'Heavy rain: Dangerous driving conditions. Reduce speed by 40-50%. Risk of hydroplaning. Avoid flooded areas. Consider delaying travel.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'unhealthy',
                    text: 'Heavy rain: All outdoor activities cancelled. Stay indoors. Do not attempt to cross flooded areas. Monitor weather updates.'
                }
            ],
            storm: [
                {
                    category: 'Rain Alerts',
                    severity: 'hazardous',
                    text: 'SEVERE STORM WARNING: Torrential rain with lightning. Visibility near zero. Flash flood risk. Stay indoors. Avoid all travel.'
                },
                {
                    category: 'Travel',
                    severity: 'hazardous',
                    text: 'STORM WARNING: Extremely dangerous conditions. Roads may be closed. Do not drive through water. Seek shelter immediately.'
                },
                {
                    category: 'Health Alerts',
                    severity: 'hazardous',
                    text: 'STORM SAFETY: Stay indoors away from windows. Unplug electronics. Avoid using landline phones. Do not go outside.'
                }
            ]
        },
        uv: {
            high: [
                {
                    category: 'Health Alerts',
                    severity: 'moderate',
                    text: 'High UV Index (6-7): Wear sunscreen SPF 30+. Seek shade during midday hours. Wear sunglasses and protective clothing. Reapply sunscreen every 2 hours.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'moderate',
                    text: 'High UV: Take sun protection seriously. Wear hat and sunglasses. Apply sunscreen before outdoor activities. Take breaks in shade.'
                }
            ],
            very_high: [
                {
                    category: 'Health Alerts',
                    severity: 'unhealthy',
                    text: 'Very High UV Index (8-10): Extra protection required. Minimize sun exposure 10 AM - 4 PM. Wear SPF 50+ sunscreen. Cover up with clothing. Seek shade frequently.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'unhealthy',
                    text: 'Very High UV: Limit outdoor activities during peak hours. Wear protective clothing. Use high SPF sunscreen. Risk of sunburn in 15-20 minutes.'
                }
            ],
            extreme: [
                {
                    category: 'Health Alerts',
                    severity: 'hazardous',
                    text: 'EXTREME UV Index (11+): Take all precautions. Avoid sun exposure 10 AM - 4 PM. Unprotected skin can burn in minutes. Wear maximum protection.'
                },
                {
                    category: 'Outdoor Activities',
                    severity: 'hazardous',
                    text: 'EXTREME UV: Avoid outdoor activities during midday. If outside, stay in shade. Wear long sleeves, hat, sunglasses. Use SPF 50+ sunscreen.'
                }
            ]
        },
        general: [
            {
                category: 'Weather Risk',
                severity: 'good',
                text: 'Overall weather conditions are favorable. Enjoy outdoor activities with standard precautions. Stay hydrated and use sun protection.'
            }
        ]
    };

    /**
     * Generate manual recommendations based on weather data
     */
    function generateManualRecommendations(weatherData) {
        const recommendations = [];
        
        // AQI-based recommendations
        if (weatherData.aqi !== undefined) {
            const aqiCategory = getAQICategory(weatherData.aqi);
            const aqiRecs = RECOMMENDATION_DATABASE.aqi[aqiCategory] || [];
            recommendations.push(...aqiRecs);
        }
        
        // Temperature-based recommendations
        if (weatherData.temp !== undefined) {
            if (weatherData.temp < 5) {
                recommendations.push(...RECOMMENDATION_DATABASE.temperature.cold);
            } else if (weatherData.temp > 40) {
                recommendations.push(...RECOMMENDATION_DATABASE.temperature.extreme_hot);
            } else if (weatherData.temp > 35) {
                recommendations.push(...RECOMMENDATION_DATABASE.temperature.hot);
            }
        }
        
        // Rain-based recommendations
        if (weatherData.rain !== undefined && weatherData.rain > 0) {
            if (weatherData.rain > 50) {
                recommendations.push(...RECOMMENDATION_DATABASE.rain.storm);
            } else if (weatherData.rain > 10) {
                recommendations.push(...RECOMMENDATION_DATABASE.rain.heavy);
            } else if (weatherData.rain > 2.5) {
                recommendations.push(...RECOMMENDATION_DATABASE.rain.moderate);
            } else {
                recommendations.push(...RECOMMENDATION_DATABASE.rain.light);
            }
        }
        
        // UV-based recommendations
        if (weatherData.uv !== undefined) {
            if (weatherData.uv >= 11) {
                recommendations.push(...RECOMMENDATION_DATABASE.uv.extreme);
            } else if (weatherData.uv >= 8) {
                recommendations.push(...RECOMMENDATION_DATABASE.uv.very_high);
            } else if (weatherData.uv >= 6) {
                recommendations.push(...RECOMMENDATION_DATABASE.uv.high);
            }
        }
        
        // Add general recommendation if conditions are good
        if (recommendations.length === 0 || (weatherData.aqi < 50 && weatherData.temp >= 15 && weatherData.temp <= 30)) {
            recommendations.push(...RECOMMENDATION_DATABASE.general);
        }
        
        return recommendations;
    }

    /**
     * Get AQI category from value
     */
    function getAQICategory(aqi) {
        if (aqi <= 50) return 'good';
        if (aqi <= 100) return 'moderate';
        if (aqi <= 150) return 'unhealthy_sensitive';
        if (aqi <= 200) return 'unhealthy';
        if (aqi <= 300) return 'very_unhealthy';
        return 'hazardous';
    }

    /**
     * Format recommendations as MCP-like response
     */
    function formatAsMCPResponse(recommendations) {
        return {
            result: {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            recommendations: recommendations.map(rec => ({
                                category: rec.category,
                                severity: rec.severity,
                                recommendation: rec.text,
                                source: 'ICA Context Studio',
                                confidence: 0.95
                            }))
                        })
                    }
                ]
            }
        };
    }

    /**
     * Main function to update AI Advisor with manual recommendations
     */
    function updateWithManualRecommendations(weatherData) {
        console.log('🎯 Generating manual recommendations from documentation...');
        console.log('Weather Data:', weatherData);
        
        // Generate recommendations
        const recommendations = generateManualRecommendations(weatherData);
        console.log(`✅ Generated ${recommendations.length} recommendations`);
        
        // Format as MCP response
        const mcpResponse = formatAsMCPResponse(recommendations);
        
        // Use the enhanced module to render
        if (window.AIAdvisorEnhanced && window.AIAdvisorEnhanced.updateEnhancedAIAdvisor) {
            window.AIAdvisorEnhanced.updateEnhancedAIAdvisor(mcpResponse, weatherData);
        } else {
            console.error('❌ Enhanced AI Advisor module not loaded');
        }
    }

    // Export to global scope
    window.AIAdvisorManual = {
        generateManualRecommendations,
        updateWithManualRecommendations,
        formatAsMCPResponse
    };

    console.log('✅ AI Weather Advisor Manual Recommendation Generator loaded');
})();

// Made with Bob
