'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cacheInvalidation } from '@/hooks/use-content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronRight, 
  Twitter, 
  Linkedin, 
  Mail, 
  Zap, 
  Lightbulb, 
  CheckCircle,
  Clock,
  Plus,
  FileText,
  Calendar,
  Eye,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

import { BrandWithContent } from '@/types/database'

type Brand = BrandWithContent

interface Props {
  brand: Brand
}

export function HierarchicalContentView({ brand }: Props) {
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set())
  const [expandedAngles, setExpandedAngles] = useState<Set<string>>(new Set())
  const [generatingMore, setGeneratingMore] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleContentGenerated = (event: CustomEvent) => {
      console.log('🔄 Content generated event received:', event.detail)
      const { ideaId, brandId, angleId } = event.detail
      
      // Invalidate specific caches for real-time updates
      if (brandId && brandId === brand.id) {
        cacheInvalidation.invalidateAllBrandContent(brandId)
        if (angleId) {
          cacheInvalidation.invalidateAngleContent(angleId, brandId)
        }
        if (ideaId && angleId) {
          cacheInvalidation.invalidateIdeaContent(ideaId, angleId, brandId)
        }
        
        // Trigger a re-render to update the UI
        setRefreshKey(prev => prev + 1)
        // Also refresh the router to get latest data
        setTimeout(() => router.refresh(), 500)
      }
    }

    window.addEventListener('contentGenerated', handleContentGenerated as EventListener)
    
    return () => {
      window.removeEventListener('contentGenerated', handleContentGenerated as EventListener)
    }
  }, [brand.id, router])

  // Group content by platform
  const contentByPlatform = (brand.content_angles || []).reduce((acc, angle) => {
    const platform = angle.platform
    if (!acc[platform]) {
      acc[platform] = []
    }
    acc[platform].push(angle)
    return acc
  }, {} as Record<string, ContentAngle[]>)

  const platforms = Object.keys(contentByPlatform)

  const togglePlatform = (platform: string) => {
    const newExpanded = new Set(expandedPlatforms)
    if (newExpanded.has(platform)) {
      newExpanded.delete(platform)
    } else {
      newExpanded.add(platform)
    }
    setExpandedPlatforms(newExpanded)
  }

  const toggleAngle = (angleId: string) => {
    const newExpanded = new Set(expandedAngles)
    if (newExpanded.has(angleId)) {
      newExpanded.delete(angleId)
    } else {
      newExpanded.add(angleId)
    }
    setExpandedAngles(newExpanded)
  }

  const handleGenerateMoreIdeas = async (angleId: string, platform: string) => {
    setGeneratingMore(angleId)
    try {
      router.push(`/brands/${brand.id}/ideas?angle=${angleId}&auto=true&platform=${platform}&mode=more`)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setGeneratingMore(null)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-5 h-5" />
      case 'linkedin': return <Linkedin className="w-5 h-5" />
      case 'newsletter': return <Mail className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'linkedin': return 'bg-indigo-50 border-indigo-200 text-indigo-900'
      case 'newsletter': return 'bg-green-50 border-green-200 text-green-900'
      default: return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  const getIdeaBadgeColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'linkedin': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'newsletter': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTotalIdeasCount = (angles: any[]) => {
    return angles.reduce((total, angle) => {
      const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
      return total + ideas.length
    }, 0)
  }

  const getGeneratedIdeasCount = (angles: any[]) => {
    return angles.reduce((total, angle) => {
      const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
      const generatedCount = ideas.filter(idea => 
        Boolean(idea.generated_content && idea.generated_content.length > 0)
      ).length
      return total + generatedCount
    }, 0)
  }

  if (platforms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content strategies yet</h3>
          <p className="text-gray-600 mb-6">
            Create content angles to start generating ideas and content
          </p>
          <Link href={`/brands/${brand.id}/strategy`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Content Strategy
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {platforms.map(platform => {
        const angles = contentByPlatform[platform]
        const totalIdeas = getTotalIdeasCount(angles)
        const generatedIdeas = getGeneratedIdeasCount(angles)
        const isExpanded = expandedPlatforms.has(platform)

        return (
          <Card key={platform} className={`${getPlatformColor(platform)} border-2`}>
            <CardHeader className="pb-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => togglePlatform(platform)}
              >
                <div className="flex items-center gap-3">
                  {getPlatformIcon(platform)}
                  <div>
                    <CardTitle className="text-xl capitalize">{platform}</CardTitle>
                    <p className="text-sm opacity-75">
                      {angles.length} {angles.length === 1 ? 'angle' : 'angles'} • {totalIdeas} {totalIdeas === 1 ? 'idea' : 'ideas'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {generatedIdeas}/{totalIdeas} Generated
                    </div>
                    <div className="text-xs opacity-75">
                      {totalIdeas - generatedIdeas} pending
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {angles.map(angle => {
                    const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
                    const generatedCount = ideas.filter(idea => Boolean(idea.generated_content && idea.generated_content.length > 0)).length
                    const isAngleExpanded = expandedAngles.has(angle.id)

                    return (
                      <Card key={angle.id} className="bg-white border border-gray-200 ml-4">
                        <CardHeader className="pb-2">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleAngle(angle.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Zap className="w-4 h-4 text-orange-600" />
                              <div>
                                <CardTitle className="text-base font-medium">{angle.header}</CardTitle>
                                <p className="text-sm text-gray-600">
                                  {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} • {generatedCount} generated
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleGenerateMoreIdeas(angle.id, angle.platform)
                                }}
                                disabled={generatingMore === angle.id}
                                className="px-3"
                              >
                                {generatingMore === angle.id ? (
                                  <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </Button>
                              {isAngleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </div>
                        </CardHeader>

                        {isAngleExpanded && (
                          <CardContent className="pt-0">
                            {ideas.length > 0 ? (
                              <div className="space-y-2">
                                {ideas.map(idea => {
                                  const hasContent = Boolean(idea.generated_content && idea.generated_content.length > 0)
                                  const latestContent = hasContent ? idea.generated_content[0] : null

                                  return (
                                    <div key={idea.id} className="border border-gray-100 rounded-lg p-3 ml-4 bg-gray-50">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="relative">
                                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                                            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${hasContent ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                          </div>
                                          <span className="font-medium text-sm">{idea.topic}</span>
                                          <Badge className={`${getIdeaBadgeColor(idea.platform)} text-xs px-2 py-1`}>
                                            {idea.platform}
                                          </Badge>
                                          <div className="flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <span className={`text-xs font-medium ${hasContent ? 'text-green-600' : 'text-yellow-600'}`}>
                                              {hasContent ? 'Generated' : 'Pending'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-500">
                                            {new Date(idea.created_at).toLocaleDateString()}
                                          </span>
                                          <Link href={`/brands/${brand.id}/content/${idea.id}`}>
                                            <Button size="sm" variant="outline">
                                              {hasContent ? (
                                                <>
                                                  <Eye className="w-3 h-3 mr-1" />
                                                  View
                                                </>
                                              ) : (
                                                <>
                                                  <Sparkles className="w-3 h-3 mr-1" />
                                                  Generate
                                                </>
                                              )}
                                            </Button>
                                          </Link>
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                        {idea.description}
                                      </p>
                                      {latestContent && (
                                        <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                                          <p className="text-xs text-gray-600 line-clamp-2">
                                            {latestContent.content}
                                          </p>
                                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            Generated {new Date(latestContent.created_at).toLocaleDateString()}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No ideas yet</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => handleGenerateMoreIdeas(angle.id, angle.platform)}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Generate Ideas
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}