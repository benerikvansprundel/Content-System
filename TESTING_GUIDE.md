# Testing Guide - Content Agency Management System

## 🧪 Complete Testing Suite with Demo Data

This guide provides comprehensive testing instructions for all AI-powered workflows with realistic demo data and mock APIs.

## Quick Start Testing

### 1. Environment Setup
```bash
# Use mock APIs for testing
cp .env.local.mock .env.local

# Start development server
npm run dev
```

### 2. Database Setup
First, ensure your Supabase database is set up:
1. Go to your Supabase dashboard
2. Run the SQL from `database.sql` in SQL Editor
3. Verify tables are created with RLS policies

### 3. Access Test Pages

| Test Page | URL | Purpose |
|-----------|-----|---------|
| Environment Debug | `http://localhost:3002/debug` | Check env variables |
| Database Test | `http://localhost:3002/test-db` | Test Supabase connection |
| **Comprehensive Test Suite** | `http://localhost:3002/test-suite` | **Test all AI functions** |

## 🎯 Comprehensive Test Suite

Visit `http://localhost:3002/test-suite` for the complete testing interface.

### Features:
- **4 Test Categories**: Autofill, Strategy Generation, Ideas Generation, Content Generation
- **Real Demo Data**: Tesla, Nike, and generic brand examples
- **Performance Monitoring**: Response times and success rates
- **Error Handling**: Detailed error messages and debugging
- **Request/Response Logging**: View full API payloads

### Test Categories:

#### 1. Autofill API Tests
Tests AI-powered brand detail autofill from website URLs:
- **Tesla Test**: Tests tech/automotive brand autofill
- **Nike Test**: Tests sports/lifestyle brand autofill  
- **Generic Test**: Tests fallback autofill logic

#### 2. Strategy Generation Tests
Tests AI generation of content strategy angles:
- **Multi-angle Generation**: Creates 6-8 strategic content angles
- **Brand Customization**: Tailors strategy to brand tone and audience
- **Objective Mapping**: Maps angles to business objectives

#### 3. Ideas Generation Tests
Tests platform-specific content idea generation:
- **Twitter Ideas**: Short-form, engaging content concepts
- **LinkedIn Ideas**: Professional, thought-leadership content
- **Newsletter Ideas**: Long-form, comprehensive content

#### 4. Content Generation Tests
Tests final content and image generation:
- **Platform-Optimized Content**: Format appropriate for each platform
- **Brand Voice Integration**: Maintains consistent brand tone
- **Image Generation**: Mock DALL-E style image creation

## 📊 Demo Data Specifications

### Autofill Demo Data
```json
{
  "tesla.com": {
    "targetAudience": "Tech-savvy consumers, early adopters, environmentally conscious individuals, and luxury car enthusiasts aged 25-55",
    "brandTone": "Innovative, forward-thinking, premium, sustainable, and disruptive with a focus on cutting-edge technology",
    "keyOffer": "Revolutionary electric vehicles with superior performance, autonomous driving capabilities, and sustainable energy solutions"
  },
  "nike.com": {
    "targetAudience": "Athletes, fitness enthusiasts, sports fans, and active lifestyle consumers across all age groups and skill levels",
    "brandTone": "Motivational, empowering, athletic, inspirational, and performance-driven with a \"Just Do It\" mentality",
    "keyOffer": "High-performance athletic footwear, apparel, and equipment designed to enhance athletic performance and inspire achievement"
  }
}
```

### Content Strategy Angles
6 pre-built strategic angles:
1. **Thought Leadership & Industry Insights**
2. **Customer Success Stories**
3. **Behind-the-Scenes Content**
4. **Educational How-To Content**
5. **Industry News & Commentary**
6. **Product Innovation & Features**

### Platform-Specific Content Examples

#### Twitter Content
```
🚀 PREDICTION: By Q3 2024, 70% of companies will prioritize AI-driven customer experience over traditional methods. 

Here's why this shift is inevitable: 🧵

1/ Customers now expect instant, personalized responses 24/7
2/ AI reduces response time from hours to seconds  
3/ Data shows 3x higher satisfaction rates with AI-enhanced support

The companies that adapt now will dominate tomorrow. Are you ready? 

#AI #CustomerExperience #FutureOfBusiness
```

#### LinkedIn Content
```
📊 STATE OF THE MARKET: What 500+ Business Leaders Told Us About 2024 Priorities

After surveying executives across industries, three critical trends emerge:

🎯 TREND #1: Customer Experience Investment
• 73% increasing CX budgets by 20%+
• Focus shifting from acquisition to retention
• ROI on CX improvements averaging 4:1

[... detailed professional content continues ...]
```

## 🔄 Complete User Flow Testing

### End-to-End Test Sequence:

1. **Authentication Flow**
   ```
   Visit: http://localhost:3002/login
   - Create new account
   - Verify email authentication
   - Test dashboard access
   ```

2. **Brand Creation Flow**
   ```
   Navigate: Dashboard → Add Brand
   Test Data:
   - Name: "Tesla" 
   - Website: "https://tesla.com"
   - Additional Info: "Electric vehicles and clean energy"
   
   Expected: Autofill should populate brand details
   ```

3. **Strategy Generation Flow**
   ```
   Navigate: Brand → Strategy
   Action: Click "Generate Strategy"
   Expected: 6+ content angles appear
   Time: 3-5 seconds
   ```

4. **Ideas Generation Flow**
   ```
   Navigate: Strategy → Generate Ideas (select angle)
   Test: All three platforms (Twitter, LinkedIn, Newsletter)
   Expected: 8-12 ideas per platform
   Time: 2-4 seconds per platform
   ```

5. **Content Creation Flow**
   ```
   Navigate: Ideas → Create Content (select idea)
   Expected: Final content + generated image
   Time: 4-6 seconds
   Features: Auto-save editing
   ```

## 🐛 Error Testing Scenarios

### 1. Invalid Data Tests
```javascript
// Test with missing required fields
{
  "identifier": "autofill",
  "data": {
    "name": "Test Brand"
    // Missing website - should return 400 error
  }
}
```

### 2. Invalid Platform Tests
```javascript
// Test with invalid platform
{
  "identifier": "generateIdeas",
  "data": {
    "platform": "invalid_platform" // Should return 400 error
  }
}
```

### 3. Network Error Simulation
```javascript
// Test with malformed identifier
{
  "identifier": "invalid_function",
  "data": {}
}
```

## 📈 Performance Benchmarks

### Expected Response Times:
- **Autofill**: 1-3 seconds
- **Generate Angles**: 3-5 seconds  
- **Generate Ideas**: 2-4 seconds
- **Generate Content**: 4-6 seconds

### Success Criteria:
- ✅ All tests pass with 200 status codes
- ✅ Response times within expected ranges
- ✅ Generated content follows platform guidelines
- ✅ Error handling returns appropriate messages
- ✅ Database operations complete successfully

## 🔧 Troubleshooting Common Issues

### Issue: Environment Variables Not Loading
**Solution**: 
```bash
# Restart dev server after .env changes
npm run dev
```

### Issue: Database Connection Failed
**Solution**:
1. Check Supabase dashboard is accessible
2. Verify database schema was applied
3. Test with `/test-db` endpoint

### Issue: Mock APIs Not Responding
**Solution**:
1. Verify `N8N_WEBHOOK_URL=http://localhost:3002/api/mock-n8n`
2. Check browser console for detailed errors
3. Test individual endpoints in `/test-suite`

### Issue: Content Not Saving
**Solution**:
1. Verify user authentication
2. Check RLS policies are applied
3. Monitor browser network tab for failed requests

## 🚀 Production Migration Checklist

### Before N8N Integration:
- [ ] All mock tests passing
- [ ] Database schema deployed
- [ ] Authentication working
- [ ] Error handling comprehensive

### N8N Integration Steps:
1. **Update Environment**: Change `N8N_WEBHOOK_URL` to production
2. **Test Real APIs**: Run test suite against real n8n endpoints
3. **Monitor Performance**: Check response times meet expectations
4. **Error Handling**: Verify error scenarios work properly

### Post-Integration Verification:
- [ ] End-to-end user flow works
- [ ] All 4 AI functions operational
- [ ] Performance within acceptable ranges
- [ ] Error monitoring in place

## 📋 Test Data Templates

### Brand Test Data:
```json
{
  "tech_startup": {
    "name": "InnovateTech",
    "website": "https://innovatetech.example",
    "additionalInfo": "B2B SaaS platform for enterprise automation"
  },
  "ecommerce": {
    "name": "StyleHub",
    "website": "https://stylehub.example", 
    "additionalInfo": "Fashion e-commerce marketplace"
  },
  "consulting": {
    "name": "StrategyPro",
    "website": "https://strategypro.example",
    "additionalInfo": "Management consulting for Fortune 500"
  }
}
```

This comprehensive testing guide ensures all AI-powered workflows are thoroughly validated before production deployment. The mock APIs provide realistic response times and data structures that mirror the final n8n implementation.