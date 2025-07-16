'use client'

import { Badge } from '@/components/ui/badge'
import { Platform } from '@/types/database'

interface Props {
  selectedPlatform: Platform | 'all'
  onPlatformChange: (platform: Platform | 'all') => void
  platformCounts: Record<Platform, number>
}

export function PlatformFilter({ selectedPlatform, onPlatformChange, platformCounts }: Props) {
  const platforms: { key: Platform | 'all'; label: string; color: string }[] = [
    { key: 'all', label: 'All Platforms', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { key: 'twitter', label: 'Twitter', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'linkedin', label: 'LinkedIn', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'newsletter', label: 'Newsletter', color: 'bg-green-100 text-green-800 border-green-200' },
  ]

  const getTotalCount = () => {
    return Object.values(platformCounts).reduce((sum, count) => sum + count, 0)
  }

  const getCount = (platform: Platform | 'all') => {
    if (platform === 'all') return getTotalCount()
    return platformCounts[platform] || 0
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {platforms.map((platform) => {
        const count = getCount(platform.key)
        const isSelected = selectedPlatform === platform.key
        
        return (
          <button
            key={platform.key}
            onClick={() => onPlatformChange(platform.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${isSelected 
                ? `${platform.color} ring-2 ring-offset-2 ring-blue-500 shadow-md` 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }
              ${count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={count === 0}
          >
            <span className="font-medium">{platform.label}</span>
            <Badge 
              variant="secondary" 
              className={`
                text-xs font-semibold min-w-[20px] h-5 flex items-center justify-center
                ${isSelected ? 'bg-white/20 text-current' : 'bg-gray-100 text-gray-600'}
              `}
            >
              {count}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}