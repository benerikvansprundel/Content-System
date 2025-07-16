import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Brand } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Globe, Calendar, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { BrandCard } from '@/components/brand-card'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen main-content">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="content-header">
          <div>
            <h1 className="content-title">Your Brands</h1>
            <p className="content-subtitle">Manage your content strategy for each brand</p>
          </div>
          <Link href="/brands/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Brand
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands?.map((brand: Brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {(!brands || brands.length === 0) && (
          <div className="text-center py-12">
            <div className="detail-panel max-w-md mx-auto">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands yet</h3>
              <p className="text-gray-600 mb-6">Create your first brand to get started with content generation</p>
              <Link href="/brands/new">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Brand
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}