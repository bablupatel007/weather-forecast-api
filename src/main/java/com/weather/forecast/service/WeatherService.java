package com.weather.forecast.service;

import com.weather.forecast.model.ForecastResponse;
import com.weather.forecast.model.HourlyForecastResponse;
import com.weather.forecast.model.OpenWeatherMapForecastResponse;
import com.weather.forecast.model.OpenWeatherMapResponse;
import com.weather.forecast.model.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * Service class that handles business logic for weather operations.
 * This class is responsible for:
 * 1. Calling the OpenWeatherMap API
 * 2. Processing the API response
 * 3. Converting the response to our custom format
 * 
 * @Service annotation marks this class as a Spring service component
 * 
 * @author Weather Forecast Team
 */
@Service
public class WeatherService {
    
    // Logger for logging information and errors
    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    
    // WebClient for making HTTP requests (modern alternative to RestTemplate)
    private final WebClient webClient;
    
    // API key injected from application.properties
    @Value("${openweathermap.api.key}")
    private String apiKey;
    
    // API URL injected from application.properties
    @Value("${openweathermap.api.url}")
    private String apiUrl;
    
    // Forecast API URL injected from application.properties
    @Value("${openweathermap.forecast.url}")
    private String forecastUrl;
    
    /**
     * Constructor that initializes WebClient
     * Spring will automatically inject WebClient.Builder
     * 
     * @param webClientBuilder - Builder for creating WebClient instance
     */
    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    /**
     * Fetches weather data for a given city from OpenWeatherMap API
     * 
     * @param city - Name of the city for which to fetch weather data
     * @return WeatherResponse - Simplified weather data response
     * @throws RuntimeException - If API call fails or city is not found
     */
    public WeatherResponse getWeatherByCity(String city) {
        logger.info("Fetching weather data for city: {}", city);
        
        try {
            // Build the complete API URL with query parameters
            String url = String.format("%s?q=%s&appid=%s&units=metric", 
                                      apiUrl, city, apiKey);
            
            logger.debug("Calling OpenWeatherMap API: {}", apiUrl);
            
            // Make HTTP GET request to OpenWeatherMap API
            // retrieve() - initiates the request
            // bodyToMono() - converts response body to specified type
            // block() - waits for the response (synchronous call)
            OpenWeatherMapResponse apiResponse = webClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(OpenWeatherMapResponse.class)
                    .block();
            
            // Check if response is null
            if (apiResponse == null) {
                logger.error("Received null response from OpenWeatherMap API for city: {}", city);
                throw new RuntimeException("Failed to fetch weather data. Please try again later.");
            }
            
            logger.info("Successfully fetched weather data for city: {}", city);
            
            // Convert API response to our custom response format
            return convertToWeatherResponse(apiResponse);
            
        } catch (WebClientResponseException.NotFound e) {
            // Handle 404 - City not found
            logger.error("City not found: {}", city);
            throw new RuntimeException("City not found: " + city + ". Please check the city name and try again.");
            
        } catch (WebClientResponseException.Unauthorized e) {
            // Handle 401 - Invalid API key
            logger.error("Invalid API key");
            throw new RuntimeException("Invalid API key. Please check your OpenWeatherMap API key configuration.");
            
        } catch (WebClientResponseException e) {
            // Handle other HTTP errors
            logger.error("Error calling OpenWeatherMap API: Status code: {}, Response: {}", 
                        e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Error fetching weather data: " + e.getMessage());
            
        } catch (Exception e) {
            // Handle any other unexpected errors
            logger.error("Unexpected error while fetching weather data for city: {}", city, e);
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }
    
    /**
     * Converts OpenWeatherMap API response to our simplified WeatherResponse format
     *
     * @param apiResponse - Raw response from OpenWeatherMap API
     * @return WeatherResponse - Simplified weather data
     */
    private WeatherResponse convertToWeatherResponse(OpenWeatherMapResponse apiResponse) {
        WeatherResponse response = new WeatherResponse();
        
        // Set city name
        response.setCity(apiResponse.getName());
        
        // Set temperature and humidity (already in Celsius due to units=metric parameter)
        if (apiResponse.getMain() != null) {
            response.setTemperature(apiResponse.getMain().getTemp());
            response.setHumidity(apiResponse.getMain().getHumidity());
        }
        
        // Set weather description (e.g., "clear sky", "light rain")
        if (apiResponse.getWeather() != null && !apiResponse.getWeather().isEmpty()) {
            response.setWeatherDescription(apiResponse.getWeather().get(0).getDescription());
        }
        
        // Set wind speed
        if (apiResponse.getWind() != null) {
            response.setWindSpeed(apiResponse.getWind().getSpeed());
        }
        
        // Set precipitation (rain volume)
        if (apiResponse.getRain() != null) {
            // Prefer 1-hour data, fallback to 3-hour data
            Double precipitation = apiResponse.getRain().getOneHour();
            if (precipitation == null) {
                precipitation = apiResponse.getRain().getThreeHours();
            }
            response.setPrecipitation(precipitation != null ? precipitation : 0.0);
        } else {
            response.setPrecipitation(0.0);
        }
        
        // Set cloudiness
        Integer cloudiness = 0;
        if (apiResponse.getClouds() != null) {
            cloudiness = apiResponse.getClouds().getAll();
            response.setCloudiness(cloudiness);
        } else {
            response.setCloudiness(0);
        }
        
        // Calculate UV Index (simulated based on cloudiness)
        // Note: Free OpenWeatherMap API doesn't provide UV index
        // We simulate it: clear sky = higher UV, cloudy = lower UV
        response.setUvIndex(calculateSimulatedUVIndex(cloudiness));
        
        // Calculate chance of rain based on humidity and cloudiness
        Integer humidity = apiResponse.getMain() != null ? apiResponse.getMain().getHumidity() : 0;
        response.setChanceOfRain(calculateChanceOfRain(humidity, cloudiness, apiResponse.getRain() != null));
        
        // Extract and format sunrise and sunset times
        if (apiResponse.getSys() != null) {
            if (apiResponse.getSys().getSunrise() != null) {
                response.setSunrise(formatUnixTimestamp(apiResponse.getSys().getSunrise()));
            }
            if (apiResponse.getSys().getSunset() != null) {
                response.setSunset(formatUnixTimestamp(apiResponse.getSys().getSunset()));
            }
        }
        
        // Calculate and set AQI (Air Quality Index)
        calculateAndSetAQI(response, humidity, cloudiness, apiResponse.getMain());
        
        logger.debug("Converted API response to WeatherResponse: {}", response);
        
        return response;
    }
    
    /**
     * Calculates and sets AQI (Air Quality Index) based on available weather data
     * Since free OpenWeatherMap API doesn't provide real AQI, we simulate it based on:
     * - Humidity (high humidity can indicate pollution)
     * - Cloudiness (can trap pollutants)
     * - Pressure (low pressure can worsen air quality)
     * - Visibility (lower visibility indicates worse air quality)
     *
     * @param response - WeatherResponse to update
     * @param humidity - Humidity percentage
     * @param cloudiness - Cloudiness percentage
     * @param main - Main weather data containing pressure
     */
    private void calculateAndSetAQI(WeatherResponse response, Integer humidity, Integer cloudiness,
                                    OpenWeatherMapResponse.Main main) {
        if (humidity == null) humidity = 50;
        if (cloudiness == null) cloudiness = 50;
        
        // Base AQI calculation (0-500 scale)
        // Formula considers multiple factors:
        // - High humidity (>70%) increases AQI
        // - High cloudiness (>60%) increases AQI
        // - Low pressure (<1010 hPa) increases AQI
        
        double aqiScore = 50.0; // Base score (Good)
        
        // Humidity factor (0-100 points)
        if (humidity > 70) {
            aqiScore += (humidity - 70) * 1.5;
        } else if (humidity < 30) {
            aqiScore += (30 - humidity) * 0.5; // Dry air can also affect quality
        }
        
        // Cloudiness factor (0-80 points)
        if (cloudiness > 60) {
            aqiScore += (cloudiness - 60) * 2.0;
        }
        
        // Pressure factor (0-50 points)
        if (main != null && main.getPressure() != null) {
            int pressure = main.getPressure();
            if (pressure < 1010) {
                aqiScore += (1010 - pressure) * 0.8;
            }
        }
        
        // Add some randomness for realism (±10 points)
        aqiScore += (Math.random() * 20 - 10);
        
        // Ensure AQI is within valid range (0-500)
        int aqi = (int) Math.max(0, Math.min(500, aqiScore));
        
        response.setAqi(aqi);
        
        // Set AQI level and color based on standard AQI categories
        if (aqi <= 50) {
            response.setAqiLevel("Good");
            response.setAqiColor("#00E400"); // Green
        } else if (aqi <= 100) {
            response.setAqiLevel("Moderate");
            response.setAqiColor("#FFFF00"); // Yellow
        } else if (aqi <= 150) {
            response.setAqiLevel("Unhealthy for Sensitive Groups");
            response.setAqiColor("#FF7E00"); // Orange
        } else if (aqi <= 200) {
            response.setAqiLevel("Unhealthy");
            response.setAqiColor("#FF0000"); // Red
        } else if (aqi <= 300) {
            response.setAqiLevel("Very Unhealthy");
            response.setAqiColor("#8F3F97"); // Purple
        } else {
            response.setAqiLevel("Hazardous");
            response.setAqiColor("#7E0023"); // Maroon
        }
    }
    
    /**
     * Formats Unix timestamp to readable time string (e.g., "6:30 AM")
     *
     * @param timestamp - Unix timestamp in seconds
     * @return Formatted time string
     */
    private String formatUnixTimestamp(Long timestamp) {
        if (timestamp == null) {
            return "N/A";
        }
        
        try {
            LocalDateTime dateTime = LocalDateTime.ofInstant(
                Instant.ofEpochSecond(timestamp),
                ZoneId.systemDefault()
            );
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");
            return dateTime.format(formatter);
        } catch (Exception e) {
            logger.error("Error formatting timestamp: {}", timestamp, e);
            return "N/A";
        }
    }
    
    /**
     * Calculates a simulated UV Index based on cloudiness
     * Clear sky = higher UV (8-11), Cloudy = lower UV (0-5)
     *
     * @param cloudiness - Cloudiness percentage (0-100)
     * @return Simulated UV Index (0-11)
     */
    private Double calculateSimulatedUVIndex(Integer cloudiness) {
        if (cloudiness == null) cloudiness = 0;
        
        // UV Index ranges from 0 (night/very cloudy) to 11+ (extreme)
        // Formula: UV = 11 - (cloudiness * 0.1)
        double uvIndex = 11.0 - (cloudiness * 0.1);
        
        // Ensure UV index is between 0 and 11
        uvIndex = Math.max(0, Math.min(11, uvIndex));
        
        // Round to 1 decimal place
        return Math.round(uvIndex * 10.0) / 10.0;
    }
    
    /**
     * Calculates chance of rain based on humidity, cloudiness, and current rain status
     *
     * @param humidity - Humidity percentage (0-100)
     * @param cloudiness - Cloudiness percentage (0-100)
     * @param isRaining - Whether it's currently raining
     * @return Chance of rain percentage (0-100)
     */
    private Integer calculateChanceOfRain(Integer humidity, Integer cloudiness, boolean isRaining) {
        if (humidity == null) humidity = 0;
        if (cloudiness == null) cloudiness = 0;
        
        // If it's already raining, chance is 100%
        if (isRaining) {
            return 100;
        }
        
        // Calculate based on humidity and cloudiness
        // Formula: (humidity * 0.4) + (cloudiness * 0.6)
        // Cloudiness has more weight as it's a better indicator
        double chanceOfRain = (humidity * 0.4) + (cloudiness * 0.6);
        
        // Ensure it's between 0 and 100
        return (int) Math.max(0, Math.min(100, chanceOfRain));
    }
    
    /**
     * Fetches 7-day weather forecast for a given city from OpenWeatherMap API
     * 
     * @param city - Name of the city for which to fetch forecast data
     * @return ForecastResponse - 7-day forecast data
     * @throws RuntimeException - If API call fails or city is not found
     */
    public ForecastResponse get7DayForecast(String city) {
        logger.info("Fetching 7-day forecast for city: {}", city);
        
        try {
            // Build the complete API URL with query parameters
            String url = String.format("%s?q=%s&appid=%s&units=metric&cnt=56", 
                                      forecastUrl, city, apiKey);
            
            logger.debug("Calling OpenWeatherMap Forecast API: {}", forecastUrl);
            
            // Make HTTP GET request to OpenWeatherMap Forecast API
            OpenWeatherMapForecastResponse apiResponse = webClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(OpenWeatherMapForecastResponse.class)
                    .block();
            
            // Check if response is null
            if (apiResponse == null || apiResponse.getList() == null) {
                logger.error("Received null response from OpenWeatherMap Forecast API for city: {}", city);
                throw new RuntimeException("Failed to fetch forecast data. Please try again later.");
            }
            
            logger.info("Successfully fetched forecast data for city: {}", city);
            
            // Convert API response to our custom response format
            return convertToForecastResponse(apiResponse);
            
        } catch (WebClientResponseException.NotFound e) {
            logger.error("City not found: {}", city);
            throw new RuntimeException("City not found: " + city + ". Please check the city name and try again.");
            
        } catch (WebClientResponseException.Unauthorized e) {
            logger.error("Invalid API key");
            throw new RuntimeException("Invalid API key. Please check your OpenWeatherMap API key configuration.");
            
        } catch (WebClientResponseException e) {
            logger.error("Error calling OpenWeatherMap Forecast API: Status code: {}, Response: {}", 
                        e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Error fetching forecast data: " + e.getMessage());
            
        } catch (Exception e) {
            logger.error("Unexpected error while fetching forecast data for city: {}", city, e);
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }
    
    /**
     * Converts OpenWeatherMap Forecast API response to our simplified ForecastResponse format
     * Groups 3-hour forecasts into daily forecasts
     *
     * @param apiResponse - Raw response from OpenWeatherMap Forecast API
     * @return ForecastResponse - 7-day forecast data
     */
    private ForecastResponse convertToForecastResponse(OpenWeatherMapForecastResponse apiResponse) {
        ForecastResponse response = new ForecastResponse();
        
        // Set city name
        if (apiResponse.getCity() != null) {
            response.setCity(apiResponse.getCity().getName());
        }
        
        // Group forecast items by date
        Map<LocalDate, List<OpenWeatherMapForecastResponse.ForecastItem>> groupedByDate = 
            apiResponse.getList().stream()
                .collect(Collectors.groupingBy(item -> 
                    Instant.ofEpochSecond(item.getDt())
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                ));
        
        // Convert to daily forecasts (limit to 7 days)
        List<ForecastResponse.DailyForecast> dailyForecasts = groupedByDate.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .limit(7)
            .map(entry -> createDailyForecast(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
        
        response.setDailyForecasts(dailyForecasts);
        
        logger.debug("Converted forecast API response to ForecastResponse with {} days", dailyForecasts.size());
        
        return response;
    }
    
    /**
     * Creates a daily forecast from multiple 3-hour forecast items
     *
     * @param date - The date for this forecast
     * @param items - List of 3-hour forecast items for this date
     * @return DailyForecast - Aggregated daily forecast
     */
    private ForecastResponse.DailyForecast createDailyForecast(
            LocalDate date, 
            List<OpenWeatherMapForecastResponse.ForecastItem> items) {
        
        ForecastResponse.DailyForecast dailyForecast = new ForecastResponse.DailyForecast();
        
        // Format date
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEE, MMM dd");
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEEE");
        dailyForecast.setDate(date.format(dateFormatter));
        dailyForecast.setDayOfWeek(date.format(dayFormatter));
        
        // Calculate min and max temperatures
        DoubleSummaryStatistics tempStats = items.stream()
            .filter(item -> item.getMain() != null && item.getMain().getTemp() != null)
            .mapToDouble(item -> item.getMain().getTemp())
            .summaryStatistics();
        
        dailyForecast.setTempMax(tempStats.getMax());
        dailyForecast.setTempMin(tempStats.getMin());
        
        // Get the most common weather description and icon (from midday forecast if available)
        OpenWeatherMapForecastResponse.ForecastItem middayItem = items.stream()
            .filter(item -> {
                int hour = Instant.ofEpochSecond(item.getDt())
                    .atZone(ZoneId.systemDefault())
                    .getHour();
                return hour >= 11 && hour <= 14; // Between 11 AM and 2 PM
            })
            .findFirst()
            .orElse(items.get(items.size() / 2)); // Fallback to middle item
        
        if (middayItem.getWeather() != null && !middayItem.getWeather().isEmpty()) {
            dailyForecast.setWeatherDescription(middayItem.getWeather().get(0).getDescription());
            dailyForecast.setWeatherIcon(middayItem.getWeather().get(0).getIcon());
        }
        
        // Calculate average humidity
        double avgHumidity = items.stream()
            .filter(item -> item.getMain() != null && item.getMain().getHumidity() != null)
            .mapToInt(item -> item.getMain().getHumidity())
            .average()
            .orElse(0);
        dailyForecast.setHumidity((int) Math.round(avgHumidity));
        
        // Calculate average wind speed
        double avgWindSpeed = items.stream()
            .filter(item -> item.getWind() != null && item.getWind().getSpeed() != null)
            .mapToDouble(item -> item.getWind().getSpeed())
            .average()
            .orElse(0);
        dailyForecast.setWindSpeed(Math.round(avgWindSpeed * 10.0) / 10.0);
        
        // Calculate average cloudiness
        double avgCloudiness = items.stream()
            .filter(item -> item.getClouds() != null && item.getClouds().getAll() != null)
            .mapToInt(item -> item.getClouds().getAll())
            .average()
            .orElse(0);
        dailyForecast.setCloudiness((int) Math.round(avgCloudiness));
        
        // Calculate chance of rain (max probability of precipitation)
        double maxPop = items.stream()
            .filter(item -> item.getPop() != null)
            .mapToDouble(OpenWeatherMapForecastResponse.ForecastItem::getPop)
            .max()
            .orElse(0);
        dailyForecast.setChanceOfRain((int) Math.round(maxPop * 100));
        
        return dailyForecast;
    }
    
    /**
     * Fetches 24-hour hourly weather forecast for a given city from OpenWeatherMap API
     * 
     * @param city - Name of the city for which to fetch hourly forecast data
     * @return HourlyForecastResponse - 24-hour hourly forecast data
     * @throws RuntimeException - If API call fails or city is not found
     */
    public HourlyForecastResponse get24HourForecast(String city) {
        logger.info("Fetching 24-hour hourly forecast for city: {}", city);
        
        try {
            // Build the complete API URL with query parameters (8 items = 24 hours with 3-hour intervals)
            String url = String.format("%s?q=%s&appid=%s&units=metric&cnt=8", 
                                      forecastUrl, city, apiKey);
            
            logger.debug("Calling OpenWeatherMap Forecast API for hourly data: {}", forecastUrl);
            
            // Make HTTP GET request to OpenWeatherMap Forecast API
            OpenWeatherMapForecastResponse apiResponse = webClient
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(OpenWeatherMapForecastResponse.class)
                    .block();
            
            // Check if response is null
            if (apiResponse == null || apiResponse.getList() == null) {
                logger.error("Received null response from OpenWeatherMap Forecast API for city: {}", city);
                throw new RuntimeException("Failed to fetch hourly forecast data. Please try again later.");
            }
            
            logger.info("Successfully fetched hourly forecast data for city: {}", city);
            
            // Convert API response to our custom response format
            return convertToHourlyForecastResponse(apiResponse);
            
        } catch (WebClientResponseException.NotFound e) {
            logger.error("City not found: {}", city);
            throw new RuntimeException("City not found: " + city + ". Please check the city name and try again.");
            
        } catch (WebClientResponseException.Unauthorized e) {
            logger.error("Invalid API key");
            throw new RuntimeException("Invalid API key. Please check your OpenWeatherMap API key configuration.");
            
        } catch (WebClientResponseException e) {
            logger.error("Error calling OpenWeatherMap Forecast API: Status code: {}, Response: {}", 
                        e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Error fetching hourly forecast data: " + e.getMessage());
            
        } catch (Exception e) {
            logger.error("Unexpected error while fetching hourly forecast data for city: {}", city, e);
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }
    
    /**
     * Converts OpenWeatherMap Forecast API response to our simplified HourlyForecastResponse format
     *
     * @param apiResponse - Raw response from OpenWeatherMap Forecast API
     * @return HourlyForecastResponse - 24-hour hourly forecast data
     */
    private HourlyForecastResponse convertToHourlyForecastResponse(OpenWeatherMapForecastResponse apiResponse) {
        HourlyForecastResponse response = new HourlyForecastResponse();
        
        // Set city name
        if (apiResponse.getCity() != null) {
            response.setCity(apiResponse.getCity().getName());
        }
        
        // Convert forecast items to hourly forecasts
        List<HourlyForecastResponse.HourlyForecast> hourlyForecasts = apiResponse.getList().stream()
            .map(this::createHourlyForecast)
            .collect(Collectors.toList());
        
        response.setHourlyForecasts(hourlyForecasts);
        
        logger.debug("Converted forecast API response to HourlyForecastResponse with {} hours", hourlyForecasts.size());
        
        return response;
    }
    
    /**
     * Creates an hourly forecast from a forecast item
     *
     * @param item - Forecast item from OpenWeatherMap API
     * @return HourlyForecast - Single hour forecast
     */
    private HourlyForecastResponse.HourlyForecast createHourlyForecast(OpenWeatherMapForecastResponse.ForecastItem item) {
        HourlyForecastResponse.HourlyForecast hourlyForecast = new HourlyForecastResponse.HourlyForecast();
        
        // Parse timestamp and format time
        Instant instant = Instant.ofEpochSecond(item.getDt());
        LocalDate date = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        int hour = instant.atZone(ZoneId.systemDefault()).getHour();
        
        // Format time (e.g., "2:00 PM" or "14:00")
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:00 a");
        String timeStr = instant.atZone(ZoneId.systemDefault()).format(timeFormatter);
        
        hourlyForecast.setTime(timeStr);
        hourlyForecast.setHour(hour);
        
        // Set temperature data
        if (item.getMain() != null) {
            hourlyForecast.setTemperature(item.getMain().getTemp());
            hourlyForecast.setFeelsLike(item.getMain().getFeelsLike());
            hourlyForecast.setHumidity(item.getMain().getHumidity());
        }
        
        // Set weather description and icon
        if (item.getWeather() != null && !item.getWeather().isEmpty()) {
            hourlyForecast.setWeatherDescription(item.getWeather().get(0).getDescription());
            hourlyForecast.setWeatherIcon(item.getWeather().get(0).getIcon());
        }
        
        // Set wind speed
        if (item.getWind() != null) {
            hourlyForecast.setWindSpeed(item.getWind().getSpeed());
        }
        
        // Set precipitation probability
        if (item.getPop() != null) {
            hourlyForecast.setPrecipitationProbability((int) Math.round(item.getPop() * 100));
        } else {
            hourlyForecast.setPrecipitationProbability(0);
        }
        
        // Set cloudiness
        if (item.getClouds() != null) {
            hourlyForecast.setCloudiness(item.getClouds().getAll());
        } else {
            hourlyForecast.setCloudiness(0);
        }
        
        return hourlyForecast;
    }
    
    // ============================================
    // MCP Context Studio Integration
    // ============================================
    
    @Value("${mcp.context-studio.url}")
    private String mcpUrl;
    
    @Value("${mcp.context-studio.authorization}")
    private String mcpAuthorization;
    
    @Value("${mcp.context-studio.api-key}")
    private String mcpApiKey;
    
    /**
     * Fetches the list of available MCP tools from Context Studio
     * 
     * @return Map containing MCP tools list response
     * @throws RuntimeException if MCP call fails
     */
    public Map<String, Object> fetchMcpToolsList() {
        logger.info("Fetching MCP tools/list from Context Studio");
        
        try {
            String requestBody = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}";
            
            String response = webClient
                    .post()
                    .uri(mcpUrl)
                    .header("Authorization", mcpAuthorization)
                    .header("x-api-key", mcpApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            logger.info("Successfully fetched MCP tools/list");
            
            // Parse and return as Map
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("response", response);
            return result;
            
        } catch (Exception e) {
            logger.error("Error fetching MCP tools/list", e);
            throw new RuntimeException("Failed to fetch MCP tools list: " + e.getMessage());
        }
    }
    
    /**
     * PHASE 1: Concept-Based Retrieval - Proof of Concept
     * 
     * Fetches weather recommendations from MCP Context Studio using concept-based queries
     * instead of city-specific queries. This approach focuses on AQI categories to retrieve
     * relevant knowledge chunks from the knowledge base.
     * 
     * @param contextId - MCP Context ID
     * @param agentPersona - Agent persona (e.g., "WeatherAdvisor")
     * @param city - City name (for logging only)
     * @param temperature - Temperature in Celsius
     * @param humidity - Humidity percentage
     * @param aqi - Air Quality Index
     * @param uvIndex - UV Index
     * @param weatherCondition - Weather condition description
     * @return Map containing MCP recommendations with debugging information
     */
    public Map<String, Object> fetchMcpWeatherRecommendations(
            String contextId, String agentPersona, String city,
            Double temperature, Integer humidity, Integer aqi,
            Double uvIndex, String weatherCondition) {
        
        logger.info("=== PHASE 1: CONCEPT-BASED RETRIEVAL - PROOF OF CONCEPT ===");
        logger.info("Fetching MCP recommendations for city: {}", city);
        logger.info("Weather Data - Temp: {}°C, Humidity: {}%, AQI: {}, UV: {}, Condition: {}",
                temperature, humidity, aqi, uvIndex, weatherCondition);
        
        try {
            // STEP 1: Extract AQI Category (Concept-Based Approach)
            String aqiCategory = getAQICategory(aqi);
            logger.info("✓ AQI Category Extracted: {} (AQI: {})", aqiCategory, aqi);
            
            // STEP 2: Generate Concept-Based Query (Focus on AQI for Phase 1)
            String conceptQuery = generateConceptBasedQuery(aqiCategory, aqi);
            logger.info("✓ Concept-Based Query Generated: {}", conceptQuery);
            
            // STEP 3: Execute MCP Query
            logger.info("→ Executing MCP query to Context Studio...");
            String mcpResponse = executeMcpQuery(contextId, agentPersona, conceptQuery);
            
            // STEP 4: Parse and Log Results
            Map<String, Object> parsedResponse = parseMcpResponse(mcpResponse);
            
            // STEP 5: Build Response with Debugging Information
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("phase", "1 - AQI Concept Retrieval (Proof of Concept)");
            result.put("city", city);
            result.put("aqiCategory", aqiCategory);
            result.put("conceptQuery", conceptQuery);
            result.put("mcpResponse", parsedResponse);
            
            // Extract debugging information
            result.put("debug", extractDebugInfo(parsedResponse, aqiCategory));
            
            logger.info("=== PHASE 1 COMPLETE ===");
            return result;
            
        } catch (Exception e) {
            logger.error("Error in concept-based retrieval", e);
            
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "error");
            errorResult.put("message", e.getMessage());
            errorResult.put("phase", "1 - AQI Concept Retrieval");
            errorResult.put("fallback", "Using fallback recommendations");
            return errorResult;
        }
    }
    
    /**
     * Extracts AQI category from numeric AQI value
     * 
     * AQI Categories (EPA Standard):
     * - 0-50: Good
     * - 51-100: Moderate
     * - 101-150: Unhealthy for Sensitive Groups
     * - 151-200: Unhealthy
     * - 201-300: Very Unhealthy
     * - 301+: Hazardous
     * 
     * @param aqi - Air Quality Index value
     * @return AQI category string
     */
    private String getAQICategory(Integer aqi) {
        if (aqi == null || aqi < 0) {
            return "moderate"; // Default fallback
        }
        
        if (aqi <= 50) {
            return "good";
        } else if (aqi <= 100) {
            return "moderate";
        } else if (aqi <= 150) {
            return "unhealthy for sensitive groups";
        } else if (aqi <= 200) {
            return "unhealthy";
        } else if (aqi <= 300) {
            return "very unhealthy";
        } else {
            return "hazardous";
        }
    }
    
    /**
     * Generates simple 1-2 word query for MCP retrieval
     * Testing if shorter queries work better with vector search
     *
     * @param aqiCategory - AQI category (e.g., "moderate", "unhealthy")
     * @param aqi - Numeric AQI value
     * @return Simple query string (1-2 words)
     */
    private String generateConceptBasedQuery(String aqiCategory, Integer aqi) {
        // Test with simple 1-2 word queries
        // Try different variations based on AQI category
        switch (aqiCategory.toLowerCase()) {
            case "good":
                return "AQI";
            case "moderate":
                return "moderate AQI";
            case "unhealthy for sensitive groups":
                return "unhealthy sensitive";
            case "unhealthy":
                return "unhealthy AQI";
            case "very unhealthy":
                return "very unhealthy";
            case "hazardous":
                return "hazardous AQI";
            default:
                return "AQI";
        }
    }
    
    /**
     * Executes MCP query to Context Studio with comprehensive logging
     *
     * @param contextId - MCP Context ID
     * @param agentPersona - Agent persona
     * @param query - Query string
     * @return Raw MCP response as JSON string
     */
    private String executeMcpQuery(String contextId, String agentPersona, String query) {
        ObjectMapper objectMapper = new ObjectMapper();
        
        try {
            // Build MCP request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("jsonrpc", "2.0");
            requestBody.put("id", 1);
            requestBody.put("method", "tools/call");
            
            Map<String, Object> params = new HashMap<>();
            params.put("name", "context-broker-hybrid-query");
            
            Map<String, Object> arguments = new HashMap<>();
            arguments.put("context_id", contextId);
            arguments.put("AgentPersona", agentPersona);
            arguments.put("query", query);
            arguments.put("sources", List.of("graph", "vector"));
            
            Map<String, Object> graphParams = new HashMap<>();
            graphParams.put("top_k", 5);
            graphParams.put("max_depth", 1);
            arguments.put("graph_params", graphParams);
            
            Map<String, Object> vectorParams = new HashMap<>();
            vectorParams.put("top_k", 10);
            arguments.put("vector_params", vectorParams);
            
            params.put("arguments", arguments);
            requestBody.put("params", params);
            
            // Serialize to JSON string
            String jsonRequestBody = objectMapper.writeValueAsString(requestBody);
            
            // LOG COMPLETE OUTBOUND REQUEST
            logger.info("═══════════════════════════════════════════════════════");
            logger.info("MCP REQUEST DETAILS:");
            logger.info("═══════════════════════════════════════════════════════");
            logger.info("URL: {}", mcpUrl);
            logger.info("Method: POST");
            logger.info("Headers:");
            logger.info("  - Authorization: {} (length: {})",
                mcpAuthorization.substring(0, Math.min(20, mcpAuthorization.length())) + "...",
                mcpAuthorization.length());
            logger.info("  - x-api-key: {} (length: {})",
                mcpApiKey.substring(0, Math.min(20, mcpApiKey.length())) + "...",
                mcpApiKey.length());
            logger.info("  - Content-Type: application/json");
            logger.info("  - Accept: application/json");
            logger.info("Request Body (JSON):");
            logger.info("{}", jsonRequestBody);
            logger.info("Request Body Size: {} bytes", jsonRequestBody.getBytes().length);
            logger.info("═══════════════════════════════════════════════════════");
            
            // Execute MCP call with proper JSON serialization
            String response = webClient
                    .post()
                    .uri(mcpUrl)
                    .header("Authorization", mcpAuthorization)
                    .header("x-api-key", mcpApiKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .bodyValue(jsonRequestBody)  // Send JSON string, not Map
                    .retrieve()
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> {
                            // LOG ERROR RESPONSE WITH FULL DETAILS
                            logger.error("═══════════════════════════════════════════════════════");
                            logger.error("MCP ERROR RESPONSE:");
                            logger.error("═══════════════════════════════════════════════════════");
                            logger.error("HTTP Status: {} {}", clientResponse.statusCode().value(), clientResponse.statusCode());
                            logger.error("Response Headers:");
                            clientResponse.headers().asHttpHeaders().forEach((name, values) ->
                                logger.error("  - {}: {}", name, values)
                            );
                            
                            // Check for rate limit headers
                            var headers = clientResponse.headers().asHttpHeaders();
                            if (headers.containsKey("X-RateLimit-Limit")) {
                                logger.error("Rate Limit Info:");
                                logger.error("  - Limit: {}", headers.getFirst("X-RateLimit-Limit"));
                                logger.error("  - Remaining: {}", headers.getFirst("X-RateLimit-Remaining"));
                                logger.error("  - Reset: {}", headers.getFirst("X-RateLimit-Reset"));
                            }
                            if (headers.containsKey("Retry-After")) {
                                logger.error("  - Retry-After: {}", headers.getFirst("Retry-After"));
                            }
                            
                            return clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    logger.error("Response Body: {}", errorBody);
                                    logger.error("Response Body Length: {} bytes", errorBody.length());
                                    logger.error("═══════════════════════════════════════════════════════");
                                    return clientResponse.createException();
                                });
                        }
                    )
                    .bodyToMono(String.class)
                    .block();
            
            // LOG SUCCESS RESPONSE
            logger.info("═══════════════════════════════════════════════════════");
            logger.info("MCP SUCCESS RESPONSE:");
            logger.info("═══════════════════════════════════════════════════════");
            logger.info("HTTP Status: 200 OK");
            logger.info("Response Body:");
            logger.info("{}", response);
            logger.info("Response Size: {} bytes", response.getBytes().length);
            logger.info("═══════════════════════════════════════════════════════");
            
            return response;
            
        } catch (JsonProcessingException e) {
            logger.error("Error serializing MCP request to JSON", e);
            throw new RuntimeException("JSON serialization failed: " + e.getMessage());
        } catch (WebClientResponseException e) {
            // Enhanced error handling for rate limits
            logger.error("WebClient error - Status: {}, Headers: {}, Body: {}",
                e.getStatusCode(), e.getHeaders(), e.getResponseBodyAsString());
            throw new RuntimeException("MCP query execution failed: " + e.getStatusCode() + " " +
                e.getStatusText() + " from " + e.getRequest().getMethod() + " " + e.getRequest().getURI());
        } catch (Exception e) {
            logger.error("Error executing MCP query", e);
            throw new RuntimeException("MCP query execution failed: " + e.getMessage());
        }
    }
    
    /**
     * Runs comprehensive MCP diagnostic test with multiple queries
     * Tests: AQI, Health, Weather queries
     * Returns detailed results including chunk IDs, scores, and content
     *
     * @return Map containing diagnostic test results
     */
    public Map<String, Object> runMcpDiagnosticTest() {
        logger.info("═══════════════════════════════════════════════════════");
        logger.info("STARTING MCP DIAGNOSTIC TEST");
        logger.info("═══════════════════════════════════════════════════════");
        
        Map<String, Object> results = new HashMap<>();
        results.put("timestamp", java.time.Instant.now().toString());
        results.put("context_id", "ctx_fc39071914of");
        results.put("agent_persona", "WeatherAdvisor");
        
        String[] testQueries = {"AQI", "Health", "Weather"};
        List<Map<String, Object>> queryResults = new ArrayList<>();
        
        for (String query : testQueries) {
            logger.info("───────────────────────────────────────────────────────");
            logger.info("Testing Query: {}", query);
            
            Map<String, Object> queryResult = new HashMap<>();
            queryResult.put("query", query);
            
            try {
                String mcpResponse = executeMcpQuery("ctx_fc39071914of", "WeatherAdvisor", query);
                
                if (mcpResponse == null || mcpResponse.isEmpty()) {
                    queryResult.put("status", "error");
                    queryResult.put("error_message", "Empty MCP response");
                    queryResults.add(queryResult);
                    continue;
                }
                
                Map<String, Object> parsedResponse = parseMcpResponse(mcpResponse);
                
                if (parsedResponse == null) {
                    queryResult.put("status", "error");
                    queryResult.put("error_message", "Failed to parse MCP response");
                    queryResults.add(queryResult);
                    continue;
                }
                
                // Safely extract result
                Object resultObj = parsedResponse.get("result");
                if (!(resultObj instanceof Map)) {
                    queryResult.put("status", "error");
                    queryResult.put("error_message", "Invalid result structure");
                    queryResults.add(queryResult);
                    continue;
                }
                
                @SuppressWarnings("unchecked")
                Map<String, Object> result = (Map<String, Object>) resultObj;
                
                // Safely extract content
                Object contentObj = result.get("content");
                if (!(contentObj instanceof List) || ((List<?>) contentObj).isEmpty()) {
                    queryResult.put("status", "error");
                    queryResult.put("error_message", "No content in response");
                    queryResults.add(queryResult);
                    continue;
                }
                
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> content = (List<Map<String, Object>>) contentObj;
                
                Map<String, Object> firstContent = content.get(0);
                if (firstContent == null) {
                    queryResult.put("status", "error");
                    queryResult.put("error_message", "First content element is null");
                    queryResults.add(queryResult);
                    continue;
                }
                
                String textContent = (String) firstContent.get("text");
                if (textContent == null || textContent.isEmpty()) {
                    queryResult.put("status", "error");
                    queryResult.put("error_message", "Text content is null or empty");
                    queryResults.add(queryResult);
                    continue;
                }
                
                // Parse nested JSON
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, Object> nestedData = mapper.readValue(textContent, Map.class);
                
                // Extract items
                Object itemsObj = nestedData.get("items");
                if (!(itemsObj instanceof Map)) {
                    queryResult.put("status", "no_results");
                    queryResult.put("reason", "No items in response");
                    queryResults.add(queryResult);
                    continue;
                }
                
                @SuppressWarnings("unchecked")
                Map<String, Object> items = (Map<String, Object>) itemsObj;
                
                // Process vector results
                Object vectorObj = items.get("vector");
                if (!(vectorObj instanceof List)) {
                    queryResult.put("status", "no_results");
                    queryResult.put("reason", "No vector results");
                    queryResults.add(queryResult);
                    continue;
                }
                
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> vectorResults = (List<Map<String, Object>>) vectorObj;
                
                List<Map<String, Object>> chunks = new ArrayList<>();
                int chunkCount = 0;
                
                for (Map<String, Object> vectorResult : vectorResults) {
                    if (vectorResult == null) continue;
                    
                    Object metadataObj = vectorResult.get("metadata");
                    if (!(metadataObj instanceof Map)) continue;
                    
                    @SuppressWarnings("unchecked")
                    Map<String, Object> metadata = (Map<String, Object>) metadataObj;
                    
                    String searchStatus = (String) metadata.get("search_status");
                    
                    if (!"no_results".equals(searchStatus)) {
                        chunkCount++;
                        Map<String, Object> chunkInfo = new HashMap<>();
                        chunkInfo.put("chunk_id", metadata.get("chunk_id"));
                        chunkInfo.put("score", metadata.get("score"));
                        chunkInfo.put("title", metadata.get("title"));
                        chunkInfo.put("source", metadata.get("source"));
                        
                        String chunkContent = (String) vectorResult.get("content");
                        if (chunkContent != null && chunkContent.length() > 200) {
                            chunkInfo.put("content_preview", chunkContent.substring(0, 200) + "...");
                        } else {
                            chunkInfo.put("content_preview", chunkContent);
                        }
                        chunks.add(chunkInfo);
                    } else {
                        queryResult.put("status", "no_results");
                        queryResult.put("reason", metadata.get("reason"));
                        queryResult.put("vector_search_attempted", metadata.get("vector_search_attempted"));
                        queryResult.put("lexical_search_attempted", metadata.get("lexical_search_attempted"));
                    }
                }
                
                queryResult.put("chunks_found", chunkCount);
                queryResult.put("chunks", chunks);
                
                if (chunkCount > 0) {
                    queryResult.put("status", "success");
                    logger.info("✓ Query '{}' returned {} chunks", query, chunkCount);
                } else if (!queryResult.containsKey("status")) {
                    queryResult.put("status", "no_results");
                    logger.warn("✗ Query '{}' returned no chunks", query);
                }
                
                queryResult.put("raw_response_size", mcpResponse.length());
                
            } catch (Exception e) {
                logger.error("Error testing query '{}': {}", query, e.getMessage(), e);
                queryResult.put("status", "error");
                queryResult.put("error_message", e.getMessage());
                queryResult.put("error_type", e.getClass().getSimpleName());
            }
            
            queryResults.add(queryResult);
        }
        
        results.put("test_queries", queryResults);
        
        // Summary
        long successCount = queryResults.stream()
            .filter(r -> "success".equals(r.get("status")))
            .count();
        long noResultsCount = queryResults.stream()
            .filter(r -> "no_results".equals(r.get("status")))
            .count();
        long errorCount = queryResults.stream()
            .filter(r -> "error".equals(r.get("status")))
            .count();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("total_queries", testQueries.length);
        summary.put("successful_queries", successCount);
        summary.put("no_results_queries", noResultsCount);
        summary.put("error_queries", errorCount);
        summary.put("retrieval_working", successCount > 0);
        
        results.put("summary", summary);
        
        logger.info("═══════════════════════════════════════════════════════");
        logger.info("DIAGNOSTIC TEST COMPLETE");
        logger.info("Summary: {} successful, {} no results, {} errors",
            successCount, noResultsCount, errorCount);
        logger.info("═══════════════════════════════════════════════════════");
        
        return results;
    }
    
    /**
     * Diagnoses 429 rate limit response from MCP Gateway
     * Captures complete response headers including rate limit details
     *
     * @return Map containing complete 429 response analysis
     */
    public Map<String, Object> diagnoseRateLimitResponse() {
        logger.info("═══════════════════════════════════════════════════════");
        logger.info("DIAGNOSING MCP RATE LIMIT RESPONSE");
        logger.info("═══════════════════════════════════════════════════════");
        
        Map<String, Object> diagnostic = new HashMap<>();
        diagnostic.put("timestamp", java.time.Instant.now().toString());
        diagnostic.put("test_query", "AQI");
        
        ObjectMapper objectMapper = new ObjectMapper();
        
        try {
            // Build minimal MCP request
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("jsonrpc", "2.0");
            requestBody.put("id", 1);
            requestBody.put("method", "tools/call");
            
            Map<String, Object> params = new HashMap<>();
            params.put("name", "context-broker-hybrid-query");
            
            Map<String, Object> arguments = new HashMap<>();
            arguments.put("context_id", "ctx_fc39071914of");
            arguments.put("AgentPersona", "WeatherAdvisor");
            arguments.put("query", "AQI");
            arguments.put("sources", List.of("vector"));
            
            Map<String, Object> vectorParams = new HashMap<>();
            vectorParams.put("top_k", 1);
            arguments.put("vector_params", vectorParams);
            
            params.put("arguments", arguments);
            requestBody.put("params", params);
            
            String jsonRequestBody = objectMapper.writeValueAsString(requestBody);
            
            logger.info("Sending test request to MCP Gateway...");
            logger.info("URL: {}", mcpUrl);
            
            // Execute request and capture response
            webClient
                    .post()
                    .uri(mcpUrl)
                    .header("Authorization", mcpAuthorization)
                    .header("x-api-key", mcpApiKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .bodyValue(jsonRequestBody)
                    .retrieve()
                    .onStatus(
                        status -> status.value() == 429,
                        clientResponse -> {
                            // Capture 429 response details
                            logger.info("═══════════════════════════════════════════════════════");
                            logger.info("429 RATE LIMIT RESPONSE CAPTURED");
                            logger.info("═══════════════════════════════════════════════════════");
                            
                            var headers = clientResponse.headers().asHttpHeaders();
                            
                            diagnostic.put("status_code", 429);
                            diagnostic.put("status_text", "Too Many Requests");
                            
                            // Capture all response headers
                            Map<String, Object> responseHeaders = new HashMap<>();
                            headers.forEach((name, values) -> {
                                responseHeaders.put(name, values.size() == 1 ? values.get(0) : values);
                                logger.info("Header: {} = {}", name, values);
                            });
                            diagnostic.put("response_headers", responseHeaders);
                            
                            // Check for rate limit specific headers
                            Map<String, Object> rateLimitInfo = new HashMap<>();
                            
                            if (headers.containsKey("X-RateLimit-Limit")) {
                                rateLimitInfo.put("limit", headers.getFirst("X-RateLimit-Limit"));
                                logger.info("Rate Limit: {}", headers.getFirst("X-RateLimit-Limit"));
                            }
                            if (headers.containsKey("X-RateLimit-Remaining")) {
                                rateLimitInfo.put("remaining", headers.getFirst("X-RateLimit-Remaining"));
                                logger.info("Remaining: {}", headers.getFirst("X-RateLimit-Remaining"));
                            }
                            if (headers.containsKey("X-RateLimit-Reset")) {
                                String resetValue = headers.getFirst("X-RateLimit-Reset");
                                rateLimitInfo.put("reset", resetValue);
                                logger.info("Reset: {}", resetValue);
                                
                                // Try to parse reset time
                                try {
                                    long resetEpoch = Long.parseLong(resetValue);
                                    Instant resetTime = Instant.ofEpochSecond(resetEpoch);
                                    rateLimitInfo.put("reset_time_utc", resetTime.toString());
                                    rateLimitInfo.put("seconds_until_reset", resetEpoch - Instant.now().getEpochSecond());
                                    logger.info("Reset Time (UTC): {}", resetTime);
                                } catch (NumberFormatException e) {
                                    logger.warn("Could not parse reset time: {}", resetValue);
                                }
                            }
                            if (headers.containsKey("Retry-After")) {
                                String retryAfter = headers.getFirst("Retry-After");
                                rateLimitInfo.put("retry_after", retryAfter);
                                logger.info("Retry-After: {}", retryAfter);
                            }
                            if (headers.containsKey("X-RateLimit-Type")) {
                                rateLimitInfo.put("type", headers.getFirst("X-RateLimit-Type"));
                            }
                            
                            diagnostic.put("rate_limit_info", rateLimitInfo);
                            
                            return clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    diagnostic.put("response_body", errorBody);
                                    diagnostic.put("response_body_length", errorBody.length());
                                    logger.info("Response Body: {}", errorBody);
                                    logger.info("═══════════════════════════════════════════════════════");
                                    return clientResponse.createException();
                                });
                        }
                    )
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> {
                            diagnostic.put("status_code", clientResponse.statusCode().value());
                            diagnostic.put("status_text", clientResponse.statusCode().toString());
                            return clientResponse.createException();
                        }
                    )
                    .bodyToMono(String.class)
                    .block();
            
            diagnostic.put("status", "success");
            diagnostic.put("message", "Request succeeded (no rate limit)");
            
        } catch (WebClientResponseException e) {
            diagnostic.put("exception_type", e.getClass().getSimpleName());
            diagnostic.put("exception_message", e.getMessage());
            
            if (!diagnostic.containsKey("status_code")) {
                diagnostic.put("status_code", e.getStatusCode().value());
                diagnostic.put("status_text", e.getStatusText());
            }
            
            logger.info("Diagnostic complete - captured 429 response details");
            
        } catch (Exception e) {
            diagnostic.put("status", "error");
            diagnostic.put("error_type", e.getClass().getSimpleName());
            diagnostic.put("error_message", e.getMessage());
            logger.error("Error during rate limit diagnostic", e);
        }
        
        logger.info("═══════════════════════════════════════════════════════");
        
        return diagnostic;
    }
    
    /**
     * Parses MCP response JSON string to Map
     *
     * @param mcpResponse - Raw MCP response JSON
     * @return Parsed response as Map
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseMcpResponse(String mcpResponse) {
        try {
            if (mcpResponse == null || mcpResponse.trim().isEmpty()) {
                logger.error("Empty or null MCP response");
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("parseError", "Empty or null response");
                errorResult.put("rawResponse", mcpResponse);
                return errorResult;
            }
            
            // Use Jackson ObjectMapper to properly parse JSON
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parsedJson = objectMapper.readValue(mcpResponse, Map.class);
            
            // Add raw response for debugging
            parsedJson.put("rawResponse", mcpResponse);
            
            // Check if response contains an error
            if (parsedJson.containsKey("error")) {
                logger.error("MCP response contains error: {}", parsedJson.get("error"));
                parsedJson.put("hasError", true);
            } else if (parsedJson.containsKey("result")) {
                parsedJson.put("hasResult", true);
                logger.debug("MCP response parsed successfully with result");
            } else {
                logger.warn("MCP response has unexpected structure");
            }
            
            return parsedJson;
            
        } catch (JsonProcessingException e) {
            logger.error("JSON parsing error for MCP response: {}", e.getMessage(), e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("parseError", "JSON parsing failed: " + e.getMessage());
            errorResult.put("rawResponse", mcpResponse);
            errorResult.put("hasError", true);
            return errorResult;
        } catch (Exception e) {
            logger.error("Unexpected error parsing MCP response", e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("parseError", "Unexpected error: " + e.getMessage());
            errorResult.put("rawResponse", mcpResponse);
            errorResult.put("hasError", true);
            return errorResult;
        }
    }
    
    /**
     * Extracts debugging information from MCP response
     * 
     * @param parsedResponse - Parsed MCP response
     * @param aqiCategory - AQI category used in query
     * @return Debug information map
     */
    private Map<String, Object> extractDebugInfo(Map<String, Object> parsedResponse, String aqiCategory) {
        Map<String, Object> debug = new HashMap<>();
        
        String rawResponse = (String) parsedResponse.get("rawResponse");
        
        // Extract chunk count
        int chunkCount = 0;
        if (rawResponse != null) {
            // Count occurrences of "chunk_id" in response
            int index = 0;
            while ((index = rawResponse.indexOf("\"chunk_id\"", index)) != -1) {
                chunkCount++;
                index++;
            }
        }
        
        debug.put("retrievedChunks", chunkCount);
        debug.put("aqiCategoryUsed", aqiCategory);
        debug.put("queryType", "concept-based");
        debug.put("expectedDocuments", List.of(
            "AQI_INTELLIGENCE.md",
            "HEALTH_ALERTS.md",
            "OUTDOOR_ACTIVITY_SUGGESTIONS.md"
        ));
        
        // Log results
        logger.info("📊 DEBUG INFO:");
        logger.info("   - Retrieved Chunks: {}", chunkCount);
        logger.info("   - AQI Category: {}", aqiCategory);
        logger.info("   - Query Type: concept-based");
        
        if (chunkCount > 0) {
            logger.info("✅ SUCCESS: Retrieved {} chunks from knowledge base", chunkCount);
        } else {
            logger.warn("⚠️  WARNING: No chunks retrieved. Check query or knowledge base.");
        }
        
        return debug;
    }

    /**
     * Diagnostic method to test different MCP query approaches
     * Tests: simple keywords, vector-only, graph-only, no persona, different query lengths
     */
    public Map<String, Object> runMcpDiagnostics(String contextId, String agentPersona) {
        logger.info("=== RUNNING MCP DIAGNOSTICS ===");
        Map<String, Object> diagnostics = new LinkedHashMap<>();
        
        try {
            // Test 1: Simple keyword query
            logger.info("Test 1: Simple keyword 'AQI'");
            String test1Response = executeMcpQueryDiagnostic(contextId, agentPersona, "AQI", 
                List.of("graph", "vector"), true);
            diagnostics.put("test1_simple_keyword", parseMcpResponse(test1Response));
            
            // Test 2: Medium query
            logger.info("Test 2: Medium query 'Air quality health recommendations'");
            String test2Response = executeMcpQueryDiagnostic(contextId, agentPersona, 
                "Air quality health recommendations", List.of("graph", "vector"), true);
            diagnostics.put("test2_medium_query", parseMcpResponse(test2Response));
            
            // Test 3: Vector-only search
            logger.info("Test 3: Vector-only search with 'AQI'");
            String test3Response = executeMcpQueryDiagnostic(contextId, agentPersona, "AQI", 
                List.of("vector"), true);
            diagnostics.put("test3_vector_only", parseMcpResponse(test3Response));
            
            // Test 4: Graph-only search
            logger.info("Test 4: Graph-only search with 'AQI'");
            String test4Response = executeMcpQueryDiagnostic(contextId, agentPersona, "AQI", 
                List.of("graph"), true);
            diagnostics.put("test4_graph_only", parseMcpResponse(test4Response));
            
            // Test 5: No AgentPersona
            logger.info("Test 5: No AgentPersona with 'AQI'");
            String test5Response = executeMcpQueryDiagnostic(contextId, null, "AQI", 
                List.of("graph", "vector"), true);
            diagnostics.put("test5_no_persona", parseMcpResponse(test5Response));
            
            // Test 6: Exact document phrase
            logger.info("Test 6: Exact phrase 'Air Quality Index Intelligence'");
            String test6Response = executeMcpQueryDiagnostic(contextId, agentPersona, 
                "Air Quality Index Intelligence", List.of("graph", "vector"), true);
            diagnostics.put("test6_exact_phrase", parseMcpResponse(test6Response));
            
            logger.info("=== DIAGNOSTICS COMPLETE ===");
            diagnostics.put("status", "completed");
            diagnostics.put("timestamp", java.time.Instant.now().toString());
            
        } catch (Exception e) {
            logger.error("Error running diagnostics", e);
            diagnostics.put("status", "error");
            diagnostics.put("error", e.getMessage());
        }
        
        return diagnostics;
    }
    
    /**
     * Execute MCP query with configurable parameters for diagnostics
     */
    private String executeMcpQueryDiagnostic(String contextId, String agentPersona, String query, 
                                            List<String> sources, boolean includeParams) {
        try {
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("name", "context-broker-hybrid-query");
            
            Map<String, Object> arguments = new LinkedHashMap<>();
            arguments.put("context_id", contextId);
            if (agentPersona != null) {
                arguments.put("AgentPersona", agentPersona);
            }
            arguments.put("query", query);
            arguments.put("sources", sources);
            
            if (includeParams) {
                if (sources.contains("graph")) {
                    arguments.put("graph_params", Map.of("top_k", 5, "max_depth", 1));
                }
                if (sources.contains("vector")) {
                    arguments.put("vector_params", Map.of("top_k", 10));
                }
            }
            
            params.put("arguments", arguments);
            
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("jsonrpc", "2.0");
            requestBody.put("method", "tools/call");
            requestBody.put("id", 1);
            requestBody.put("params", params);
            
            logger.info("Diagnostic Query: {}", query);
            logger.info("Sources: {}", sources);
            logger.info("AgentPersona: {}", agentPersona != null ? agentPersona : "none");
            
            String response = webClient.post()
                .uri(mcpUrl)
                .header("Authorization", mcpAuthorization)
                .header("x-api-key", mcpApiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(10))
                .block();
            
            logger.info("Diagnostic Response received");
            return response;
            
        } catch (Exception e) {
            logger.error("Error in diagnostic query", e);
            throw new RuntimeException("Diagnostic query failed: " + e.getMessage(), e);
        }
    }
}

// Made with Bob
