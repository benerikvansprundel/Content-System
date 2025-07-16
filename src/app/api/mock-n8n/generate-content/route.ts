import { NextRequest, NextResponse } from 'next/server'
import { generateRandomContent } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    // Add realistic delay to simulate AI processing and image generation
    await new Promise(resolve => setTimeout(resolve, 4000))

    const body = await request.json()
    console.log('🤖 Mock Generate Content API Called:', body)

    // Validate request structure
    if (body.identifier !== 'generateContent') {
      return NextResponse.json(
        { error: 'Invalid identifier' },
        { status: 400 }
      )
    }

    const { data } = body
    if (!data?.ideaId || !data?.platform || !data?.contentIdea) {
      return NextResponse.json(
        { error: 'Missing required fields: ideaId, platform, contentIdea' },
        { status: 400 }
      )
    }

    // Validate platform
    if (!['twitter', 'linkedin', 'newsletter'].includes(data.platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be twitter, linkedin, or newsletter' },
        { status: 400 }
      )
    }

    // Generate content based on platform and idea
    const baseContent = generateRandomContent(data.platform)
    
    if (!baseContent) {
      return NextResponse.json(
        { error: 'No content template available for platform' },
        { status: 500 }
      )
    }

    // Customize content based on brand data and content idea
    let customizedContent = baseContent.content
    
    // Replace placeholders with actual brand data
    if (data.brandData?.name) {
      customizedContent = customizedContent.replace(/\[Brand Name\]/g, data.brandData.name)
    }
    
    // Add brand-specific tone adjustments
    if (data.selectedAngle?.tonality) {
      customizedContent += `\n\n[Tone: ${data.selectedAngle.tonality}]`
    }

    // Generate image URL based on image prompt
    const imageUrl = generateImageUrl(data.contentIdea.imagePrompt)

    const response = {
      content: customizedContent,
      imageUrl: imageUrl
    }

    console.log('✅ Mock Generate Content Response:', response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Mock Generate Content Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function generateImageUrl(imagePrompt: string): string {
  // Mock image generation - in real implementation this would call DALL-E or similar
  const imageKeywords = imagePrompt.toLowerCase()
  
  // Select appropriate Unsplash image based on keywords
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