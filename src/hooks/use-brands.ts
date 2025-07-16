'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { cacheKeys } from '@/lib/swr-config'
import { Brand, BrandWithContent } from '@/types/database'

// Custom fetcher for brands with full content hierarchy
const fetchBrandsWithContent = async (userId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
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
            content,
            image_url
          )
        )
      )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch brands: ${error.message}`)
  }

  return data as BrandWithContent[]
}

// Custom fetcher for a single brand
const fetchBrand = async (brandId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch brand: ${error.message}`)
  }

  return data as Brand
}

// Hook to get all brands for a user
export function useBrands(userId: string) {
  const { data, error, mutate, isLoading } = useSWR(
    userId ? `brands-${userId}` : null,
    () => fetchBrandsWithContent(userId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000, // 10 minutes for brand data
    }
  )

  return {
    brands: data,
    isLoading,
    error,
    mutate,
    // Helper function to invalidate cache
    invalidate: () => mutate()
  }
}

// Hook to get a single brand
export function useBrand(brandId: string) {
  const { data, error, mutate, isLoading } = useSWR(
    brandId ? `brand-${brandId}` : null,
    () => fetchBrand(brandId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
    }
  )

  return {
    brand: data,
    isLoading,
    error,
    mutate,
    invalidate: () => mutate()
  }
}

// Hook to get brands with content for dashboard
export function useBrandsWithContent(userId: string) {
  const { data, error, mutate, isLoading } = useSWR(
    userId ? `brands-content-${userId}` : null,
    () => fetchBrandsWithContent(userId),
    {
      revalidateOnFocus: true,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      refreshInterval: 30 * 1000, // Refresh every 30 seconds for active data
    }
  )

  return {
    brands: data,
    isLoading,
    error,
    mutate,
    invalidate: () => mutate(),
    // Helper to get total counts
    getTotalCounts: () => {
      if (!data) return { brands: 0, angles: 0, ideas: 0, generated: 0 }
      
      const brands = data.length
      const angles = data.reduce((acc, brand) => acc + (brand.content_angles?.length || 0), 0)
      const ideas = data.reduce((acc, brand) => 
        acc + (brand.content_angles?.reduce((angleAcc, angle) => {
          const filteredIdeas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
          return angleAcc + filteredIdeas.length
        }, 0) || 0), 0)
      const generated = data.reduce((acc, brand) => 
        acc + (brand.content_angles?.reduce((angleAcc, angle) => {
          const filteredIdeas = (angle.content_ideas || []).filter(idea => idea.platform === angle.platform)
          const generatedIdeas = filteredIdeas.filter(idea => 
            Boolean(idea.generated_content && idea.generated_content.length > 0)
          )
          return angleAcc + generatedIdeas.length
        }, 0) || 0), 0)
      
      return { brands, angles, ideas, generated }
    }
  }
}