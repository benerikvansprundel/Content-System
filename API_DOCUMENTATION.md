# Content Agency Management System - API Documentation

## Overview

This document provides complete specifications for the n8n webhook integration. The system uses a single webhook endpoint with identifier-based routing to handle 4 distinct AI functions.

## Base Configuration

**Production Webhook URL**: `https://n8n.benai.agency/webhook/content-demo-test`
**Mock/Development URL**: `http://localhost:3002/api/mock-n8n`

All requests use `POST` method with `Content-Type: application/json`

## Request/Response Structure

### Common Request Format
```json
{
  "identifier": "function_name",
  "data": {
    // Function-specific data
  }
}
```

### Common Response Format
```json
{
  // Function-specific response data
}
```

### Error Response Format
```json
{
  "error": "Error description"
}
```

---

## 1. Autofill Function

**Purpose**: Automatically populate brand details from website URL

### Request Specification

```json
{
  "identifier": "autofill",
  "data": {
    "brandId": "string (UUID)",
    "name": "string (required)",
    "website": "string (required, URL)",
    "additionalInfo": "string (optional)"
  }
}
```

### Response Specification

```json
{
  "targetAudience": "string",
  "brandTone": "string", 
  "keyOffer": "string"
}
```

### Example Request
```json
{
  "identifier": "autofill",
  "data": {
    "brandId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tesla",
    "website": "https://tesla.com",
    "additionalInfo": "Electric vehicles and clean energy solutions"
  }
}
```

### Example Response
```json
{
  "targetAudience": "Tech-savvy consumers, early adopters, environmentally conscious individuals, and luxury car enthusiasts aged 25-55",
  "brandTone": "Innovative, forward-thinking, premium, sustainable, and disruptive with a focus on cutting-edge technology",
  "keyOffer": "Revolutionary electric vehicles with superior performance, autonomous driving capabilities, and sustainable energy solutions"
}
```

---

## 2. Generate Content Angles Function

**Purpose**: Generate strategic content angles for brand content strategy

### Request Specification

```json
{
  "identifier": "generateAngles",
  "data": {
    "brandId": "string (UUID, required)",
    "name": "string (required)",
    "website": "string (required, URL)",
    "targetAudience": "string (required)",
    "brandTone": "string (required)",
    "keyOffer": "string (required)",
    "imageGuidelines": "string (optional)"
  }
}
```

### Response Specification

```json
{
  "angles": [
    {
      "header": "string",
      "description": "string",
      "tonality": "string",
      "objective": "string"
    }
  ]
}
```

### Example Request
```json
{
  "identifier": "generateAngles",
  "data": {
    "brandId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tesla",
    "website": "https://tesla.com",
    "targetAudience": "Tech-savvy consumers, early adopters, environmentally conscious individuals",
    "brandTone": "Innovative, forward-thinking, premium, sustainable",
    "keyOffer": "Revolutionary electric vehicles with superior performance",
    "imageGuidelines": "Clean, modern, futuristic aesthetic with minimal design"
  }
}
```

### Example Response
```json
{
  "angles": [
    {
      "header": "Thought Leadership & Industry Insights",
      "description": "Position Tesla as an industry expert by sharing valuable insights, trends, and predictions that demonstrate deep market knowledge and forward-thinking perspective.",
      "tonality": "Authoritative yet approachable",
      "objective": "brand_awareness"
    },
    {
      "header": "Customer Success Stories", 
      "description": "Showcase real Tesla customer transformations and success stories to build trust and demonstrate tangible value delivery through authentic case studies.",
      "tonality": "Inspiring and authentic",
      "objective": "social_proof"
    },
    {
      "header": "Innovation & Technology Deep-Dives",
      "description": "Highlight Tesla's cutting-edge technology, R&D insights, and innovation process to educate audience while showcasing technical expertise.",
      "tonality": "Technical yet accessible",
      "objective": "product_education"
    }
  ]
}
```

---

## 3. Generate Content Ideas Function

**Purpose**: Generate platform-specific content ideas based on selected strategy angle

### Request Specification

```json
{
  "identifier": "generateIdeas",
  "data": {
    "angleId": "string (UUID, required)",
    "platform": "string (required, enum: ['twitter', 'linkedin', 'newsletter'])",
    "selectedAngle": {
      "header": "string (required)",
      "description": "string (required)",
      "tonality": "string (required)",
      "objective": "string (required)"
    },
    "brandData": {
      "name": "string (required)",
      "website": "string (required)",
      "targetAudience": "string (required)",
      "brandTone": "string (required)",
      "keyOffer": "string (required)",
      "imageGuidelines": "string (optional)"
    }
  }
}
```

### Response Specification

```json
{
  "ideas": [
    {
      "topic": "string",
      "description": "string",
      "imagePrompt": "string"
    }
  ]
}
```

### Example Request
```json
{
  "identifier": "generateIdeas",
  "data": {
    "angleId": "660e8400-e29b-41d4-a716-446655440001",
    "platform": "twitter",
    "selectedAngle": {
      "header": "Thought Leadership & Industry Insights",
      "description": "Position Tesla as an industry expert by sharing valuable insights",
      "tonality": "Authoritative yet approachable",
      "objective": "brand_awareness"
    },
    "brandData": {
      "name": "Tesla",
      "website": "https://tesla.com",
      "targetAudience": "Tech-savvy consumers and early adopters",
      "brandTone": "Innovative, forward-thinking, premium",
      "keyOffer": "Revolutionary electric vehicles",
      "imageGuidelines": "Clean, modern, futuristic aesthetic"
    }
  }
}
```

### Example Response
```json
{
  "ideas": [
    {
      "topic": "Monday Motivation: EV Industry Prediction 2024",
      "description": "Share a bold prediction about where the electric vehicle industry is heading in 2024 with 3 key supporting points. Use a thread format to maximize engagement.",
      "imagePrompt": "Futuristic electric vehicle charging station with holographic displays, clean modern design, Tesla brand colors"
    },
    {
      "topic": "Quick Tip Tuesday: Range Optimization Hack",
      "description": "Share a 60-second hack that helps Tesla owners optimize their vehicle range. Include clear call-to-action for Tesla app features.",
      "imagePrompt": "Tesla dashboard showing range optimization features, sleek UI design, easy to read on mobile"
    },
    {
      "topic": "Tech Thursday: Autopilot Safety Statistics",
      "description": "Present latest Autopilot safety data compared to traditional driving with compelling visualizations and insights.",
      "imagePrompt": "Infographic showing safety statistics with Tesla Autopilot, professional data visualization, trust-building design"
    }
  ]
}
```

---

## 4. Generate Final Content Function

**Purpose**: Generate final content and accompanying image for selected content idea

### Request Specification

```json
{
  "identifier": "generateContent",
  "data": {
    "ideaId": "string (UUID, required)",
    "platform": "string (required, enum: ['twitter', 'linkedin', 'newsletter'])",
    "contentIdea": {
      "topic": "string (required)",
      "description": "string (required)",
      "imagePrompt": "string (required)"
    },
    "brandData": {
      "name": "string (required)",
      "website": "string (required)",
      "targetAudience": "string (required)",
      "brandTone": "string (required)",
      "keyOffer": "string (required)",
      "imageGuidelines": "string (optional)"
    },
    "selectedAngle": {
      "header": "string (required)",
      "description": "string (required)",
      "tonality": "string (required)",
      "objective": "string (required)"
    }
  }
}
```

### Response Specification

```json
{
  "content": "string",
  "imageUrl": "string (URL)"
}
```

### Example Request
```json
{
  "identifier": "generateContent",
  "data": {
    "ideaId": "770e8400-e29b-41d4-a716-446655440002",
    "platform": "twitter",
    "contentIdea": {
      "topic": "Monday Motivation: EV Industry Prediction 2024",
      "description": "Share a bold prediction about where the electric vehicle industry is heading",
      "imagePrompt": "Futuristic electric vehicle charging station with holographic displays"
    },
    "brandData": {
      "name": "Tesla",
      "website": "https://tesla.com",
      "targetAudience": "Tech-savvy consumers and early adopters",
      "brandTone": "Innovative, forward-thinking, premium",
      "keyOffer": "Revolutionary electric vehicles",
      "imageGuidelines": "Clean, modern, futuristic aesthetic"
    },
    "selectedAngle": {
      "header": "Thought Leadership & Industry Insights",
      "description": "Position Tesla as an industry expert",
      "tonality": "Authoritative yet approachable",
      "objective": "brand_awareness"
    }
  }
}
```

### Example Response
```json
{
  "content": "🚀 PREDICTION: By Q3 2024, 70% of new vehicles will have some form of autonomous capability.\n\nHere's why this shift is inevitable: 🧵\n\n1/ Consumer demand for safety features has reached a tipping point\n2/ Regulatory frameworks are finally catching up to technology \n3/ Cost of autonomous tech has dropped 60% in the past 2 years\n\nThe companies investing in autonomy NOW will dominate tomorrow's market.\n\nTesla has been leading this charge for years. Are others ready to follow?\n\n#ElectricVehicles #Autonomy #FutureOfTransport #Tesla",
  "imageUrl": "https://generated-images-api.com/futuristic-ev-charging-station.jpg"
}
```

---

## Platform-Specific Content Guidelines

### Twitter
- **Character Limit**: 280 characters per tweet (threads allowed)
- **Hashtags**: 1-3 relevant hashtags
- **Format**: Engaging hooks, bullet points, calls-to-action
- **Tone**: Conversational, punchy, shareable

### LinkedIn  
- **Length**: 150-300 words for optimal engagement
- **Format**: Professional insights, industry analysis, thought leadership
- **Tone**: Professional but personable, authority-building
- **Elements**: Data points, professional hashtags, clear value proposition

### Newsletter
- **Length**: 800-1500 words
- **Format**: Structured with headers, bullet points, clear sections
- **Tone**: In-depth, educational, comprehensive
- **Elements**: Executive summary, detailed analysis, actionable insights

---

## Error Handling

### Common Error Codes

| Status Code | Error Type | Description |
|------------|------------|-------------|
| 400 | Bad Request | Invalid identifier or missing required fields |
| 500 | Internal Server Error | AI processing failure or system error |
| 429 | Too Many Requests | Rate limiting exceeded |
| 503 | Service Unavailable | AI service temporarily unavailable |

### Error Response Examples

```json
{
  "error": "Invalid identifier. Must be one of: autofill, generateAngles, generateIdeas, generateContent"
}
```

```json
{
  "error": "Missing required fields: website, name"
}
```

```json
{
  "error": "Invalid platform. Must be twitter, linkedin, or newsletter"
}
```

---

## Testing

### Mock API Endpoints
For development and testing, use the local mock APIs:

- **Base URL**: `http://localhost:3002/api/mock-n8n`
- **Test Suite**: Visit `http://localhost:3002/test-suite` for comprehensive testing
- **Individual Tests**: Each function has dedicated test endpoints

### Performance Expectations
- **Autofill**: 1-3 seconds response time
- **Generate Angles**: 3-5 seconds response time  
- **Generate Ideas**: 2-4 seconds response time
- **Generate Content**: 4-6 seconds response time

### Rate Limits
- **Production**: 100 requests per hour per brand
- **Development**: No rate limits on mock APIs

---

## Integration Checklist

### Pre-Integration
- [ ] Database schema deployed to Supabase
- [ ] Environment variables configured
- [ ] Authentication working (Supabase Auth)
- [ ] Mock APIs tested successfully

### N8N Integration
- [ ] Replace `N8N_WEBHOOK_URL` with production endpoint
- [ ] Test all 4 functions with real data
- [ ] Verify response formats match specification
- [ ] Test error handling scenarios
- [ ] Monitor performance and optimize if needed

### Post-Integration
- [ ] End-to-end user flow testing
- [ ] Performance monitoring setup
- [ ] Error tracking and logging
- [ ] User acceptance testing

---

This documentation serves as the complete specification for n8n webhook implementation. All request/response formats, error handling, and integration requirements are defined to ensure seamless AI-powered content generation.