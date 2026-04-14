'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  User,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  Eye,
  ChevronDown,
  LogOut,
  Settings,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  disabled?: boolean
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/seller/products', icon: Package, badge: 12 },
  { label: 'Orders', href: '/seller/orders', icon: ShoppingCart, badge: 3 },
  { label: 'Payments', href: '/seller/payments', icon: Wallet, disabled: true },
]

const secondaryNavItems: NavItem[] = [
  { label: 'Profile', href: '/seller/profile', icon: User },
  { label: 'Enquiries', href: '/seller/enquiries', icon: MessageSquare, disabled: true },
  { label: 'Help & Support', href: '/seller/support', icon: HelpCircle, disabled: true },
]

// Mock seller data
const seller = {
  name: 'Priya Sharma',
  shopName: 'Jaipur Blue Pottery',
  type: 'Individual Artisan',
  avatar: 'PS',
  isVerified: true,
  profileCompletion: 68,
}

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-navy transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5">
          <Link href="/seller/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-[15px] font-bold text-white">ArtisanHub</h1>
              <p className="text-[9.5px] uppercase tracking-wider text-white/40">Seller Portal</p>
            </div>
          </Link>
        </div>

        {/* Seller Card */}
        <div className="mx-4 mb-4 rounded-lg border border-white/8 bg-white/6 p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange font-serif text-sm font-bold text-white">
              {seller.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">{seller.shopName}</p>
              <p className="text-[11px] text-white/40">{seller.type}</p>
              {seller.isVerified && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-green/35 bg-green/20 px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-dot" />
                  <span className="text-[10px] font-semibold text-green-400">Verified</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-orange transition-all duration-500"
                style={{ width: `${seller.profileCompletion}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-white/40">
              Profile {seller.profileCompletion}% complete
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3">
          <p className="mb-1 px-2.5 text-[9.5px] font-semibold uppercase tracking-wider text-white/30">
            Main Menu
          </p>
          {mainNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'group relative my-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all',
                  isActive
                    ? 'bg-orange/15 text-orange'
                    : 'text-white/55 hover:bg-white/7 hover:text-white/85',
                  item.disabled && 'pointer-events-none opacity-35'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 bottom-[20%] top-[20%] w-[3px] rounded-r bg-orange" />
                )}
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                    isActive ? 'bg-orange/20' : 'bg-white/6 group-hover:bg-white/10'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', isActive ? 'text-orange' : 'text-white/60')} />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <p className="mb-1 mt-4 px-2.5 text-[9.5px] font-semibold uppercase tracking-wider text-white/30">
            Account
          </p>
          {secondaryNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'group relative my-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all',
                  isActive
                    ? 'bg-orange/15 text-orange'
                    : 'text-white/55 hover:bg-white/7 hover:text-white/85',
                  item.disabled && 'pointer-events-none opacity-35'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 bottom-[20%] top-[20%] w-[3px] rounded-r bg-orange" />
                )}
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                    isActive ? 'bg-orange/20' : 'bg-white/6 group-hover:bg-white/10'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', isActive ? 'text-orange' : 'text-white/60')} />
                </span>
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/7 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/seller/settings" className="text-[12px] text-white/40 hover:text-white/75">
              Settings
            </Link>
            <span className="text-white/20">·</span>
            <button className="text-[12px] text-white/40 hover:text-white/75">Logout</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-muted" />
            </button>
            <div>
              <h2 className="text-[15px] font-semibold text-text">
                {getPageTitle(pathname)}
              </h2>
              <p className="text-[12px] text-muted">
                <Link href="/seller/dashboard" className="hover:text-orange">Home</Link>
                <span className="mx-1.5">›</span>
                <span className="text-orange">{getPageTitle(pathname)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1.5 border-border text-[13px] text-muted hover:border-orange hover:text-orange sm:flex"
            >
              <Eye className="h-4 w-4" />
              Preview Shop
            </Button>
            
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-orange hover:text-orange">
              <Bell className="h-4 w-4 text-muted" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:border-orange">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange text-[11px] font-bold text-white">
                    {seller.avatar}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {/* Mobile close button */}
      {sidebarOpen && (
        <button
          className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-text" />
        </button>
      )}
    </div>
  )
}

function getPageTitle(pathname: string): string {
  if (pathname.includes('/products/new')) return 'Add New Product'
  if (pathname.includes('/products/')) return 'Edit Product'
  if (pathname.includes('/products')) return 'Products'
  if (pathname.match(/\/orders\/[^/]+$/)) return 'Order Details'
  if (pathname.includes('/orders')) return 'Orders'
  if (pathname.includes('/payments')) return 'Payments'
  if (pathname.includes('/profile')) return 'Profile'
  if (pathname.includes('/enquiries')) return 'Enquiries'
  if (pathname.includes('/support')) return 'Help & Support'
  if (pathname.includes('/dashboard')) return 'Dashboard'
  return 'Dashboard'
}
