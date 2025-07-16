export interface Brand {
  id: string
  user_id: string
  name: string
  website: string
  additional_info?: string
  target_audience?: string
  brand_tone?: string
  key_offer?: string
  image_guidelines?: string
  created_at: string
  updated_at: string
}

export interface ContentAngle {
  id: string
  brand_id: string
  platform: Platform
  header: string
  description: string
  tonality: string
  objective: string
  created_at: string
}

export interface ContentIdea {
  id: string
  angle_id: string
  platform: Platform
  topic: string
  description: string
  image_prompt: string
  created_at: string
}

export interface GeneratedContent {
  id: string
  idea_id: string
  brand_id: string
  platform: Platform
  content: string
  image_url?: string
  created_at: string
  updated_at: string
}

export type Platform = 'twitter' | 'linkedin' | 'newsletter'

// Extended interfaces for components that include relationship data
export interface ContentIdeaWithGenerated extends ContentIdea {
  generated_content: GeneratedContent[]
}

export interface ContentAngleWithIdeas extends ContentAngle {
  content_ideas: ContentIdeaWithGenerated[]
}

export interface BrandWithContent extends Brand {
  content_angles: ContentAngleWithIdeas[]
}

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: Brand
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Brand, 'id' | 'created_at' | 'updated_at'>>
      }
      content_angles: {
        Row: ContentAngle
        Insert: Omit<ContentAngle, 'id' | 'created_at'>
        Update: Partial<Omit<ContentAngle, 'id' | 'created_at'>>
      }
      content_ideas: {
        Row: ContentIdea
        Insert: Omit<ContentIdea, 'id' | 'created_at'>
        Update: Partial<Omit<ContentIdea, 'id' | 'created_at'>>
      }
      generated_content: {
        Row: GeneratedContent
        Insert: Omit<GeneratedContent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GeneratedContent, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}