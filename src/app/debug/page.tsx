'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Environment Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
                <span className="ml-2 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
                <span className="ml-2 font-mono text-sm">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div>
                <strong>N8N_WEBHOOK_URL:</strong> 
                <span className="ml-2 font-mono text-sm">
                  {process.env.N8N_WEBHOOK_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              
              {typeof window !== 'undefined' && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <h3 className="font-semibold mb-2">URL Check:</h3>
                  <div>
                    <strong>Supabase URL:</strong> 
                    <span className="ml-2 text-sm break-all">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL}
                    </span>
                  </div>
                  <div>
                    <strong>Anon Key (first 20 chars):</strong> 
                    <span className="ml-2 text-sm">
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}