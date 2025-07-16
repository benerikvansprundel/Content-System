import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ContentIdea } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Image as ImageIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ContentGenerator } from '@/components/content-generator'
import { ContentViewer } from '@/components/content-viewer'

interface Props {
  params: Promise<{ id: string, ideaId: string }>
}

export default async function ContentPage({ params: paramsPromise }: Props) {
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

  const { data: idea } = await supabase
    .from('content_ideas')
    .select('*')
    .eq('id', params.ideaId)
    .single()

  if (!idea) {
    redirect(`/brands/${params.id}/ideas`)
  }

  const { data: angle } = await supabase
    .from('content_angles')
    .select('*')
    .eq('id', idea.angle_id)
    .single()

  if (!angle) {
    redirect(`/brands/${params.id}/ideas`)
  }

  const { data: existingContent } = await supabase
    .from('generated_content')
    .select('*')
    .eq('idea_id', params.ideaId)
    .single()

  return (
    <div className="min-h-screen main-content">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="content-header">
          <div>
            <Link href={`/brands/${params.id}/ideas?angle=${idea.angle_id}`}>
              <Button variant="ghost" size="sm" className="mb-3">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Ideas
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h1 className="content-title">{idea.topic}</h1>
              </div>
              <Badge variant="outline" className="capitalize status-badge">{idea.platform}</Badge>
            </div>
            <p className="content-subtitle mt-1">Content generation and editing workspace</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="detail-panel">
            <div className="detail-header">
              <h2 className="detail-title flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Content Brief
              </h2>
            </div>
            <div className="detail-meta">
              <div className="detail-meta-item">
                <span className="detail-meta-label">Topic:</span>
                <span className="detail-meta-value">{idea.topic}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Platform:</span>
                <Badge variant="secondary" className="status-badge">{idea.platform}</Badge>
              </div>
              <div className="space-y-2">
                <span className="detail-meta-label block">Description:</span>
                <p className="text-sm text-gray-600 leading-relaxed">{idea.description}</p>
              </div>
              <div className="space-y-2">
                <span className="detail-meta-label block">Image Prompt:</span>
                <p className="text-sm text-gray-500 leading-relaxed">{idea.image_prompt}</p>
              </div>
            </div>
          </div>

          <div className="detail-panel">
            <div className="detail-header">
              <h2 className="detail-title">Generated Content</h2>
            </div>
            <div>
              {existingContent ? (
                <div className="space-y-4">
                  <ContentViewer content={existingContent} />
                  <div className="pt-4 border-t border-gray-200">
                    <ContentGenerator 
                      brand={brand} 
                      angle={angle} 
                      idea={idea}
                      variant="outline"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Generate Content
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create AI-powered content and image for this idea
                  </p>
                  <ContentGenerator 
                    brand={brand} 
                    angle={angle} 
                    idea={idea}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}