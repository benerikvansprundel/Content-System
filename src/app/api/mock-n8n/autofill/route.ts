import { NextRequest, NextResponse } from 'next/server'
import { getAutofillData } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    // Add realistic delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const body = await request.json()
    console.log('🤖 Mock Autofill API Called:', body)

    // Validate request structure
    if (body.identifier !== 'autofill') {
      return NextResponse.json(
        { error: 'Invalid identifier' },
        { status: 400 }
      )
    }

    const { data } = body
    if (!data?.website || !data?.name) {
      return NextResponse.json(
        { error: 'Missing required fields: website, name' },
        { status: 400 }
      )
    }

    // Generate response based on website
    const autofillData = getAutofillData(data.website)
    
    // Add some variation based on additional info
    if (data.additionalInfo) {
      autofillData.targetAudience += ` with specific focus on ${data.additionalInfo.toLowerCase()}`
    }

    const response = {
      targetAudience: autofillData.targetAudience,
      brandTone: autofillData.brandTone,
      keyOffer: autofillData.keyOffer
    }

    console.log('✅ Mock Autofill Response:', response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Mock Autofill Error:', error)
    return NextResponse.json(
      { error: 'Failed to process autofill request' },
      { status: 500 }
    )
  }
}