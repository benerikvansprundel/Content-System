'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Globe, Calendar, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Brand } from '@/types/database'
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog'

interface Props {
  brand: Brand
}

export function BrandCard({ brand }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      // Delete all related data first
      await supabase.from('generated_content').delete().eq('brand_id', brand.id)
      await supabase.from('content_ideas').delete().eq('brand_id', brand.id)
      await supabase.from('content_angles').delete().eq('brand_id', brand.id)
      
      // Delete the brand
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brand.id)

      if (error) throw error

      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting brand:', error)
      alert('Failed to delete brand. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = () => {
    router.push(`/brands/${brand.id}/edit`)
  }

  return (
    <>
      <div className="task-card group">
        <div className="task-header">
          <div 
            className="task-title flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleEdit}
          >
            <Globe className="w-5 h-5 text-blue-600" />
            {brand.name}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="p-1 h-7 w-7 text-gray-500 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="p-1 h-7 w-7 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="task-meta">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Updated {new Date(brand.updated_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="task-description mb-4">
          <p className="text-sm text-gray-600">{brand.website}</p>
          {brand.additional_info && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{brand.additional_info}</p>
          )}
        </div>
        
        <div className="task-footer">
          <div className="flex gap-2 w-full">
            <Link href={`/brands/${brand.id}/strategy`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Strategy
              </Button>
            </Link>
            <Link href={`/brands/${brand.id}/content`} className="flex-1">
              <Button size="sm" className="w-full">
                Content
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Brand"
        description="Are you sure you want to delete this brand?"
        itemName={brand.name}
        cascadeInfo="This will also delete all content strategies, ideas, and generated content for this brand."
      />
    </>
  )
}