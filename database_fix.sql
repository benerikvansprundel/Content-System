-- Fix for generated_content table to support upsert on idea_id
-- Add unique constraint on idea_id to allow upsert functionality

-- First, ensure there are no duplicate idea_id entries
DELETE FROM generated_content 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM generated_content 
    GROUP BY idea_id
);

-- Add unique constraint on idea_id
ALTER TABLE generated_content 
ADD CONSTRAINT unique_generated_content_idea_id UNIQUE (idea_id);

-- Alternative: if you prefer to allow multiple content versions per idea,
-- you can comment out the above and use this approach instead:
-- CREATE UNIQUE INDEX idx_generated_content_idea_id_unique ON generated_content(idea_id);