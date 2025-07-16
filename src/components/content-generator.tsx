'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { Brand, ContentAngle, ContentIdea } from '@/types/database'

interface Props {
  brand: Brand
  angle: ContentAngle
  idea: ContentIdea
  variant?: 'default' | 'outline'
}

export function ContentGenerator({ brand, angle, idea, variant = 'default' }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleGenerateContent = async () => {
    setLoading(true)
    try {
      console.log('🚀 Starting content generation...')
      console.log('Request data:', {
        ideaId: idea.id,
        platform: idea.platform,
        brand: brand.name
      })

      const requestPayload = {
        identifier: 'generateContent',
        data: {
          ideaId: idea.id,
          platform: idea.platform,
          contentIdea: {
            topic: idea.topic,
            description: idea.description,
            imagePrompt: idea.image_prompt,
          },
          brandData: {
            name: brand.name,
            website: brand.website,
            targetAudience: brand.target_audience || '',
            brandTone: brand.brand_tone || '',
            keyOffer: brand.key_offer || '',
            imageGuidelines: brand.image_guidelines || '',
          },
          selectedAngle: {
            header: angle.header,
            description: angle.description,
            tonality: angle.tonality,
            objective: angle.objective,
          },
        },
      }

      console.log('📤 Sending request to /api/n8n:', requestPayload)

      const response = await fetch('/api/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      console.log('📥 Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`API Error (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ API Response:', data)
      
      // Extract content from response (handle array format)
      let contentText = ''
      let imageUrl = ''
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('📋 Processing array response')
        const firstItem = data[0]
        contentText = firstItem.content || ''
        imageUrl = firstItem.imageUrl || ''
        
        // Handle escaped quotes in content
        if (contentText.startsWith('"') && contentText.endsWith('"')) {
          contentText = contentText.slice(1, -1)
        }
        contentText = contentText.replace(/\\"/g, '"').replace(/\\n/g, '\n')
        
        console.log('📋 Extracted content length:', contentText.length)
        console.log('📋 Extracted imageUrl:', imageUrl)
      } else if (data && typeof data === 'object') {
        console.log('📋 Processing object response')
        contentText = data.content || ''
        imageUrl = data.imageUrl || ''
      }
      
      if (!contentText || contentText.trim() === '') {
        console.error('❌ No valid content found:', data)
        throw new Error('Invalid response: missing content or imageUrl')
      }

      console.log('💾 Saving to database...')
      
      // First, check if content already exists for this idea
      const { data: existingContent } = await supabase
        .from('generated_content')
        .select('id')
        .eq('idea_id', idea.id)
        .single()

      let dbResult, error

      if (existingContent) {
        // Update existing content
        console.log('📝 Updating existing content...')
        const result = await supabase
          .from('generated_content')
          .update({
            content: contentText,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('idea_id', idea.id)
          .select()
        
        dbResult = result.data
        error = result.error
      } else {
        // Insert new content
        console.log('➕ Inserting new content...')
        const result = await supabase
          .from('generated_content')
          .insert([{
            idea_id: idea.id,
            brand_id: brand.id,
            platform: idea.platform,
            content: contentText,
            image_url: imageUrl,
          }])
          .select()
        
        dbResult = result.data
        error = result.error
      }

      if (error) {
        console.error('❌ Database Error Details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        })
        throw new Error(`Database Error: ${error.message || 'Unknown database error'} (Code: ${error.code || 'unknown'})`)
      }

      console.log('✅ Database saved:', dbResult)
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('contentGenerated', { 
        detail: { 
          ideaId: idea.id, 
          brandId: brand.id,
          angleId: angle.id,
          content: dbResult?.[0] 
        } 
      }))
      
      // Show success toast
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { message: 'Content generated successfully!', type: 'success' } 
      }))
      
      router.refresh()
    } catch (error) {
      console.error('❌ Error generating content:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // Show error toast
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { message: `Failed to generate content: ${errorMessage}`, type: 'error' } 
      }))
      
      alert(`Failed to generate content: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGenerateContent} 
      disabled={loading}
      variant={variant}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate Content
        </>
      )}
    </Button>
  )
}