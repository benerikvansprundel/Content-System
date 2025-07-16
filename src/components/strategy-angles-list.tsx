'use client'

import { useState, useMemo } from 'react'
import { ContentAngle, Platform } from '@/types/database'
import { StrategyAngleCard } from '@/components/strategy-angle-card'
import { PlatformFilter } from '@/components/platform-filter'

interface Props {
  angles: ContentAngle[]
  brandId: string
}

export function StrategyAnglesList({ angles, brandId }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all')

  // Calculate platform counts
  const platformCounts = useMemo(() => {
    const counts: Record<Platform, number> = {
      twitter: 0,
      linkedin: 0,
      newsletter: 0
    }
    
    angles.forEach(angle => {
      if (angle.platform in counts) {
        counts[angle.platform]++
      }
    })
    
    return counts
  }, [angles])

  // Filter angles based on selected platform
  const filteredAngles = useMemo(() => {
    if (selectedPlatform === 'all') {
      return angles
    }
    return angles.filter(angle => angle.platform === selectedPlatform)
  }, [angles, selectedPlatform])

  // Auto-select platform if only one has angles
  useMemo(() => {
    const platformsWithAngles = Object.entries(platformCounts).filter(([_, count]) => count > 0)
    if (platformsWithAngles.length === 1 && selectedPlatform === 'all') {
      setSelectedPlatform(platformsWithAngles[0][0] as Platform)
    }
  }, [platformCounts, selectedPlatform])

  return (
    <div className="space-y-6">
      {/* Platform Filter */}
      <PlatformFilter
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        platformCounts={platformCounts}
      />

      {/* Filtered Angles */}
      {filteredAngles.length > 0 ? (
        <div className="space-y-6">
          {filteredAngles.map((angle) => (
            <StrategyAngleCard key={angle.id} angle={angle} brandId={brandId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No angles for {selectedPlatform === 'all' ? 'any platform' : selectedPlatform}
          </h3>
          <p className="text-gray-600">
            {selectedPlatform === 'all' 
              ? 'Generate some content strategy angles to get started.'
              : `Switch to another platform or generate angles for ${selectedPlatform}.`
            }
          </p>
        </div>
      )}
    </div>
  )
}