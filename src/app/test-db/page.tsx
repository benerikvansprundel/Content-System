'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDBPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testConnection = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test 1: Check auth
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
      
      // Test 2: Check database connection
      const { data: brands, error: dbError } = await supabase
        .from('brands')
        .select('count(*)')
      
      if (dbError) {
        setResult(prev => prev + `❌ Database Error: ${dbError.message}\n`)
        setResult(prev => prev + `Error details: ${JSON.stringify(dbError, null, 2)}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Database connection successful\n`)
      setResult(prev => prev + `Brands table accessible: ${JSON.stringify(brands)}\n`)
      
      // Test 3: Try to insert a test record
      const testBrand = {
        user_id: user.id,
        name: 'Test Brand',
        website: 'https://test.com',
        additional_info: 'Test info',
        target_audience: 'Test audience',
        brand_tone: 'Test tone',
        key_offer: 'Test offer',
        image_guidelines: 'Test guidelines'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('brands')
        .insert([testBrand])
        .select()
      
      if (insertError) {
        setResult(prev => prev + `❌ Insert Error: ${insertError.message}\n`)
        setResult(prev => prev + `Insert error details: ${JSON.stringify(insertError, null, 2)}\n`)
        return
      }
      
      setResult(prev => prev + `✅ Test brand created successfully: ${JSON.stringify(insertData)}\n`)
      
      // Clean up: delete the test record
      if (insertData && insertData[0]) {
        const { error: deleteError } = await supabase
          .from('brands')
          .delete()
          .eq('id', insertData[0].id)
        
        if (deleteError) {
          setResult(prev => prev + `⚠️ Warning: Could not delete test record: ${deleteError.message}\n`)
        } else {
          setResult(prev => prev + `✅ Test record cleaned up successfully\n`)
        }
      }
      
    } catch (error) {
      setResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? 'Testing...' : 'Test Database Connection'}
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