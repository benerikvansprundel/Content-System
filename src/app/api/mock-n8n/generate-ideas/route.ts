import { NextRequest, NextResponse } from 'next/server'
import { generateRandomIdeas } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    // Add realistic delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500))

    const body = await request.json()
    console.log('🤖 Mock Generate Ideas API Called:', body)

    // Validate request structure
    if (body.identifier !== 'generateIdeas') {
      return NextResponse.json(
        { error: 'Invalid identifier' },
        { status: 400 }
      )
    }

    const { data } = body
    if (!data?.angleId || !data?.platform || !data?.selectedAngle) {
      return NextResponse.json(
        { error: 'Missing required fields: angleId, platform, selectedAngle' },
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

    // Generate 8-12 ideas based on platform and angle
    const baseIdeas = generateRandomIdeas(data.platform, 10)
    
    // Customize ideas based on selected angle and brand data
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

    const response = {
      ideas: customizedIdeas
    }

    console.log('✅ Mock Generate Ideas Response:', response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Mock Generate Ideas Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    )
  }
}