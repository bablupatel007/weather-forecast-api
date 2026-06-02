# ICA Context Studio Integration Guide

## Overview

This guide explains how to upload and use the Weather Ontology in ICA Context Studio.

## Validation Results

✅ **JSON-LD file validated successfully!**

- **8 Entities** (Nodes) defined
- **Valid JSON-LD structure**
- **Ready for ICA Context Studio**

---

## Step-by-Step Upload Instructions

### 1. Access ICA Context Studio

Navigate to your ICA Context Studio interface.

### 2. Upload the Ontology

1. Click on **"Upload Sample Data"** or **"Import Ontology"** button
2. Select the file: `ontology/weather-ontology.jsonld`
3. Click **"Upload"** or **"Import"**

### 3. Verify Entities Creation

After upload, you should see **8 Entities** in the "Nodes" section:

| Entity ID | Entity Name | Description |
|-----------|-------------|-------------|
| weather:City | City | A geographical city location with weather data |
| weather:Forecast | Forecast | Weather forecast details for a city |
| weather:AQI | AQI | Air Quality Index information |
| weather:WeatherAlert | WeatherAlert | Weather warning and alert information |
| weather:RainPrediction | RainPrediction | Rain probability and precipitation forecast |
| weather:WindConditions | WindConditions | Wind speed and direction conditions |
| weather:TravelAdvisory | TravelAdvisory | Travel recommendations based on weather |
| weather:HealthRecommendation | HealthRecommendation | Health guidance based on AQI and weather conditions |

### 4. Verify Relationships

The ontology defines relationships through the `relatesTo` property:

| Entity | Related Entities |
|--------|------------------|
| City | Forecast, AQI, WeatherAlert |
| Forecast | RainPrediction, WindConditions, TravelAdvisory |
| AQI | HealthRecommendation |
| WeatherAlert | (standalone) |
| RainPrediction | (standalone) |
| WindConditions | (standalone) |
| TravelAdvisory | (standalone) |
| HealthRecommendation | (standalone) |

---

## Knowledge Graph Structure

### Entity Relationship Diagram

```
City
├── relatesTo → Forecast
│   ├── relatesTo → RainPrediction
│   ├── relatesTo → WindConditions
│   └── relatesTo → TravelAdvisory
├── relatesTo → AQI
│   └── relatesTo → HealthRecommendation
└── relatesTo → WeatherAlert
```

---

## Entity Properties

Each entity in the ontology has the following base properties defined in the JSON-LD context:

- `id` (@id): Unique identifier for the entity
- `type` (@type): Entity type
- `name` (schema:name): Human-readable name
- `description` (schema:description): Description of the entity
- `relatesTo` (weather:relatesTo): References to related entities

### Custom Properties

Additional properties can be added to entities based on your application needs. The ontology provides a flexible structure that can be extended with domain-specific properties.

---

## Sample Data Creation

### Example 1: Create a City Entity

```json
{
  "@context": {
    "weather": "http://example.org/weather#",
    "schema": "http://schema.org/"
  },
  "id": "weather:Mumbai",
  "type": "Entity",
  "name": "Mumbai",
  "description": "Mumbai city with weather data",
  "relatesTo": [
    "weather:MumbaiForecast",
    "weather:MumbaiAQI"
  ]
}
```

### Example 2: Create a Forecast Entity

```json
{
  "@context": {
    "weather": "http://example.org/weather#",
    "schema": "http://schema.org/"
  },
  "id": "weather:MumbaiForecast",
  "type": "Entity",
  "name": "Mumbai Forecast",
  "description": "Current weather forecast for Mumbai",
  "relatesTo": [
    "weather:MumbaiRainPrediction",
    "weather:MumbaiWindConditions"
  ]
}
```

### Example 3: Create an AQI Entity

```json
{
  "@context": {
    "weather": "http://example.org/weather#",
    "schema": "http://schema.org/"
  },
  "id": "weather:MumbaiAQI",
  "type": "Entity",
  "name": "Mumbai AQI",
  "description": "Air quality index for Mumbai",
  "relatesTo": [
    "weather:MumbaiHealthRecommendation"
  ]
}
```

---

## Troubleshooting

### Issue: Nodes Not Appearing

**Possible Causes:**
1. JSON-LD file not properly uploaded
2. Browser cache issue
3. ICA Context Studio parsing error

**Solutions:**
1. Clear browser cache and reload
2. Re-upload the ontology file
3. Check browser console for errors
4. Verify file format using the validation script:
   ```bash
   cd ontology
   node validate.js
   ```

### Issue: Relationships Not Showing

**Possible Causes:**
1. Node IDs don't match
2. Relationship definitions incomplete

**Solutions:**
1. Ensure all referenced nodes exist
2. Check that `from` and `to` fields match node IDs
3. Verify relationship types are defined

### Issue: Properties Not Visible

**Possible Causes:**
1. Property definitions not loaded
2. UI not refreshed

**Solutions:**
1. Refresh the page
2. Re-upload the ontology
3. Check node details panel

---

## Validation Script

To validate the ontology file before uploading:

```bash
cd ontology
node validate.js
```

**Expected Output:**
```
✓ Valid JSON-LD file
✓ Found 8 Entities
✓ Structure validated for ICA Context Studio
```

---

## Next Steps

After successful upload:

1. **Visualize the Graph**
   - Use the graph visualization tools
   - Explore entity connections
   - Analyze relationship patterns

2. **Add Sample Data**
   - Create instances of each entity type
   - Link them using the `relatesTo` property
   - Test queries and filters

3. **Extend the Ontology**
   - Add custom properties to entities
   - Define additional relationships
   - Create domain-specific extensions

4. **Query the Knowledge Base**
   - Use SPARQL or GraphQL queries
   - Filter by entity types
   - Traverse relationships

5. **Integrate with Applications**
   - Connect to weather APIs
   - Build intelligent weather applications
   - Create semantic search capabilities

---

## Additional Resources

### Documentation Files

- **Ontology README**: `ontology/README.md`
- **AQI Intelligence**: `docs/AQI_INTELLIGENCE.md`
- **Travel Recommendations**: `docs/TRAVEL_RECOMMENDATIONS.md`
- **Rain Alerts**: `docs/RAIN_ALERTS.md`
- **Health Alerts**: `docs/HEALTH_ALERTS.md`
- **Outdoor Activities**: `docs/OUTDOOR_ACTIVITY_SUGGESTIONS.md`
- **Risk Analysis**: `docs/WEATHER_RISK_ANALYSIS.md`

### File Locations

```
WeatherForecast/
├── ontology/
│   ├── weather-ontology.jsonld    ← Upload this file
│   ├── README.md                  ← Ontology documentation
│   ├── validate.js                ← Validation script
│   └── ICA_CONTEXT_STUDIO_GUIDE.md ← This guide
└── docs/
    ├── AQI_INTELLIGENCE.md
    ├── TRAVEL_RECOMMENDATIONS.md
    ├── RAIN_ALERTS.md
    ├── HEALTH_ALERTS.md
    ├── OUTDOOR_ACTIVITY_SUGGESTIONS.md
    └── WEATHER_RISK_ANALYSIS.md
```

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Validate the JSON-LD file using `validate.js`
3. Review the ontology documentation in `ontology/README.md`
4. Check ICA Context Studio documentation
5. Verify browser compatibility (Chrome, Firefox, Edge recommended)

---

**Last Updated**: 2026-05-27  
**Version**: 1.0.0  
**Ontology File**: weather-ontology.jsonld