'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Settings, 
  Calendar,
  User,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as AuthUser } from '@supabase/supabase-js'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/content', icon: FileText },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sidebar-nav">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Content Demo</span>
        </div>
        
        <div className="space-y-1 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/dashboard' && pathname === '/dashboard') ||
              (item.href === '/content' && pathname.startsWith('/content'))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'sidebar-nav-item',
                  isActive && 'active'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
        
        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || 'No email available'}
                  </p>
                </>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}