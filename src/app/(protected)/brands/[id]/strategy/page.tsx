import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
// import { Brand } from '@/types/database' // Type used in async function parameters
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { StrategyGenerator } from '@/components/strategy-generator'
import { StrategyAnglesList } from '@/components/strategy-angles-list'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StrategyPage({ params: paramsPromise }: Props) {
  const params = await paramsPromise
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!brand) {
    redirect('/dashboard')
  }

  const { data: existingAngles } = await supabase
    .from('content_angles')
    .select('*')
    .eq('brand_id', params.id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">{brand.name}</h1>
            </div>
            <Badge variant="secondary">{brand.website}</Badge>
          </div>
        </div>

        {existingAngles && existingAngles.length > 0 ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Content Strategy Angles</h2>
              <StrategyGenerator brand={brand} />
            </div>
            
            <StrategyAnglesList angles={existingAngles} brandId={brand.id} />
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generate Content Strategy
              </h3>
              <p className="text-gray-600 mb-6">
                Create AI-powered content angles for {brand.name} to guide your content creation
              </p>
              <StrategyGenerator brand={brand} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}