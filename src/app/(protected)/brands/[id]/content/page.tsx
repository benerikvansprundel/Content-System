import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { HierarchicalContentView } from '@/components/hierarchical-content-view'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BrandContentPage({ params: paramsPromise }: Props) {
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

  // Get all content angles, ideas, and generated content for this brand
  const { data: brandWithContent } = await supabase
    .from('brands')
    .select(`
      *,
      content_angles (
        id,
        header,
        platform,
        description,
        tonality,
        objective,
        content_ideas (
          id,
          topic,
          description,
          platform,
          image_prompt,
          created_at,
          generated_content (
            id,
            content,
            created_at
          )
        )
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!brandWithContent) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen main-content">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="content-header">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-3">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="content-title">{brand.name} - Content Hub</h1>
            <p className="content-subtitle">Manage content across platforms, angles, and ideas</p>
          </div>
          <Link href={`/brands/${params.id}/strategy`}>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Content Strategy
            </Button>
          </Link>
        </div>

        <HierarchicalContentView brand={brandWithContent} />
      </div>
    </div>
  )
}