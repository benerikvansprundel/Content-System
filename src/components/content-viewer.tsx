'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Eye, Save, X } from 'lucide-react'
import { ContentEditor } from '@/components/content-editor'
import { GeneratedContent } from '@/types/database'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: GeneratedContent
}

export function ContentViewer({ content }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleToggleEdit = () => {
    if (isEditing) {
      // When closing edit mode, refresh to show updated content
      router.refresh()
    }
    setIsEditing(!isEditing)
  }

  if (isEditing) {
    return (
      <div className="detail-panel">
        <div className="detail-header">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize status-badge">
              {content.platform}
            </Badge>
            <span className="text-sm text-gray-500">Editing Mode</span>
          </div>
          <Button
            onClick={handleToggleEdit}
            variant="outline"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Edit
          </Button>
        </div>
        
        <ContentEditor content={content} />
        
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleToggleEdit}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Done Editing
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="task-card">
      {content.image_url && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
          <img 
            src={content.image_url} 
            alt="Generated content"
            className="object-cover w-full h-full"
          />
        </div>
      )}
      
      <div className="task-header">
        <Badge variant="outline" className="capitalize status-badge">
          {content.platform}
        </Badge>
      </div>
      
      <div className="task-description mb-4 prose prose-sm max-w-none prose-gray">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Style headings
            h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-md font-semibold mb-1">{children}</h3>,
            // Style paragraphs
            p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
            // Style lists
            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
            // Style links
            a: ({ children, href }) => (
              <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            // Style code
            code: ({ children }) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            ),
            // Style blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3">{children}</blockquote>
            ),
            // Preserve line breaks
            br: () => <br className="mb-2" />,
          }}
        >
          {content.content}
        </ReactMarkdown>
      </div>
      
      <div className="task-footer">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleToggleEdit}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Content
        </Button>
      </div>
    </div>
  )
}