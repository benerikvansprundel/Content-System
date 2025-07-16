import { NextRequest, NextResponse } from 'next/server'

// n8n Integration Endpoint
// Routes requests to either mock API (development) or real n8n webhook (production)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔄 n8n Router - Request:', JSON.stringify(body, null, 2))
    
    // Use environment variable for n8n webhook URL, fallback to mock
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
    const targetUrl = n8nWebhookUrl || `${baseUrl}/api/mock-n8n`
    
    console.log('🎯 Target URL:', targetUrl)
    console.log('🔧 Using n8n:', !!n8nWebhookUrl)
    
    // Forward request to n8n or mock API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required n8n authentication headers here
        ...(process.env.N8N_WEBHOOK_AUTH_HEADER && {
          'Authorization': process.env.N8N_WEBHOOK_AUTH_HEADER
        }),
      },
      body: JSON.stringify(body),
    })

    // Handle response parsing with error checking
    let responseData
    const responseText = await response.text()
    
    console.log('📄 Raw response text:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''))
    
    try {
      if (responseText.trim() === '') {
        throw new Error('Empty response from n8n webhook')
      }
      responseData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      console.error('📄 Full response text:', responseText)
      return NextResponse.json(
        { 
          error: 'Invalid JSON response from n8n webhook',
          details: `Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          rawResponse: responseText.substring(0, 200)
        },
        { status: 502 }
      )
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, responseData)
      
      // If n8n fails and we have fallback enabled, try mock API
      if (n8nWebhookUrl && process.env.FALLBACK_TO_MOCK === 'true') {
        console.log('🔄 Falling back to mock API...')
        try {
          const mockResponse = await fetch(`${baseUrl}/api/mock-n8n`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          const mockData = await mockResponse.json()
          console.log('✅ Mock API Response:', mockData)
          return NextResponse.json(mockData)
        } catch (mockError) {
          console.error('❌ Mock API also failed:', mockError)
        }
      }
      
      return NextResponse.json(
        { 
          error: responseData.error || 'API request failed',
          details: `Status: ${response.status}`,
          service: n8nWebhookUrl ? 'n8n' : 'mock'
        },
        { status: response.status }
      )
    }

    console.log('✅ API Response:', responseData)
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ n8n Router Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to AI service',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}