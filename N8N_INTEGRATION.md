# n8n Integration Guide

## Overview
This document outlines how to integrate the Content Demo application with n8n workflows for AI-powered content generation.

## Current Mock API Structure

The application currently uses a mock API at `/api/mock-n8n` that simulates the n8n webhook responses. This is designed to be easily replaceable with actual n8n webhook URLs.

## API Endpoints Structure

### Single n8n Webhook Endpoint
All AI functions route through one n8n webhook with identifier-based routing:

**URL:** `[YOUR_N8N_WEBHOOK_URL]`
**Method:** `POST`
**Content-Type:** `application/json`

### Request Format
```json
{
  "identifier": "string",
  "data": "object"
}
```

## AI Functions

### 1. Autofill Brand Data
**Identifier:** `autofill`

**Request:**
```json
{
  "identifier": "autofill",
  "data": {
    "website": "https://example.com",
    "name": "Brand Name",
    "additionalInfo": "optional additional context"
  }
}
```

**Expected Response:**
```json
{
  "industry": "Technology",
  "targetAudience": "Tech professionals and developers",
  "brandTone": "Professional, innovative, forward-thinking",
  "contentTopics": "AI, automation, productivity, innovation",
  "competitors": "Zapier, Microsoft Power Automate, Integromat",
  "uniqueSellingPoints": "Advanced AI integration, user-friendly interface",
  "brandGuidelines": "Use modern, clean visuals with blue and white color scheme",
  "imageGuidelines": "Professional, tech-focused imagery with people using technology"
}
```

### 2. Generate Content Angles
**Identifier:** `generateAngles`

**Request:**
```json
{
  "identifier": "generateAngles",
  "data": {
    "brandId": "uuid",
    "name": "Brand Name",
    "website": "https://example.com",
    "industry": "Technology",
    "targetAudience": "Target audience description",
    "brandTone": "Brand tone description"
  }
}
```

**Expected Response:**
```json
{
  "angles": [
    {
      "id": "angle-1",
      "header": "Educational Content",
      "description": "Share knowledge and insights to position as thought leader",
      "tonality": "Informative and authoritative",
      "objective": "Build trust and credibility",
      "platforms": ["linkedin", "twitter", "newsletter"]
    }
  ]
}
```

### 3. Generate Content Ideas
**Identifier:** `generateIdeas`

**Request:**
```json
{
  "identifier": "generateIdeas",
  "data": {
    "angleId": "uuid",
    "platform": "twitter|linkedin|newsletter",
    "selectedAngle": {
      "header": "Educational Content",
      "description": "Strategy description",
      "tonality": "Informative and authoritative",
      "objective": "Build trust and credibility"
    },
    "brandData": {
      "name": "Brand Name",
      "industry": "Technology",
      "targetAudience": "Target audience",
      "imageGuidelines": "Image style preferences"
    }
  }
}
```

**Expected Response:**
```json
{
  "ideas": [
    {
      "id": "idea-1",
      "topic": "Content topic",
      "description": "Detailed description of the content idea",
      "platform": "twitter",
      "imagePrompt": "Detailed prompt for image generation"
    }
  ]
}
```

### 4. Generate Final Content
**Identifier:** `generateContent`

**Request:**
```json
{
  "identifier": "generateContent",
  "data": {
    "ideaId": "uuid",
    "platform": "twitter|linkedin|newsletter",
    "contentIdea": {
      "topic": "Content topic",
      "description": "Content description",
      "imagePrompt": "Image generation prompt"
    },
    "brandData": {
      "name": "Brand Name",
      "industry": "Technology"
    },
    "selectedAngle": {
      "tonality": "Brand tone"
    }
  }
}
```

**Expected Response:**
```json
{
  "content": "Generated content text",
  "imageUrl": "https://generated-image-url.com/image.jpg"
}
```

## Integration Steps

### Step 1: Replace Mock API URL
Update the following file:
`src/components/content-generator.tsx`

Change:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/mock-n8n' 
  : '/api/mock-n8n'
```

To:
```javascript
const API_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '/api/mock-n8n'
```

### Step 2: Add Environment Variable
Add to `.env.local`:
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Step 3: Test Integration
1. Use the test suite at `/test-suite` to verify all 4 functions work
2. Check browser console for request/response logs
3. Verify database operations complete successfully

## n8n Workflow Setup

### Required n8n Nodes
1. **Webhook Trigger** - Receives POST requests from the app
2. **Switch Node** - Routes based on `identifier` field
3. **AI Nodes** - OpenAI/Claude/other AI service nodes for each function
4. **Response Nodes** - Return formatted JSON responses

### Example n8n Workflow Structure
```
[Webhook] → [Switch on identifier] → [AI Processing] → [Format Response] → [Respond to Webhook]
```

## Error Handling

The application expects these error response formats:

**Client Error (400):**
```json
{
  "error": "Missing required fields: website, name"
}
```

**Server Error (500):**
```json
{
  "error": "AI service temporarily unavailable"
}
```

## Testing

### Mock API Testing
- Current mock API is available at: `http://localhost:3001/api/mock-n8n`
- Test suite available at: `http://localhost:3001/test-suite`

### Production Testing
1. Set up n8n webhook
2. Configure environment variable
3. Test each function through the UI
4. Monitor n8n execution logs

## Security Considerations

1. **Webhook Security:** Use n8n's built-in authentication
2. **Rate Limiting:** Implement rate limiting in n8n workflows
3. **Input Validation:** Validate all inputs in n8n before AI processing
4. **Error Logging:** Log errors without exposing sensitive data

## Monitoring

### Metrics to Track
- Response times for each AI function
- Success/failure rates
- User engagement with generated content
- API usage patterns

### Recommended Tools
- n8n execution logs
- Application performance monitoring
- Custom analytics dashboard