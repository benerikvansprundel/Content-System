-- Content Agency Management System Database Schema

-- Create brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  additional_info TEXT,
  target_audience TEXT,
  brand_tone TEXT,
  key_offer TEXT,
  image_guidelines TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create content_angles table
CREATE TABLE content_angles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'newsletter')),
  header TEXT NOT NULL,
  description TEXT NOT NULL,
  tonality TEXT NOT NULL,
  objective TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create content_ideas table
CREATE TABLE content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  angle_id UUID REFERENCES content_angles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create generated_content table
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES content_ideas(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_content_angles_brand_id ON content_angles(brand_id);
CREATE INDEX idx_content_ideas_angle_id ON content_ideas(angle_id);
CREATE INDEX idx_generated_content_brand_id ON generated_content(brand_id);
CREATE INDEX idx_generated_content_idea_id ON generated_content(idea_id);

-- Enable Row Level Security (RLS)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_angles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Brands policies
CREATE POLICY "Users can view their own brands" ON brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brands" ON brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands" ON brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands" ON brands
  FOR DELETE USING (auth.uid() = user_id);

-- Content angles policies
CREATE POLICY "Users can view content angles for their brands" ON content_angles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = content_angles.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create content angles for their brands" ON content_angles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = content_angles.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update content angles for their brands" ON content_angles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = content_angles.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content angles for their brands" ON content_angles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = content_angles.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Content ideas policies
CREATE POLICY "Users can view content ideas for their brands" ON content_ideas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content_angles 
      JOIN brands ON brands.id = content_angles.brand_id
      WHERE content_angles.id = content_ideas.angle_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create content ideas for their brands" ON content_ideas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM content_angles 
      JOIN brands ON brands.id = content_angles.brand_id
      WHERE content_angles.id = content_ideas.angle_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update content ideas for their brands" ON content_ideas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM content_angles 
      JOIN brands ON brands.id = content_angles.brand_id
      WHERE content_angles.id = content_ideas.angle_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content ideas for their brands" ON content_ideas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM content_angles 
      JOIN brands ON brands.id = content_angles.brand_id
      WHERE content_angles.id = content_ideas.angle_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Generated content policies
CREATE POLICY "Users can view generated content for their brands" ON generated_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = generated_content.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create generated content for their brands" ON generated_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = generated_content.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update generated content for their brands" ON generated_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = generated_content.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete generated content for their brands" ON generated_content
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = generated_content.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();