'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestGeneratedContentPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testGeneratedContentTable = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test 1: Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        setResult(`Auth Error: ${authError.message}`)
        return
      }
      
      if (!user) {
        setResult('No authenticated user found')
        return
      }
      
      setResult(`✅ User authenticated: ${user.email}\n`)
      
      // Test 2: Check if generated_content table exists and is accessible
      const { data: existingContent, error: selectError } = await supabase
        .from('generated_content')
        .select('*')
        .limit(1)
      
      if (selectError) {
        setResult(prev => prev + `❌ Generated Content Select Error: ${selectError.message}\n`)
        setResult(prev => prev + `Error details: ${JSON.stringify(selectError, null, 2)}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Generated content table accessible\n`)
      setResult(prev => prev + `Existing content count: ${existingContent?.length || 0}\n`)
      
      // Test 3: First, we need to create a brand, angle, and idea to test with
      setResult(prev => prev + `🔧 Creating test data structure...\n`)
      
      // Create a test brand
      const { data: testBrand, error: brandError } = await supabase
        .from('brands')
        .insert([{
          user_id: user.id,
          name: 'Test Brand for Content',
          website: 'https://test.com',
          target_audience: 'Test audience',
          brand_tone: 'Test tone',
          key_offer: 'Test offer'
        }])
        .select()
        .single()
      
      if (brandError) {
        setResult(prev => prev + `❌ Test Brand Creation Error: ${brandError.message}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Test brand created: ${testBrand.id}\n`)
      
      // Create a test angle
      const { data: testAngle, error: angleError } = await supabase
        .from('content_angles')
        .insert([{
          brand_id: testBrand.id,
          platform: 'twitter',
          header: 'Test Angle',
          description: 'Test angle description',
          tonality: 'Test tonality',
          objective: 'test_objective'
        }])
        .select()
        .single()
      
      if (angleError) {
        setResult(prev => prev + `❌ Test Angle Creation Error: ${angleError.message}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Test angle created: ${testAngle.id}\n`)
      
      // Create a test idea
      const { data: testIdea, error: ideaError } = await supabase
        .from('content_ideas')
        .insert([{
          angle_id: testAngle.id,
          platform: 'twitter',
          topic: 'Test Topic',
          description: 'Test idea description',
          image_prompt: 'Test image prompt'
        }])
        .select()
        .single()
      
      if (ideaError) {
        setResult(prev => prev + `❌ Test Idea Creation Error: ${ideaError.message}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Test idea created: ${testIdea.id}\n`)
      
      // Test 4: Now try to insert generated content
      const testContent = {
        idea_id: testIdea.id,
        brand_id: testBrand.id,
        platform: 'twitter',
        content: 'This is test generated content',
        image_url: 'https://test-image.com/test.jpg'
      }
      
      setResult(prev => prev + `🧪 Testing generated content insert...\n`)
      
      const { data: insertResult, error: insertError } = await supabase
        .from('generated_content')
        .insert([testContent])
        .select()
      
      if (insertError) {
        setResult(prev => prev + `❌ Generated Content Insert Error: ${insertError.message}\n`)
        setResult(prev => prev + `Error details: ${JSON.stringify(insertError, null, 2)}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Generated content inserted successfully: ${JSON.stringify(insertResult)}\n`)
      
      // Test 5: Test upsert functionality
      setResult(prev => prev + `🧪 Testing upsert functionality...\n`)
      
      const { data: upsertResult, error: upsertError } = await supabase
        .from('generated_content')
        .upsert({
          idea_id: testIdea.id,
          brand_id: testBrand.id,
          platform: 'twitter',
          content: 'This is updated test content',
          image_url: 'https://test-image.com/updated.jpg'
        }, {
          onConflict: 'idea_id'
        })
        .select()
      
      if (upsertError) {
        setResult(prev => prev + `❌ Generated Content Upsert Error: ${upsertError.message}\n`)
        setResult(prev => prev + `Error details: ${JSON.stringify(upsertError, null, 2)}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Generated content upserted successfully: ${JSON.stringify(upsertResult)}\n`)
      
      // Clean up: delete test data
      setResult(prev => prev + `🧹 Cleaning up test data...\n`)
      
      await supabase.from('generated_content').delete().eq('brand_id', testBrand.id)
      await supabase.from('content_ideas').delete().eq('id', testIdea.id)
      await supabase.from('content_angles').delete().eq('id', testAngle.id)
      await supabase.from('brands').delete().eq('id', testBrand.id)
      
      setResult(prev => prev + `✅ Test data cleaned up successfully\n`)
      setResult(prev => prev + `\n🎉 All generated content tests passed!\n`)
      
    } catch (error) {
      setResult(prev => prev + `❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
      console.error('Test error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Generated Content Table Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testGeneratedContentTable} disabled={loading}>
              {loading ? 'Testing...' : 'Test Generated Content Operations'}
            </Button>
            
            {result && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}