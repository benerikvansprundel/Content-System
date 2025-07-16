import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { IdeasPageContent } from '@/components/ideas-page-content'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ angle?: string }>
}

export default async function IdeasPage({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
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

  const { data: angles } = await supabase
    .from('content_angles')
    .select('*')
    .eq('brand_id', params.id)

  const selectedAngle = searchParams.angle 
    ? angles?.find(angle => angle.id === searchParams.angle)
    : angles?.[0]

  if (!selectedAngle) {
    redirect(`/brands/${params.id}/strategy`)
  }

  const { data: ideas } = await supabase
    .from('content_ideas')
    .select(`
      *,
      generated_content (
        id,
        created_at,
        content,
        image_url
      )
    `)
    .eq('angle_id', selectedAngle.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen main-content">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="content-header">
          <div>
            <Link href={`/brands/${params.id}/content`}>
              <Button variant="ghost" size="sm" className="mb-3">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Content Hub
              </Button>
            </Link>
            <h1 className="content-title">{brand.name} - Content Ideas</h1>
            <p className="content-subtitle">Generate and manage content ideas for {selectedAngle.header}</p>
          </div>
        </div>

        <IdeasPageContent 
          brand={brand}
          angles={angles || []}
          selectedAngle={selectedAngle}
          initialIdeas={ideas || []}
        />
      </div>
    </div>
  )
}