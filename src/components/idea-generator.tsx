'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Lightbulb, Loader2 } from 'lucide-react'
import { Brand, ContentAngle } from '@/types/database'

interface Props {
  brand: Brand
  angle: ContentAngle
  platform: string
}

export function IdeaGenerator({ brand, angle, platform }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleGenerateIdeas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: 'generateIdeas',
          data: {
            angleId: angle.id,
            platform,
            selectedAngle: {
              header: angle.header,
              description: angle.description,
              tonality: angle.tonality,
              objective: angle.objective,
            },
            brandData: {
              name: brand.name,
              website: brand.website,
              targetAudience: brand.target_audience || '',
              brandTone: brand.brand_tone || '',
              keyOffer: brand.key_offer || '',
              imageGuidelines: brand.image_guidelines || '',
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate ideas')
      }

      const data = await response.json()
      console.log('✅ Ideas response:', JSON.stringify(data, null, 2))
      
      // Handle multiple response formats:
      // 1. Direct format: {"ideas": [...]} (mock API)
      // 2. Nested format: [{"ideas": [...]}] (actual n8n format)
      let ideasArray: any[] = []
      
      if (Array.isArray(data)) {
        // n8n format: [{"ideas": [...]}]
        if (data.length > 0 && data[0].ideas && Array.isArray(data[0].ideas)) {
          ideasArray = data[0].ideas
          console.log(`📋 Using n8n nested format (${ideasArray.length} ideas)`)
        } else {
          console.error('❌ Unknown array format', data)
          throw new Error('Invalid response format from n8n')
        }
      } else if (data.ideas && Array.isArray(data.ideas)) {
        // Direct format: {"ideas": [...]}
        ideasArray = data.ideas
        console.log(`📋 Using direct format (${ideasArray.length} ideas)`)
      } else {
        console.error('❌ Invalid response format', data)
        throw new Error('Invalid response format')
      }
      
      if (ideasArray.length === 0) {
        throw new Error('No ideas were generated')
      }
      
      // Save ideas to database
      const ideaInserts = ideasArray.map((idea: any) => ({
        angle_id: angle.id,
        platform,
        topic: idea.topic,
        description: idea.description,
        image_prompt: idea.imagePrompt,
      }))

      const { error } = await supabase
        .from('content_ideas')
        .insert(ideaInserts)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error generating ideas:', error)
      alert('Failed to generate content ideas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGenerateIdeas} 
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating Ideas...
        </>
      ) : (
        <>
          <Lightbulb className="w-4 h-4" />
          Generate Ideas
        </>
      )}
    </Button>
  )
}