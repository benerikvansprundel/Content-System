'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Clock } from 'lucide-react'
import { GeneratedContent } from '@/types/database'

interface Props {
  content: GeneratedContent
}

export function ContentEditor({ content }: Props) {
  const [editedContent, setEditedContent] = useState(content.content)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const supabase = createClient()

  const handleAutoSave = async () => {
    if (saving || editedContent === content.content) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({ 
          content: editedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', content.id)

      if (error) throw error
      
      setLastSaved(new Date())
      console.log('✅ Content auto-saved')
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editedContent !== content.content) {
        handleAutoSave()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [editedContent, content.content, handleAutoSave])

  const handleManualSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('generated_content')
        .update({ content: editedContent })
        .eq('id', content.id)

      if (error) throw error
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="detail-header">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize status-badge">
            {content.platform}
          </Badge>
          {lastSaved && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
        <Button
          onClick={handleManualSave}
          disabled={saving || editedContent === content.content}
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="relative">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[300px] p-4 border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          placeholder="Edit your content here..."
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
          {editedContent.length} characters
        </div>
      </div>

      {content.image_url && (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={content.image_url} 
            alt="Generated content"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  )
}