import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GlobalHierarchicalContentView } from '@/components/global-hierarchical-content-view'
import { ToastProvider } from '@/components/toast-provider'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ContentPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get all brands with their content angles and ideas
  const { data: brands } = await supabase
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
            created_at,
            content
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen main-content">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="content-header">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-3">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="content-title">Content Management Hub</h1>
            <p className="content-subtitle">Manage content across all your brands, platforms, and ideas</p>
          </div>
          <Link href="/brands/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Brand
            </Button>
          </Link>
        </div>

        <GlobalHierarchicalContentView brands={brands || []} userId={user.id} />
        <ToastProvider />
      </div>
    </div>
  )
}