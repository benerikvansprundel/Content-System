'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Lightbulb, 
  FileText, 
  Twitter, 
  Linkedin, 
  Mail, 
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface Brand {
  id: string
  name: string
  website: string
  content_angles: ContentAngle[]
}

interface ContentAngle {
  id: string
  header: string
  platform: string
  description: string
  tonality: string
  objective: string
  content_ideas: ContentIdea[]
}

interface ContentIdea {
  id: string
  topic: string
  description: string
  platform: string
  image_prompt: string
  created_at: string
  generated_content: { id: string; created_at: string }[]
}

interface Props {
  brands: Brand[]
}

export function ContentIdeasHub({ brands }: Props) {
  const [currentView, setCurrentView] = useState<'platforms' | 'angles' | 'ideas'>('ideas')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [generatingMore, setGeneratingMore] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Flatten all ideas from all brands and angles
  const allIdeas = useMemo(() => {
    return brands.flatMap(brand =>
      (brand.content_angles || []).flatMap(angle =>
        (angle.content_ideas || []).map(idea => ({
          ...idea,
          brandId: brand.id,
          brandName: brand.name,
          angleId: angle.id,
          angleHeader: angle.header,
          angleDescription: angle.description,
          angleTonality: angle.tonality,
          angleObjective: angle.objective,
          hasContent: (idea.generated_content || []).length > 0
        }))
      )
    )
  }, [brands])

  // Process angles data
  const allAngles = useMemo(() => {
    return brands.flatMap(brand =>
      (brand.content_angles || []).map(angle => ({
        ...angle,
        brandId: brand.id,
        brandName: brand.name,
        ideasCount: (angle.content_ideas || []).length,
        generatedCount: (angle.content_ideas || []).filter(idea => 
          (idea.generated_content || []).length > 0
        ).length
      }))
    )
  }, [brands])

  // Process platform data
  const platformData = useMemo(() => {
    const platforms = ['twitter', 'linkedin', 'newsletter']
    return platforms.map(platform => {
      const platformIdeas = allIdeas.filter(idea => idea.platform === platform)
      const generatedCount = platformIdeas.filter(idea => idea.hasContent).length
      return {
        platform,
        ideasCount: platformIdeas.length,
        generatedCount,
        pendingCount: platformIdeas.length - generatedCount
      }
    })
  }, [allIdeas])

  // Filter ideas based on search and filters
  const filteredIdeas = useMemo(() => {
    return allIdeas.filter(idea => {
      const matchesSearch = searchQuery === '' || 
        idea.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.angleHeader.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPlatform = selectedPlatform === 'all' || idea.platform === selectedPlatform

      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'generated' && idea.hasContent) ||
        (selectedStatus === 'pending' && !idea.hasContent)

      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [allIdeas, searchQuery, selectedPlatform, selectedStatus])

  // Platform counts
  const platformCounts = useMemo(() => {
    const counts = { all: allIdeas.length, twitter: 0, linkedin: 0, newsletter: 0 }
    allIdeas.forEach(idea => {
      if (idea.platform in counts) {
        counts[idea.platform as keyof typeof counts]++
      }
    })
    return counts
  }, [allIdeas])

  const handleGenerateMoreIdeas = async (angleId: string, platform: string, brandData: any) => {
    setGeneratingMore(angleId)
    try {
      // Navigate to ideas page with auto-generate for more ideas
      router.push(`/brands/${brandData.brandId}/ideas?angle=${angleId}&auto=true&platform=${platform}&mode=more`)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setGeneratingMore(null)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />
      case 'linkedin': return <Linkedin className="w-4 h-4" />
      case 'newsletter': return <Mail className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
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

  if (allIdeas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content ideas yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first brand and generate some content angles to see ideas here
          </p>
          <Link href="/dashboard">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === 'platforms' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('platforms')}
          >
            <Twitter className="w-4 h-4 mr-2" />
            Social Media
          </Button>
          <Button
            variant={currentView === 'angles' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('angles')}
          >
            <Zap className="w-4 h-4 mr-2" />
            Angles
          </Button>
          <Button
            variant={currentView === 'ideas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('ideas')}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Content Ideas
          </Button>
        </div>
      </div>

      {/* Filters and Search (only show for ideas view) */}
      {currentView === 'ideas' && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ideas, brands, or angles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Not Generated</option>
              <option value="generated">Has Content</option>
            </select>
          </div>
        </div>
      )}

      {/* Render different views */}
      {currentView === 'platforms' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media Platforms</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {platformData.map((platform) => (
              <Card key={platform.platform} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getPlatformColor(platform.platform)}`}>
                      {getPlatformIcon(platform.platform)}
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">{platform.platform}</CardTitle>
                      <p className="text-sm text-gray-600">{platform.ideasCount} ideas</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Generated:</span>
                      <span className="text-sm font-medium text-green-600">{platform.generatedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="text-sm font-medium text-yellow-600">{platform.pendingCount}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => {
                      setSelectedPlatform(platform.platform)
                      setCurrentView('ideas')
                    }}
                  >
                    View {platform.platform} Ideas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentView === 'angles' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content Strategy Angles</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {allAngles.map((angle) => (
              <Card key={angle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight">{angle.header}</CardTitle>
                    <Badge className={`${getPlatformColor(angle.platform)} text-xs px-2 py-1`}>
                      {getPlatformIcon(angle.platform)}
                      <span className="ml-1 capitalize">{angle.platform}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{angle.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{angle.brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ideas:</span>
                      <span className="text-sm font-medium">{angle.ideasCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Generated:</span>
                      <span className="text-sm font-medium text-green-600">{angle.generatedCount}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/brands/${angle.brandId}/ideas?angle=${angle.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Ideas
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateMoreIdeas(angle.id, angle.platform, {
                        brandId: angle.brandId,
                        name: angle.brandName
                      })}
                      disabled={generatingMore === angle.id}
                      className="px-3"
                    >
                      {generatingMore === angle.id ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentView === 'ideas' && (
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All ({platformCounts.all})
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              {platformCounts.twitter}
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              {platformCounts.linkedin}
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {platformCounts.newsletter}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedPlatform} className="mt-6">
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredIdeas.length} of {allIdeas.length} content ideas
            </div>

            {filteredIdeas.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIdeas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base leading-tight">{idea.topic}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Badge className={`${getPlatformColor(idea.platform)} text-xs px-2 py-1`}>
                            {getPlatformIcon(idea.platform)}
                            <span className="ml-1 capitalize">{idea.platform}</span>
                          </Badge>
                          {idea.hasContent && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {!idea.hasContent && (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {idea.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">{idea.brandName}</span>
                          <span>•</span>
                          <span>{idea.angleHeader}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/brands/${idea.brandId}/content/${idea.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            {idea.hasContent ? 'View Content' : 'Generate Content'}
                          </Button>
                        </Link>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateMoreIdeas(idea.angleId, idea.platform, {
                            brandId: idea.brandId,
                            name: idea.brandName
                          })}
                          disabled={generatingMore === idea.angleId}
                          className="px-3"
                          title="Generate more ideas for this angle"
                        >
                          {generatingMore === idea.angleId ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No ideas found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find more content ideas
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}