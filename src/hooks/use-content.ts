'use client'

import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import { ContentAngleWithIdeas, ContentIdeaWithGenerated, GeneratedContent } from '@/types/database'

// Fetcher for content angles
const fetchContentAngles = async (brandId: string, platform?: string) => {
  const supabase = createClient()
  
  let query = supabase
    .from('content_angles')
    .select(`
      *,
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
          content,
          image_url
        )
      )
    `)
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false })

  if (platform) {
    query = query.eq('platform', platform)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch content angles: ${error.message}`)
  }

  return data as ContentAngleWithIdeas[]
}

// Fetcher for content ideas
const fetchContentIdeas = async (angleId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
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
    .eq('angle_id', angleId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch content ideas: ${error.message}`)
  }

  return data as ContentIdeaWithGenerated[]
}

// Fetcher for generated content
const fetchGeneratedContent = async (ideaId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('generated_content')
    .select('*')
    .eq('idea_id', ideaId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch generated content: ${error.message}`)
  }

  return data as GeneratedContent[]
}

// Hook for content angles
export function useContentAngles(brandId: string, platform?: string) {
  const cacheKey = `content-angles-${brandId}${platform ? `-${platform}` : ''}`
  
  const { data, error, mutate: mutateAngles, isLoading } = useSWR(
    brandId ? cacheKey : null,
    () => fetchContentAngles(brandId, platform),
    {
      revalidateOnFocus: false,
      dedupingInterval: 3 * 60 * 1000, // 3 minutes
    }
  )

  return {
    angles: data,
    isLoading,
    error,
    mutate: mutateAngles,
    invalidate: () => mutateAngles(),
    // Helper to invalidate related caches
    invalidateRelated: () => {
      mutateAngles()
      mutate(`brands-content-${brandId}`) // Invalidate parent brand cache
    }
  }
}

// Hook for content ideas
export function useContentIdeas(angleId: string) {
  const cacheKey = `content-ideas-${angleId}`
  
  const { data, error, mutate: mutateIdeas, isLoading } = useSWR(
    angleId ? cacheKey : null,
    () => fetchContentIdeas(angleId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
    }
  )

  return {
    ideas: data,
    isLoading,
    error,
    mutate: mutateIdeas,
    invalidate: () => mutateIdeas(),
    // Helper to get idea counts
    getCounts: () => {
      if (!data) return { total: 0, generated: 0, pending: 0 }
      
      const total = data.length
      const generated = data.filter(idea => 
        Boolean(idea.generated_content && idea.generated_content.length > 0)
      ).length
      const pending = total - generated
      
      return { total, generated, pending }
    }
  }
}

// Hook for generated content
export function useGeneratedContent(ideaId: string) {
  const cacheKey = `generated-content-${ideaId}`
  
  const { data, error, mutate: mutateContent, isLoading } = useSWR(
    ideaId ? cacheKey : null,
    () => fetchGeneratedContent(ideaId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1 * 60 * 1000, // 1 minute
    }
  )

  return {
    content: data,
    latestContent: data && data.length > 0 ? data[0] : null,
    isLoading,
    error,
    mutate: mutateContent,
    invalidate: () => mutateContent(),
    hasContent: data && data.length > 0
  }
}

// Global cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate all content-related caches for a brand
  invalidateAllBrandContent: (brandId: string) => {
    mutate(`brands-content-${brandId}`)
    mutate(`content-angles-${brandId}`)
    // Invalidate all platform-specific caches
    ['twitter', 'linkedin', 'newsletter'].forEach(platform => {
      mutate(`content-angles-${brandId}-${platform}`)
    })
  },
  
  // Invalidate content for a specific angle
  invalidateAngleContent: (angleId: string, brandId: string) => {
    mutate(`content-ideas-${angleId}`)
    mutate(`brands-content-${brandId}`)
  },
  
  // Invalidate content for a specific idea
  invalidateIdeaContent: (ideaId: string, angleId: string, brandId: string) => {
    mutate(`generated-content-${ideaId}`)
    mutate(`content-ideas-${angleId}`)
    mutate(`brands-content-${brandId}`)
  }
}