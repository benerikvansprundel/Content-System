import { NextRequest, NextResponse } from 'next/server'
import { getAutofillData, generateRandomAngles, generateRandomIdeas, generateRandomContent } from '@/lib/demo-data'

// Main mock n8n router that handles all AI functions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, data } = body

    console.log('🚀 Mock N8N Router - Identifier:', identifier)
    console.log('📋 Request data:', data)

    // Route to appropriate mock function based on identifier
    switch (identifier) {
      case 'autofill':
        // Add realistic delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (!data?.website || !data?.name) {
          return NextResponse.json(
            { error: 'Missing required fields: website, name' },
            { status: 400 }
          )
        }

        const autofillData = getAutofillData(data.website)
        if (data.additionalInfo) {
          autofillData.targetAudience += ` with specific focus on ${data.additionalInfo.toLowerCase()}`
        }

        console.log('✅ Autofill Response:', autofillData)
        return NextResponse.json(autofillData)

      case 'generateAngles':
        // Add realistic delay
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        if (!data?.brandId || !data?.name || !data?.website) {
          return NextResponse.json(
            { error: 'Missing required fields: brandId, name, website' },
            { status: 400 }
          )
        }

        const baseAngles = generateRandomAngles(6)
        const customizedAngles = baseAngles.map(angle => ({
          ...angle,
          description: angle.description.replace('the brand', data.name),
          tonality: data.brandTone 
            ? `${angle.tonality} with ${data.brandTone.split(',')[0].toLowerCase()} approach`
            : angle.tonality
        }))

        // Return direct array format to match n8n output
        console.log('✅ Generate Angles Response:', customizedAngles)
        return NextResponse.json(customizedAngles)

      case 'generateIdeas':
        // Add realistic delay
        await new Promise(resolve => setTimeout(resolve, 2500))
        
        if (!data?.angleId || !data?.platform || !data?.selectedAngle) {
          return NextResponse.json(
            { error: 'Missing required fields: angleId, platform, selectedAngle' },
            { status: 400 }
          )
        }

        if (!['twitter', 'linkedin', 'newsletter'].includes(data.platform)) {
          return NextResponse.json(
            { error: 'Invalid platform. Must be twitter, linkedin, or newsletter' },
            { status: 400 }
          )
        }

        const baseIdeas = generateRandomIdeas(data.platform, 10)
        const customizedIdeas = baseIdeas.map(idea => ({
          ...idea,
          topic: idea.topic.includes('Brand') 
            ? idea.topic.replace('Brand', data.brandData?.name || 'Your Brand')
            : idea.topic,
          description: `${idea.description} Aligned with ${data.selectedAngle.header} strategy, maintaining ${data.selectedAngle.tonality} tone.`,
          imagePrompt: data.brandData?.imageGuidelines 
            ? `${idea.imagePrompt}, following brand guidelines: ${data.brandData.imageGuidelines}`
            : idea.imagePrompt
        }))

        const ideasResponse = { ideas: customizedIdeas }
        console.log('✅ Generate Ideas Response:', ideasResponse)
        return NextResponse.json(ideasResponse)

      case 'generateContent':
        // Add realistic delay
        await new Promise(resolve => setTimeout(resolve, 4000))
        
        if (!data?.ideaId || !data?.platform || !data?.contentIdea) {
          return NextResponse.json(
            { error: 'Missing required fields: ideaId, platform, contentIdea' },
            { status: 400 }
          )
        }

        if (!['twitter', 'linkedin', 'newsletter'].includes(data.platform)) {
          return NextResponse.json(
            { error: 'Invalid platform. Must be twitter, linkedin, or newsletter' },
            { status: 400 }
          )
        }

        const baseContent = generateRandomContent(data.platform)
        if (!baseContent) {
          return NextResponse.json(
            { error: 'No content template available for platform' },
            { status: 500 }
          )
        }

        let customizedContent = baseContent.content
        
        // Replace placeholders with actual brand data
        if (data.brandData?.name) {
          customizedContent = customizedContent.replace(/\[Brand Name\]/g, data.brandData.name)
        }
        
        // Add brand-specific tone adjustments
        if (data.selectedAngle?.tonality) {
          customizedContent += `\n\n[Tone: ${data.selectedAngle.tonality}]`
        }

        // Generate image URL
        const imageUrl = generateImageUrl(data.contentIdea.imagePrompt)

        const contentResponse = {
          content: customizedContent,
          imageUrl: imageUrl
        }

        console.log('✅ Generate Content Response:', contentResponse)
        return NextResponse.json(contentResponse)

      default:
        return NextResponse.json(
          { error: `Unknown identifier: ${identifier}` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('❌ Mock N8N Router Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function generateImageUrl(imagePrompt: string): string {
  // Mock image generation - select appropriate Unsplash image based on keywords
  const imageKeywords = imagePrompt.toLowerCase()
  
  if (imageKeywords.includes('chart') || imageKeywords.includes('graph') || imageKeywords.includes('data')) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  }
  
  if (imageKeywords.includes('team') || imageKeywords.includes('collaboration')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
  }
  
  if (imageKeywords.includes('technology') || imageKeywords.includes('ai') || imageKeywords.includes('future')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  }
  
  if (imageKeywords.includes('business') || imageKeywords.includes('office') || imageKeywords.includes('professional')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  }
  
  if (imageKeywords.includes('newsletter') || imageKeywords.includes('guide') || imageKeywords.includes('education')) {
    return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop'
  }
  
  // Default business/tech image
  return 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop'
}