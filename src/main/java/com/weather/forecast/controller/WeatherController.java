package com.weather.forecast.controller;

import com.weather.forecast.model.ForecastResponse;
import com.weather.forecast.model.WeatherResponse;
import com.weather.forecast.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


/**
 * REST Controller that handles HTTP requests for weather data.
 * This controller exposes endpoints for clients to fetch weather information.
 * 
 * @RestController - Combines @Controller and @ResponseBody
 *                   Automatically converts return values to JSON
 * @RequestMapping - Base path for all endpoints in this controller
 * 
 * @author Weather Forecast Team
 */
@RestController
@RequestMapping("/weather")
public class WeatherController {
    
    // Logger for logging information and errors
    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    
    // Service layer dependency - handles business logic
    private final WeatherService weatherService;
    
    /**
     * Constructor-based dependency injection
     * Spring automatically injects WeatherService instance
     * 
     * @param weatherService - Service that handles weather operations
     */
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }
    
    /**
     * GET endpoint to fetch weather data for a specific city
     * 
     * Endpoint: GET /weather/{city}
     * Example: GET http://localhost:8080/weather/London
     * 
     * @GetMapping - Maps HTTP GET requests to this method
     * @PathVariable - Extracts {city} from URL path
     * 
     * @param city - Name of the city (extracted from URL path)
     * @return ResponseEntity<WeatherResponse> - HTTP response with weather data
     */
    @GetMapping("/{city}")
    public ResponseEntity<WeatherResponse> getWeather(@PathVariable String city) {
        logger.info("Received request to fetch weather for city: {}", city);
        
        try {
            // Validate city parameter
            if (city == null || city.trim().isEmpty()) {
                logger.warn("Empty or null city name provided");
                return ResponseEntity
                        .badRequest()
                        .build();
            }
            
            // Call service layer to fetch weather data
            WeatherResponse weatherResponse = weatherService.getWeatherByCity(city.trim());
            
            logger.info("Successfully retrieved weather data for city: {}", city);
            
            // Return successful response with weather data
            return ResponseEntity
                    .ok()
                    .body(weatherResponse);
            
        } catch (RuntimeException e) {
            // Log the error
            logger.error("Error fetching weather for city: {}", city, e);
            
            // Return error response
            // In production, you might want to return a custom error response object
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
    
    /**
     * GET endpoint to fetch 7-day weather forecast for a specific city
     * 
     * Endpoint: GET /weather/forecast/{city}
     * Example: GET http://localhost:8080/weather/forecast/London
     * 
     * @param city - Name of the city (extracted from URL path)
     * @return ResponseEntity<ForecastResponse> - HTTP response with 7-day forecast data
     */
    @GetMapping("/forecast/{city}")
    public ResponseEntity<ForecastResponse> get7DayForecast(@PathVariable String city) {
        logger.info("Received request to fetch 7-day forecast for city: {}", city);
        
        try {
            // Validate city parameter
            if (city == null || city.trim().isEmpty()) {
                logger.warn("Empty or null city name provided");
                return ResponseEntity
                        .badRequest()
                        .build();
            }
            
            // Call service layer to fetch forecast data
            ForecastResponse forecastResponse = weatherService.get7DayForecast(city.trim());
            
            logger.info("Successfully retrieved 7-day forecast for city: {}", city);
            
            // Return successful response with forecast data
            return ResponseEntity
                    .ok()
                    .body(forecastResponse);
            
        } catch (RuntimeException e) {
            // Log the error
            logger.error("Error fetching 7-day forecast for city: {}", city, e);
            
            // Return error response
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
    
    /**
     * GET endpoint to fetch 24-hour hourly weather forecast for a specific city
     *
     * Endpoint: GET /weather/hourly/{city}
     * Example: GET http://localhost:8080/weather/hourly/London
     *
     * @param city - Name of the city (extracted from URL path)
     * @return ResponseEntity<HourlyForecastResponse> - HTTP response with 24-hour hourly forecast data
     */
    @GetMapping("/hourly/{city}")
    public ResponseEntity<?> get24HourForecast(@PathVariable String city) {
        logger.info("Received request to fetch 24-hour hourly forecast for city: {}", city);
        
        try {
            // Validate city parameter
            if (city == null || city.trim().isEmpty()) {
                logger.warn("Empty or null city name provided");
                return ResponseEntity
                        .badRequest()
                        .build();
            }
            
            // Call service layer to fetch hourly forecast data
            var hourlyForecastResponse = weatherService.get24HourForecast(city.trim());
            
            logger.info("Successfully retrieved 24-hour hourly forecast for city: {}", city);
            
            // Return successful response with hourly forecast data
            return ResponseEntity
                    .ok()
                    .body(hourlyForecastResponse);
            
        } catch (RuntimeException e) {
            // Log the error
            logger.error("Error fetching 24-hour hourly forecast for city: {}", city, e);
            
            // Return error response
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
    
    /**
     * GET endpoint to check if the API is running
     * 
     * Endpoint: GET /weather/health
     * Example: GET http://localhost:8080/weather/health
     * 
     * @return ResponseEntity<String> - Simple health check response
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        logger.info("Health check endpoint called");
        return ResponseEntity
                .ok()
                .body("Weather Forecast API is running successfully!");
    }
    
    /**
     * GET endpoint to get API information
     * 
     * Endpoint: GET /weather/info
     * Example: GET http://localhost:8080/weather/info
     * 
     * @return ResponseEntity<String> - API usage information
     */
    @GetMapping("/info")
    public ResponseEntity<String> getApiInfo() {
        logger.info("API info endpoint called");
        
        String info = """
                {
                    "name": "Weather Forecast API",
                    "version": "1.0.0",
                    "description": "REST API to fetch live weather data from OpenWeatherMap",
                    "endpoints": {
                        "getWeather": "GET /weather/{city}",
                        "health": "GET /weather/health",
                        "info": "GET /weather/info"
                    },
                    "example": "GET http://localhost:8080/weather/London"
                }
                """;
        
        return ResponseEntity
                .ok()
                .body(info);
    }

    @PostMapping("/mcp/tools-list")
    public ResponseEntity<?> getMcpToolsList() {
        logger.info("Received request to fetch MCP tools/list");

        try {
            Map<String, Object> response = weatherService.fetchMcpToolsList();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error fetching MCP tools/list", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        }
    }

    /**
     * POST endpoint to get AI-powered weather recommendations from MCP Context Studio
     *
     * Endpoint: POST /weather/mcp/recommendations
     * Request Body: {
     *   "contextId": "ctx_fc39071914of",
     *   "agentPersona": "WeatherAdvisor",
     *   "city": "Bengaluru",
     *   "temperature": 25.5,
     *   "humidity": 65,
     *   "aqi": 85,
     *   "uvIndex": 7.5,
     *   "weatherCondition": "partly cloudy"
     * }
     *
     * @param requestBody - Map containing weather context and MCP parameters
     * @return ResponseEntity with MCP recommendations or error
     */
    @PostMapping("/mcp/recommendations")
    public ResponseEntity<?> getMcpWeatherRecommendations(@RequestBody Map<String, Object> requestBody) {
        logger.info("Received request for MCP weather recommendations");

        try {
            // Extract parameters from request body
            String contextId = (String) requestBody.getOrDefault("contextId", "ctx_fc39071914of");
            String agentPersona = (String) requestBody.getOrDefault("agentPersona", "WeatherAdvisor");
            String city = (String) requestBody.get("city");
            
            // Validate required parameters
            if (city == null || city.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "status", "error",
                                "message", "City parameter is required"
                        ));
            }
            
            // Extract weather parameters with defaults
            Double temperature = getDoubleValue(requestBody.get("temperature"), 25.0);
            Integer humidity = getIntegerValue(requestBody.get("humidity"), 50);
            Integer aqi = getIntegerValue(requestBody.get("aqi"), 50);
            Double uvIndex = getDoubleValue(requestBody.get("uvIndex"), 5.0);
            String weatherCondition = (String) requestBody.getOrDefault("weatherCondition", "clear");
            
            // Call MCP service
            Map<String, Object> response = weatherService.fetchMcpWeatherRecommendations(
                    contextId, agentPersona, city, temperature, humidity, aqi, uvIndex, weatherCondition
            );
            
            logger.info("Successfully retrieved MCP recommendations for city: {}", city);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            logger.error("Error fetching MCP weather recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage(),
                            "fallback", generateFallbackRecommendations(requestBody)
                    ));
        }
    }
    
    /**
     * POST endpoint to test MCP retrieval with direct queries
     *
     * Endpoint: POST /weather/mcp/diagnostic-test
     *
     * Tests multiple queries to verify retrieval layer access:
     * - AQI
     * - Health
     * - Weather
     *
     * Returns detailed results including chunk IDs, scores, and content
     *
     * @return ResponseEntity with diagnostic test results
     */
    @PostMapping("/mcp/diagnostic-test")
    public ResponseEntity<?> runMcpDiagnosticTest() {
        logger.info("Running MCP diagnostic test");
        
        try {
            Map<String, Object> diagnosticResults = weatherService.runMcpDiagnosticTest();
            logger.info("MCP diagnostic test completed successfully");
            return ResponseEntity.ok(diagnosticResults);
            
        } catch (Exception e) {
            logger.error("Error running MCP diagnostic test", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        }
    }
    
    /**
     * Helper method to safely extract Double value from Object
     */
    private Double getDoubleValue(Object value, Double defaultValue) {
        if (value == null) return defaultValue;
        if (value instanceof Number) return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    /**
     * Helper method to safely extract Integer value from Object
     */
    private Integer getIntegerValue(Object value, Integer defaultValue) {
        if (value == null) return defaultValue;
        if (value instanceof Number) return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    /**
     * Generate fallback recommendations when MCP is unavailable
     */
    private Map<String, Object> generateFallbackRecommendations(Map<String, Object> requestBody) {
        Double temperature = getDoubleValue(requestBody.get("temperature"), 25.0);
        Integer aqi = getIntegerValue(requestBody.get("aqi"), 50);
        
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("source", "fallback");
        fallback.put("message", "Using basic recommendations (MCP unavailable)");
        
        List<String> recommendations = new ArrayList<>();
        
        // Temperature-based recommendations
        if (temperature > 30) {
            recommendations.add("🌡️ High temperature - Stay hydrated and avoid prolonged sun exposure");
            recommendations.add("👕 Wear light, breathable clothing");
        } else if (temperature < 15) {
            recommendations.add("🧥 Cold weather - Dress warmly in layers");
            recommendations.add("☕ Stay warm and limit outdoor exposure");
        } else {
            recommendations.add("🌤️ Pleasant temperature - Good for outdoor activities");
        }
        
        // AQI-based recommendations
        if (aqi > 100) {
            recommendations.add("😷 Poor air quality - Consider wearing a mask outdoors");
            recommendations.add("🏠 Limit outdoor activities, especially for sensitive groups");
        } else if (aqi > 50) {
            recommendations.add("🌫️ Moderate air quality - Sensitive individuals should limit prolonged outdoor exertion");
        } else {
            recommendations.add("✅ Good air quality - Safe for outdoor activities");
        }
        
        fallback.put("recommendations", recommendations);
        return fallback;
    }
    
    /**
     * POST endpoint to run MCP diagnostics
     * Tests different query approaches to identify why vector search returns no results
     *
     * Endpoint: POST /weather/mcp/diagnostics
     * Request Body: {
     *   "contextId": "ctx_fc39071914of",
     *   "agentPersona": "WeatherAdvisor"
     * }
     *
     * @param requestBody - Map containing MCP parameters
     * @return ResponseEntity with diagnostic results
     */
    @PostMapping("/mcp/diagnostics")
    public ResponseEntity<?> runMcpDiagnostics(@RequestBody Map<String, Object> requestBody) {
        logger.info("Received request to run MCP diagnostics");
        
        try {
            String contextId = (String) requestBody.getOrDefault("contextId", "ctx_fc39071914of");
            String agentPersona = (String) requestBody.getOrDefault("agentPersona", "WeatherAdvisor");
            
            Map<String, Object> diagnostics = weatherService.runMcpDiagnostics(contextId, agentPersona);
            
            logger.info("Successfully completed MCP diagnostics");
            return ResponseEntity.ok(diagnostics);
            
        } catch (RuntimeException e) {
            logger.error("Error running MCP diagnostics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        }
    }
    
    /**
     * POST endpoint to diagnose 429 rate limit response
     * Captures complete response headers and body from MCP Gateway
     *
     * Endpoint: POST /weather/mcp/rate-limit-diagnostic
     *
     * @return ResponseEntity with complete 429 response details
     */
    @PostMapping("/mcp/rate-limit-diagnostic")
    public ResponseEntity<?> diagnoseRateLimit() {
        logger.info("Running rate limit diagnostic");
        
        try {
            Map<String, Object> diagnostic = weatherService.diagnoseRateLimitResponse();
            return ResponseEntity.ok(diagnostic);
            
        } catch (Exception e) {
            logger.error("Error running rate limit diagnostic", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        }
    }
}

// Made with Bob
