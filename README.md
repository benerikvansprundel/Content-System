# Content Agency Management System

A sequential content creation platform where content agencies create client brands, get AI-generated content strategies, ideate platform-specific content, and generate final content with images.

## Features

- **Brand Management**: Create and manage client brands with detailed profiles
- **AI Content Strategy**: Generate strategic content angles using AI
- **Platform-Specific Content**: Create content for Twitter, LinkedIn, and newsletters
- **Content Generation**: AI-powered content and image generation
- **Auto-save**: Real-time content editing with automatic saving
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Database & Auth**: Supabase
- **AI Integration**: n8n webhook for AI content generation
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- n8n instance with AI content generation workflows

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd content-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL schema from `database.sql` in your Supabase SQL editor
   - Enable Row Level Security policies

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Flow

1. **Login/Register** - Authentication via Supabase Auth
2. **Dashboard** - View and manage all brands
3. **Create Brand** - Two-step brand creation with AI autofill
4. **Generate Strategy** - AI-generated content angles
5. **Select Platform** - Choose Twitter, LinkedIn, or Newsletter
6. **Generate Ideas** - AI-powered content ideas for selected platform
7. **Create Content** - Generate final content and images
8. **Edit Content** - Rich text editing with auto-save

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected routes
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
│   └── supabase/         # Supabase client configurations
└── types/                # TypeScript type definitions
```

## Database Schema

- **brands**: Store brand information and profiles
- **content_angles**: AI-generated content strategies
- **content_ideas**: Platform-specific content ideas
- **generated_content**: Final generated content with images

## n8n Integration

The system integrates with n8n via a single webhook endpoint that handles four different AI functions:

1. **autofill**: Populate brand details from website
2. **generateAngles**: Create strategic content angles
3. **generateIdeas**: Generate content ideas for platform + angle
4. **generateContent**: Create final content + image

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **ErrorBoundary**: Global error handling
- **LoadingSpinner**: Loading states throughout the app
- **StrategyGenerator**: AI content strategy generation
- **IdeaGenerator**: Platform-specific idea generation
- **ContentGenerator**: Final content and image generation
- **ContentEditor**: Rich text editing with auto-save

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set up environment variables in your deployment platform

4. Ensure your n8n webhook is accessible from your deployed domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
