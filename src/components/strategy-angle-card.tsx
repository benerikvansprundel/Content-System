'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, ChevronDown, ChevronUp, Trash2, Edit } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ContentAngle } from '@/types/database'
import { cleanAndTruncateDescription, formatObjectiveText } from '@/lib/text-utils'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog'
import { GenerateIdeasButton } from '@/components/generate-ideas-button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  angle: ContentAngle
  brandId: string
}

export function StrategyAngleCard({ angle, brandId }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { truncated, fullMarkdown, isTruncated } = cleanAndTruncateDescription(angle.description, 150)
  const cleanObjective = formatObjectiveText(angle.objective)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('content_angles')
        .delete()
        .eq('id', angle.id)

      if (error) throw error
      
      router.refresh()
    } catch (error) {
      console.error('Error deleting angle:', error)
      alert('Failed to delete content angle. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'linkedin': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'newsletter': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 group w-full max-w-none">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl font-semibold leading-tight text-gray-900">{angle.header}</CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={`${getPlatformColor(angle.platform)} font-medium px-3 py-1`}>
                {angle.platform}
              </Badge>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-5">
            {/* Description */}
            <div>
              {isExpanded ? (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed mb-3">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                    }}
                  >
                    {fullMarkdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed text-base">
                  {truncated}
                </p>
              )}
              {isTruncated && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Objective */}
            {cleanObjective && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Objective</p>
                <p className="text-sm text-blue-800 leading-relaxed">{cleanObjective}</p>
              </div>
            )}

            {/* Bottom section */}
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
              {/* Tonality section */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Brand Voice & Tonality</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {angle.tonality}
                  </p>
                </div>
              </div>
              
              {/* Action button */}
              <div className="flex justify-end">
                <GenerateIdeasButton brandId={brandId} angle={angle} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Content Angle"
        description="Are you sure you want to delete this content angle?"
        itemName={angle.header}
        cascadeInfo="This will also delete all related content ideas and generated content."
      />
    </>
  )
}