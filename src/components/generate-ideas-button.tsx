'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Lightbulb, Loader2 } from 'lucide-react'
import { ContentAngle } from '@/types/database'

interface Props {
  brandId: string
  angle: ContentAngle
}

export function GenerateIdeasButton({ brandId, angle }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerateIdeas = async () => {
    setLoading(true)
    try {
      // Navigate to ideas page with auto-generate flag
      router.push(`/brands/${brandId}/ideas?angle=${angle.id}&auto=true&platform=${angle.platform}`)
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGenerateIdeas} 
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <Lightbulb className="w-4 h-4" />
          Generate Ideas
        </>
      )}
    </Button>
  )
}