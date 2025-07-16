import { SWRConfiguration } from 'swr'
import { createClient } from '@/lib/supabase/client'

// Custom fetcher function for API calls
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

// Custom fetcher for Supabase queries
const supabaseFetcher = async (query: string) => {
  const supabase = createClient()
  
  // Parse query string to determine table and filters
  const [table, ...filters] = query.split('|')
  
  let queryBuilder = supabase.from(table)
  
  // Apply filters if any
  filters.forEach(filter => {
    const [column, operator, value] = filter.split(':')
    if (operator === 'eq') {
      queryBuilder = queryBuilder.eq(column, value)
    } else if (operator === 'select') {
      queryBuilder = queryBuilder.select(value)
    }
  })
  
  const { data, error } = await queryBuilder
  
  if (error) {
    throw new Error(`Supabase Error: ${error.message}`)
  }
  
  return data
}

// SWR configuration with caching strategies
export const swrConfig: SWRConfiguration = {
  fetcher,
  // Cache for 5 minutes by default
  dedupingInterval: 5 * 60 * 1000, // 5 minutes
  // Revalidate on focus
  revalidateOnFocus: true,
  // Revalidate on reconnect
  revalidateOnReconnect: true,
  // Retry on error with exponential backoff
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  // Background revalidation
  refreshInterval: 0, // Disable automatic refresh, use manual triggers
  // Keep previous data while revalidating
  keepPreviousData: true,
  // Optimistic updates
  optimisticData: undefined,
  // Error handler
  onError: (error, key) => {
    console.error('SWR Error:', error, 'Key:', key)
    // Could integrate with error tracking service here
  },
  // Success handler
  onSuccess: (data, key) => {
    console.log('SWR Success:', key, 'Data length:', Array.isArray(data) ? data.length : 'N/A')
  }
}

// Cache key generators
export const cacheKeys = {
  // Brand-related keys
  brands: (userId: string) => `/api/brands?userId=${userId}`,
  brand: (brandId: string) => `/api/brands/${brandId}`,
  brandWithContent: (brandId: string) => `/api/brands/${brandId}/content`,
  
  // Content-related keys
  contentAngles: (brandId: string, platform?: string) => 
    `/api/brands/${brandId}/angles${platform ? `?platform=${platform}` : ''}`,
  contentIdeas: (angleId: string) => `/api/angles/${angleId}/ideas`,
  generatedContent: (ideaId: string) => `/api/ideas/${ideaId}/content`,
  
  // User-related keys
  userProfile: (userId: string) => `/api/users/${userId}`,
  
  // Dashboard keys
  dashboard: (userId: string) => `/api/dashboard?userId=${userId}`,
  
  // Supabase query keys
  supabase: {
    brands: (userId: string) => `brands|user_id:eq:${userId}|select:*`,
    brandWithAngles: (brandId: string) => `brands|id:eq:${brandId}|select:*,content_angles(*)`,
    contentHierarchy: (brandId: string) => 
      `brands|id:eq:${brandId}|select:*,content_angles(*,content_ideas(*,generated_content(*)))`
  }
}

// Cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate all brand-related caches
  invalidateBrand: (brandId: string) => [
    cacheKeys.brand(brandId),
    cacheKeys.brandWithContent(brandId),
    cacheKeys.contentAngles(brandId)
  ],
  
  // Invalidate content-related caches
  invalidateContent: (brandId: string, angleId?: string, ideaId?: string) => {
    const keys = [
      cacheKeys.brandWithContent(brandId),
      cacheKeys.contentAngles(brandId)
    ]
    
    if (angleId) {
      keys.push(cacheKeys.contentIdeas(angleId))
    }
    
    if (ideaId) {
      keys.push(cacheKeys.generatedContent(ideaId))
    }
    
    return keys
  },
  
  // Invalidate user-related caches
  invalidateUser: (userId: string) => [
    cacheKeys.brands(userId),
    cacheKeys.userProfile(userId),
    cacheKeys.dashboard(userId)
  ]
}

// Export the fetchers for specific use cases
export { fetcher, supabaseFetcher }