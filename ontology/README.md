# Weather Ontology

## Overview

The Weather Ontology is a JSON-LD schema designed to represent weather-related entities and their relationships. This ontology provides a semantic structure for weather data, forecasts, air quality, alerts, and their impacts on travel, health, and outdoor activities.

## Version

**1.0.0** - Released: 2026-05-27

## Namespace

- **Base URI**: `http://example.org/weather#`
- **Prefix**: `weather`
- **Schema**: `http://schema.org/`

## Core Entities

### 1. City
A geographical city location with weather data.

**Related To:**
- Forecast
- AQI
- WeatherAlert

### 2. Forecast
Weather forecast details for a city.

**Related To:**
- RainPrediction
- WindConditions
- TravelAdvisory

### 3. AQI (Air Quality Index)
Air Quality Index information.

**Related To:**
- HealthRecommendation

### 4. WeatherAlert
Weather warning and alert information.

### 5. RainPrediction
Rain probability and precipitation forecast.

### 6. WindConditions
Wind speed and direction conditions.

### 7. TravelAdvisory
Travel recommendations based on weather.

### 8. HealthRecommendation
Health guidance based on AQI and weather conditions.

## Entity Relationships

The ontology defines the following relationships between entities:

1. **City → Forecast**: Cities have weather forecasts
2. **City → AQI**: Cities have air quality measurements
3. **City → WeatherAlert**: Cities receive weather alerts
4. **Forecast → RainPrediction**: Forecasts include rain predictions
5. **Forecast → WindConditions**: Forecasts include wind conditions
6. **Forecast → TravelAdvisory**: Forecasts affect travel recommendations
7. **AQI → HealthRecommendation**: Air quality triggers health recommendations

## JSON-LD Structure

The ontology uses JSON-LD format with the following structure:

```json
{
  "@context": {
    "weather": "http://example.org/weather#",
    "schema": "http://schema.org/",
    "id": "@id",
    "type": "@type",
    "name": "schema:name",
    "description": "schema:description",
    "relatesTo": {
      "@id": "weather:relatesTo",
      "@type": "@id"
    }
  },
  "@graph": [
    {
      "id": "weather:EntityName",
      "type": "Entity",
      "name": "Entity Name",
      "description": "Entity description",
      "relatesTo": ["weather:RelatedEntity"]
    }
  ]
}
```

## Usage Example

```json
{
  "@context": {
    "weather": "http://example.org/weather#"
  },
  "@graph": [
    {
      "id": "weather:City",
      "type": "Entity",
      "name": "City",
      "description": "A geographical city location with weather data",
      "relatesTo": [
        "weather:Forecast",
        "weather:AQI",
        "weather:WeatherAlert"
      ]
    }
  ]
}
```

## Integration

### With Weather APIs
The ontology can be used to structure data from:
- OpenWeatherMap API
- Weather.gov API
- AccuWeather API
- Custom weather services

### With Applications
- Weather forecasting applications
- Travel planning systems
- Health monitoring platforms
- Smart city infrastructure
- IoT weather stations

## File Structure

```
ontology/
├── weather-ontology.jsonld           # Main ontology file
├── README.md                          # This documentation
├── ICA_CONTEXT_STUDIO_GUIDE.md       # ICA Context Studio integration guide
└── validate.js                        # Validation script
```

## Standards Compliance

- **JSON-LD 1.1**: Compliant with JSON-LD specification
- **Schema.org**: Uses schema.org vocabulary for common properties
- **Semantic Web**: Enables semantic interoperability

## Integration

This ontology can be integrated with:
- Weather forecasting applications
- ICA Context Studio for knowledge graph visualization
- Semantic web applications
- Weather data APIs
- Smart city platforms

## Validation

To validate the ontology file:

```bash
cd ontology
node validate.js
```

## License

This ontology is provided as part of the Weather Forecast Application.

## Contributing

To extend or modify the ontology:
1. Add new entities to the `@graph` array
2. Define relationships using `relatesTo` property
3. Follow the existing JSON-LD structure
4. Update this documentation
5. Validate using the validation script

## Support

For questions or issues related to this ontology, please refer to the main project documentation.

---

**Last Updated**: 2026-05-27  
**Maintainer**: Weather Intelligence System