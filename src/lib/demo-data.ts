// Demo data for testing all workflows

export const demoAutofillResponses: Record<string, any> = {
  'tesla.com': {
    targetAudience: 'Tech-savvy consumers, early adopters, environmentally conscious individuals, and luxury car enthusiasts aged 25-55',
    brandTone: 'Innovative, forward-thinking, premium, sustainable, and disruptive with a focus on cutting-edge technology',
    keyOffer: 'Revolutionary electric vehicles with superior performance, autonomous driving capabilities, and sustainable energy solutions'
  },
  'nike.com': {
    targetAudience: 'Athletes, fitness enthusiasts, sports fans, and active lifestyle consumers across all age groups and skill levels',
    brandTone: 'Motivational, empowering, athletic, inspirational, and performance-driven with a "Just Do It" mentality',
    keyOffer: 'High-performance athletic footwear, apparel, and equipment designed to enhance athletic performance and inspire achievement'
  },
  'airbnb.com': {
    targetAudience: 'Travel enthusiasts, digital nomads, families, business travelers, and experience-seekers aged 18-65',
    brandTone: 'Welcoming, inclusive, community-focused, adventurous, and authentic with emphasis on belonging anywhere',
    keyOffer: 'Unique travel accommodations and local experiences that connect travelers with authentic local culture and communities'
  },
  'default': {
    targetAudience: 'Modern consumers who value quality, innovation, and authentic brand experiences',
    brandTone: 'Professional, trustworthy, customer-focused, and solution-oriented',
    keyOffer: 'High-quality products/services that solve real problems and deliver exceptional value'
  }
}

export const demoContentAngles = [
  {
    header: 'Thought Leadership & Industry Insights',
    description: 'Position the brand as an industry expert by sharing valuable insights, trends, and predictions that demonstrate deep market knowledge and forward-thinking perspective.',
    tonality: 'Authoritative yet approachable',
    objective: 'brand_awareness'
  },
  {
    header: 'Customer Success Stories',
    description: 'Showcase real customer transformations and success stories to build trust and demonstrate tangible value delivery through authentic case studies.',
    tonality: 'Inspiring and authentic',
    objective: 'social_proof'
  },
  {
    header: 'Behind-the-Scenes Content',
    description: 'Humanize the brand by sharing the people, processes, and culture behind the company to build emotional connections with the audience.',
    tonality: 'Personal and transparent',
    objective: 'community_building'
  },
  {
    header: 'Educational How-To Content',
    description: 'Provide practical, actionable advice and tutorials that help the audience solve problems while subtly showcasing brand expertise.',
    tonality: 'Helpful and instructional',
    objective: 'lead_generation'
  },
  {
    header: 'Industry News & Commentary',
    description: 'Share timely reactions to industry developments, news, and trends with unique brand perspective to stay relevant and top-of-mind.',
    tonality: 'Informed and opinionated',
    objective: 'engagement'
  },
  {
    header: 'Product Innovation & Features',
    description: 'Highlight new features, updates, and innovations in an engaging way that educates users and drives product adoption.',
    tonality: 'Exciting and informative',
    objective: 'product_adoption'
  }
]

export const demoContentIdeas: Record<string, any[]> = {
  twitter: [
    {
      topic: 'Monday Motivation: Industry Trend Prediction',
      description: 'Share a bold prediction about where the industry is heading in 2024 with 3 key supporting points. Use a thread format.',
      imagePrompt: 'Futuristic graph showing upward trends, clean modern design, blue and white color scheme'
    },
    {
      topic: 'Quick Tip Tuesday: Problem-Solving Hack',
      description: 'Share a 60-second hack that solves a common customer pain point. Include a clear call-to-action.',
      imagePrompt: 'Simple infographic with step-by-step icons, bright colors, easy to read on mobile'
    },
    {
      topic: 'Customer Spotlight: Transformation Story',
      description: 'Feature a customer success story in 3 tweets showing before/during/after their journey with your solution.',
      imagePrompt: 'Before and after comparison visual, professional photography style, inspiring mood'
    },
    {
      topic: 'Friday Feature: Product Deep-Dive',
      description: 'Explain one powerful but underused feature of your product with real-world application examples.',
      imagePrompt: 'Product screenshot with highlighted features, clean UI design, professional presentation'
    }
  ],
  linkedin: [
    {
      topic: 'Industry Report: State of the Market Analysis',
      description: 'Comprehensive analysis of current market conditions with data-driven insights and actionable recommendations for business leaders.',
      imagePrompt: 'Professional infographic with charts and statistics, corporate blue color scheme, business-appropriate design'
    },
    {
      topic: 'Leadership Lessons: Building High-Performance Teams',
      description: 'Share 5 key principles for building and managing high-performance teams based on industry experience and research.',
      imagePrompt: 'Team collaboration illustration, modern office setting, diverse professionals working together'
    },
    {
      topic: 'Case Study: Enterprise Transformation Success',
      description: 'Detailed breakdown of how a major client achieved significant results using your solution, including metrics and lessons learned.',
      imagePrompt: 'Professional case study layout with charts, graphs, and company logos, clean corporate design'
    },
    {
      topic: 'Thought Leadership: Future of Work Predictions',
      description: 'Analysis of emerging workplace trends and their impact on business strategy and operational efficiency.',
      imagePrompt: 'Future office concept art, technology integration, modern workplace visualization'
    }
  ],
  newsletter: [
    {
      topic: 'Monthly Industry Roundup: Key Developments',
      description: 'Comprehensive monthly newsletter covering the top 10 industry developments, their implications, and what to watch for next month.',
      imagePrompt: 'Newsletter header design with calendar elements, professional layout, brand colors and typography'
    },
    {
      topic: 'Deep Dive: Complete Guide to Industry Best Practices',
      description: 'In-depth educational content providing step-by-step guidance on implementing industry best practices with real examples.',
      imagePrompt: 'Educational guide cover design, book-like layout, professional and authoritative appearance'
    },
    {
      topic: 'Customer Journey: From Challenge to Success',
      description: 'Long-form case study following a customer\'s complete journey from initial problem through implementation to measurable results.',
      imagePrompt: 'Customer journey map visualization, timeline design, professional infographic style'
    },
    {
      topic: 'Exclusive Insights: Behind-the-Scenes Company Updates',
      description: 'Insider newsletter content sharing company milestones, team updates, product roadmap previews, and exclusive announcements.',
      imagePrompt: 'Behind-the-scenes photo collage, company culture imagery, warm and personal design aesthetic'
    }
  ]
}

export const demoGeneratedContent: Record<string, any[]> = {
  twitter: [
    {
      content: `🚀 PREDICTION: By Q3 2024, 70% of companies will prioritize AI-driven customer experience over traditional methods. 

Here's why this shift is inevitable: 🧵

1/ Customers now expect instant, personalized responses 24/7
2/ AI reduces response time from hours to seconds  
3/ Data shows 3x higher satisfaction rates with AI-enhanced support

The companies that adapt now will dominate tomorrow. Are you ready? 

#AI #CustomerExperience #FutureOfBusiness`,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
    }
  ],
  linkedin: [
    {
      content: `📊 STATE OF THE MARKET: What 500+ Business Leaders Told Us About 2024 Priorities

After surveying executives across industries, three critical trends emerge:

🎯 TREND #1: Customer Experience Investment
• 73% increasing CX budgets by 20%+
• Focus shifting from acquisition to retention
• ROI on CX improvements averaging 4:1

🚀 TREND #2: AI Integration Acceleration  
• 68% implementing AI in core operations
• Productivity gains of 25-40% reported
• Key challenge: talent acquisition and training

⚡ TREND #3: Operational Agility
• Remote-first policies now permanent for 82%
• Investment in collaboration tools up 150%
• Emphasis on outcome-based performance metrics

KEY TAKEAWAY: Companies that balance technology advancement with human-centered approaches are outperforming competitors by significant margins.

What trends are you seeing in your industry? Share your insights below! 👇

#BusinessStrategy #Leadership #MarketTrends #AI #CustomerExperience`,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    }
  ],
  newsletter: [
    {
      content: `# Monthly Industry Roundup: December 2024

## 🌟 Executive Summary
This month brought significant developments across our industry, with particular focus on AI adoption, regulatory changes, and customer behavior shifts. Here are the 10 most important updates you need to know.

## 📈 Top Developments

### 1. AI Regulation Framework Released
The long-awaited federal AI guidelines were published, requiring compliance by Q2 2025. Key impacts include mandatory bias testing and transparency requirements.

**Action Items:**
- Review current AI implementations
- Schedule compliance audit
- Update privacy policies

### 2. Consumer Behavior Shift: Digital-First Preference
New research shows 84% of consumers prefer digital-first interactions, up from 67% last year.

**Implications:**
- Prioritize digital experience optimization
- Invest in mobile-responsive design
- Consider chatbot implementation

### 3. Supply Chain Resilience Gains Momentum
Companies are diversifying suppliers, with 78% now using multiple geographic regions.

## 🔍 Deep Dive: Customer Experience Transformation

The most successful companies this quarter shared three common strategies:

1. **Personalization at Scale**: Using AI to deliver individualized experiences
2. **Omnichannel Integration**: Seamless experience across all touchpoints  
3. **Proactive Support**: Identifying and solving problems before customers report them

### Case Study Spotlight
TechCorp increased customer satisfaction by 45% by implementing AI-powered predictive support, reducing ticket volume while improving resolution times.

## 📊 By the Numbers
- 67% of executives plan to increase AI investment
- Customer acquisition costs down 23% industry-wide
- Employee satisfaction scores at 3-year high

## 🔮 What to Watch Next Month
- New compliance deadlines approach
- Major industry conference announcements
- Q4 earnings reports and 2025 predictions

---

*Stay ahead of the curve with exclusive insights delivered monthly. Forward this to colleagues who would benefit from these updates.*

**Next Issue Preview:** Deep dive into 2025 budget planning strategies and technology investment priorities.`,
      imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
    }
  ]
}

export function getAutofillData(website: string) {
  const domain = website.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0]
  return demoAutofillResponses[domain] || demoAutofillResponses.default
}

export function generateRandomAngles(count: number = 6) {
  const shuffled = [...demoContentAngles].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function generateRandomIdeas(platform: string, count: number = 8) {
  const ideas = demoContentIdeas[platform] || []
  const shuffled = [...ideas].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function generateRandomContent(platform: string) {
  const content = demoGeneratedContent[platform] || []
  return content[Math.floor(Math.random() * content.length)]
}