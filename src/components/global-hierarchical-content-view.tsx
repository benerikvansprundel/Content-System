'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useBrandsWithContent } from '@/hooks/use-brands'
import { cacheInvalidation } from '@/hooks/use-content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ContentAngle } from '@/types/database'
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
  Sparkles,
  Globe,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { BrandWithContent } from '@/types/database'

type Brand = BrandWithContent

interface Props {
  brands?: Brand[]
  userId: string
}

export function GlobalHierarchicalContentView({ brands: initialBrands, userId }: Props) {
  // Use SWR for data fetching with caching
  const { brands, isLoading, error, invalidate } = useBrandsWithContent(userId)
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set())
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
      if (brandId) {
        cacheInvalidation.invalidateAllBrandContent(brandId)
      }
      if (angleId && brandId) {
        cacheInvalidation.invalidateAngleContent(angleId, brandId)
      }
      if (ideaId && angleId && brandId) {
        cacheInvalidation.invalidateIdeaContent(ideaId, angleId, brandId)
      }
      
      // Invalidate the main brands cache
      invalidate()
      
      // Trigger a re-render to update the UI
      setRefreshKey(prev => prev + 1)
    }

    window.addEventListener('contentGenerated', handleContentGenerated as EventListener)
    
    return () => {
      window.removeEventListener('contentGenerated', handleContentGenerated as EventListener)
    }
  }, [invalidate])

  const toggleBrand = (brandId: string) => {
    const newExpanded = new Set(expandedBrands)
    if (newExpanded.has(brandId)) {
      newExpanded.delete(brandId)
    } else {
      newExpanded.add(brandId)
    }
    setExpandedBrands(newExpanded)
  }

  const togglePlatform = (platformKey: string) => {
    const newExpanded = new Set(expandedPlatforms)
    if (newExpanded.has(platformKey)) {
      newExpanded.delete(platformKey)
    } else {
      newExpanded.add(platformKey)
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

  const handleGenerateMoreIdeas = async (angleId: string, platform: string, brandId: string) => {
    setGeneratingMore(angleId)
    try {
      router.push(`/brands/${brandId}/ideas?angle=${angleId}&auto=true&platform=${platform}&mode=more`)
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

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading content...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading content: {error.message}</div>
        <Button onClick={() => invalidate()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // Group content by brand, then by platform
  const processedBrands = (brands || []).map(brand => {
    const contentByPlatform = (brand.content_angles || []).reduce((acc, angle) => {
      const platform = angle.platform
      if (!acc[platform]) {
        acc[platform] = []
      }
      acc[platform].push(angle)
      return acc
    }, {} as Record<string, ContentAngle[]>)

    const totalAngles = brand.content_angles?.length || 0
    const totalIdeas = (brand.content_angles || []).reduce((total, angle) => {
      const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
      return total + ideas.length
    }, 0)
    const totalGenerated = (brand.content_angles || []).reduce((total, angle) => {
      const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
      const generatedInAngle = ideas.filter(idea => 
        Boolean(idea.generated_content && idea.generated_content.length > 0)
      ).length
      console.log(`Brand "${brand.name}" - Angle "${angle.header}" has ${generatedInAngle} generated ideas`)
      return total + generatedInAngle
    }, 0)
    
    console.log(`Brand "${brand.name}" totals: ${totalGenerated}/${totalIdeas} generated`)

    return {
      ...brand,
      contentByPlatform,
      totalAngles,
      totalIdeas,
      totalGenerated,
      platforms: Object.keys(contentByPlatform)
    }
  })

  const getTotalIdeasCount = (angles: any[]) => {
    return angles.reduce((total, angle) => {
      const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
      return total + ideas.length
    }, 0)
  }

  const getGeneratedIdeasCount = (angles: any[]) => {
    return angles.reduce((total, angle) => {
      const ideas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
      const generatedCount = ideas.filter(idea => {
        const hasContent = Boolean(idea.generated_content && idea.generated_content.length > 0)
        console.log(`Idea "${idea.topic}" has generated content:`, hasContent, idea.generated_content)
        return hasContent
      }).length
      console.log(`Angle "${angle.header}" has ${generatedCount} generated ideas out of ${ideas.length} total`)
      return total + generatedCount
    }, 0)
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first brand to start generating content strategies and ideas
          </p>
          <Link href="/brands/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Brand
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {processedBrands.map(brand => {
        const isBrandExpanded = expandedBrands.has(brand.id)

        return (
          <Card key={brand.id} className="border-2 border-gray-200">
            <CardHeader className="pb-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleBrand(brand.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">{brand.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {brand.platforms.length} {brand.platforms.length === 1 ? 'platform' : 'platforms'} • {brand.totalAngles} {brand.totalAngles === 1 ? 'angle' : 'angles'} • {brand.totalIdeas} {brand.totalIdeas === 1 ? 'idea' : 'ideas'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {brand.totalGenerated}/{brand.totalIdeas} Generated
                    </div>
                    <div className="text-xs text-gray-500">
                      {brand.totalIdeas - brand.totalGenerated} pending
                    </div>
                  </div>
                  <Link href={`/brands/${brand.id}/strategy`}>
                    <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Content Strategy
                    </Button>
                  </Link>
                  {isBrandExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>
            </CardHeader>

            {isBrandExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {brand.platforms.map(platform => {
                    const angles = brand.contentByPlatform[platform]
                    const totalIdeas = getTotalIdeasCount(angles)
                    const generatedIdeas = getGeneratedIdeasCount(angles)
                    const platformKey = `${brand.id}-${platform}`
                    const isPlatformExpanded = expandedPlatforms.has(platformKey)

                    return (
                      <Card key={platform} className={`${getPlatformColor(platform)} border-2 ml-4`}>
                        <CardHeader className="pb-3">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => togglePlatform(platformKey)}
                          >
                            <div className="flex items-center gap-3">
                              {getPlatformIcon(platform)}
                              <div>
                                <CardTitle className="text-lg capitalize">{platform}</CardTitle>
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
                              {isPlatformExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                          </div>
                        </CardHeader>

                        {isPlatformExpanded && (
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
                                              handleGenerateMoreIdeas(angle.id, angle.platform, brand.id)
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
                                              onClick={() => handleGenerateMoreIdeas(angle.id, angle.platform, brand.id)}
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
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}