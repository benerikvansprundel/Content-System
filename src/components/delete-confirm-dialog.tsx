'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemName: string
  cascadeInfo?: string
  loading?: boolean
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  cascadeInfo,
  loading = false
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-600 mb-2">{description}</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">{itemName}</p>
            </div>
          </div>
          
          {cascadeInfo && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Warning:</strong> {cascadeInfo}
              </p>
            </div>
          )}
          
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>This action cannot be undone.</strong> All associated data will be permanently deleted.
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}