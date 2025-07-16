'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2 } from 'lucide-react'
import { Brand, Platform } from '@/types/database'

interface Props {
  brand: Brand
  autoTrigger?: boolean
}

export function StrategyGenerator({ brand, autoTrigger = false }: Props) {
  const [loading, setLoading] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'linkedin', 'newsletter'])
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  // Auto-trigger strategy generation on component mount if autoTrigger is true
  useEffect(() => {
    const shouldAutoTrigger = autoTrigger || searchParams.get('auto') === 'true'
    if (shouldAutoTrigger && !loading) {
      console.log('Auto-triggering strategy generation for brand:', brand.name)
      handleGenerateStrategy()
    }
  }, [autoTrigger, brand.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerateStrategy = async () => {
    setLoading(true)
    try {
      console.log('🚀 Starting strategy generation for platforms:', selectedPlatforms)
      
      // Send separate request for each platform
      const allAngles: any[] = []
      
      for (const platform of selectedPlatforms) {
        console.log(`📱 Generating angles for ${platform}...`)
        
        const requestData = {
          identifier: 'generateAngles',
          data: {
            brandId: brand.id,
            name: brand.name,
            website: brand.website,
            additionalInfo: brand.additional_info || '',
            targetAudience: brand.target_audience || '',
            brandTone: brand.brand_tone || '',
            keyOffer: brand.key_offer || '',
            imageGuidelines: brand.image_guidelines || '',
            platforms: [platform], // Single platform per request
          },
        }
        
        console.log(`🚀 Sending ${platform} request:`, JSON.stringify(requestData, null, 2))
        
        try {
          const response = await fetch('/api/n8n', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`❌ ${platform} request failed:`, response.status, errorText)
            throw new Error(`Failed to generate strategy for ${platform}: ${response.status}`)
          }

          const data = await response.json()
          console.log(`✅ ${platform} response:`, JSON.stringify(data, null, 2))
          
          // Handle multiple response formats:
          // 1. Direct array format: [{...}, {...}, ...] (mock API)
          // 2. Wrapped format: {"angles": [...]} (original expected)
          // 3. Array with nested angles: [{ "angles": [...] }] (actual n8n format)
          let anglesArray: any[] = []
          
          if (Array.isArray(data)) {
            // Check if it's an array of angle objects or array with nested angles
            if (data.length > 0 && data[0].angles && Array.isArray(data[0].angles)) {
              // n8n format: [{ "angles": [...] }]
              anglesArray = data[0].angles
              console.log(`📋 ${platform}: Using n8n nested format (${anglesArray.length} angles)`)
            } else if (data.length > 0 && data[0].header) {
              // Direct array format: [{header: "...", description: "..."}, ...]
              anglesArray = data
              console.log(`📋 ${platform}: Using direct array format (${anglesArray.length} angles)`)
            } else {
              console.error(`❌ ${platform}: Unknown array format`, data)
              throw new Error(`Unknown array format for ${platform}`)
            }
          } else if (data.angles && Array.isArray(data.angles)) {
            // Wrapped format: {"angles": [...]}
            anglesArray = data.angles
            console.log(`📋 ${platform}: Using wrapped format (${anglesArray.length} angles)`)
          } else {
            console.error(`❌ ${platform}: Invalid response format`, data)
            throw new Error(`Invalid response format for ${platform}`)
          }
          
          // Add platform info to each angle
          const platformAngles = anglesArray.map((angle: any) => ({
            ...angle,
            platform: platform
          }))
          allAngles.push(...platformAngles)
          
          console.log(`✅ ${platform}: Added ${platformAngles.length} angles to collection`)
          
        } catch (platformError) {
          console.error(`❌ Error generating angles for ${platform}:`, platformError)
          // Continue with other platforms even if one fails
        }
      }
      
      if (allAngles.length === 0) {
        throw new Error('No angles were generated for any platform')
      }
      
      console.log(`✅ All angles generated:`, allAngles)
      
      // Save angles to database (keep full descriptions for complete context)
      const angleInserts = allAngles.map((angle: any) => ({
        brand_id: brand.id,
        platform: angle.platform,
        header: angle.header,
        description: angle.description, // Keep full description for complete context
        tonality: angle.tonality,
        objective: angle.objective,
      }))

      const { error } = await supabase
        .from('content_angles')
        .insert(angleInserts)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error generating strategy:', error)
      alert('Failed to generate content strategy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const platformLabels = {
    twitter: 'Twitter',
    linkedin: 'LinkedIn', 
    newsletter: 'Newsletter'
  }

  return (
    <div className="space-y-4">
      {!autoTrigger && (
        <div>
          <h4 className="text-sm font-medium mb-2">Select Platforms:</h4>
          <div className="flex gap-2 flex-wrap">
            {(['twitter', 'linkedin', 'newsletter'] as Platform[]).map((platform) => (
              <Badge
                key={platform}
                variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => togglePlatform(platform)}
              >
                {platformLabels[platform]}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleGenerateStrategy} 
        disabled={loading || selectedPlatforms.length === 0}
        className="flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Strategy...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Strategy for {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  )
}