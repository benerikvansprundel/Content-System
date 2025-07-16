import { NextRequest, NextResponse } from 'next/server'
import { generateRandomAngles } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    // Add realistic delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    const body = await request.json()
    console.log('🤖 Mock Generate Angles API Called:', body)

    // Validate request structure
    if (body.identifier !== 'generateAngles') {
      return NextResponse.json(
        { error: 'Invalid identifier' },
        { status: 400 }
      )
    }

    const { data } = body
    if (!data?.brandId || !data?.name || !data?.website) {
      return NextResponse.json(
        { error: 'Missing required fields: brandId, name, website' },
        { status: 400 }
      )
    }

    // Generate 6-8 angles with some customization based on brand data
    const baseAngles = generateRandomAngles(6)
    
    // Customize angles based on brand tone and audience
    const customizedAngles = baseAngles.map(angle => ({
      ...angle,
      description: angle.description.replace(
        'the brand',
        data.name
      ),
      tonality: data.brandTone 
        ? `${angle.tonality} with ${data.brandTone.split(',')[0].toLowerCase()} approach`
        : angle.tonality
    }))

    const response = {
      angles: customizedAngles
    }

    console.log('✅ Mock Generate Angles Response:', response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Mock Generate Angles Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content angles' },
      { status: 500 }
    )
  }
}