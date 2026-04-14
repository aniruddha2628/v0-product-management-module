'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown,
  ArrowUpRight,
  Calendar,
  Download,
  RotateCcw,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SellerLayout } from '@/components/seller/seller-layout'
import { mockOrders, getOrderStats } from '@/lib/mock-orders'
import { orderStatusConfig, paymentStatusConfig, type OrderStatus } from '@/lib/types/order'
import { cn } from '@/lib/utils'

type StatusFilter = OrderStatus | 'all' | 'active'

const statusFilters: { value: StatusFilter; label: string; count?: number }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const StatusIcon = ({ status }: { status: OrderStatus }) => {
  const icons = {
    pending: Clock,
    accepted: CheckCircle2,
    packed: Package,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle,
    returned: RotateCcw,
  }
  const Icon = icons[status]
  return <Icon className="h-3.5 w-3.5" />
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(dateString)
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all')

  const stats = getOrderStats()

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let orders = [...mockOrders]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      orders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some(item => item.productName.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        orders = orders.filter(order => 
          ['pending', 'accepted', 'packed', 'shipped'].includes(order.status)
        )
      } else {
        orders = orders.filter(order => order.status === statusFilter)
      }
    }

    // Date filter
    if (dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      orders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        if (dateRange === 'today') {
          return orderDate >= today
        } else if (dateRange === 'week') {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return orderDate >= weekAgo
        } else if (dateRange === 'month') {
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          return orderDate >= monthAgo
        }
        return true
      })
    }

    // Sort
    orders.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'amount-high':
          return b.total - a.total
        case 'amount-low':
          return a.total - b.total
        default:
          return 0
      }
    })

    return orders
  }, [searchQuery, statusFilter, sortBy, dateRange])

  // Count orders by status for tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockOrders.length, active: 0 }
    mockOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1
      if (['pending', 'accepted', 'packed', 'shipped'].includes(order.status)) {
        counts.active++
      }
    })
    return counts
  }, [])

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-text">Orders</h1>
            <p className="mt-1 text-sm text-muted">
              Manage and track all your customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 border-border text-muted">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-light">
                <ShoppingBag className="h-5 w-5 text-orange" />
              </div>
              <span className="text-xs text-muted">Total</span>
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-text">{stats.total}</p>
            <p className="text-xs text-muted">All orders</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warn-bg">
                <Clock className="h-5 w-5 text-warn-text" />
              </div>
              {stats.pending > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-warn-bg px-2 py-0.5 text-xs font-medium text-warn-text">
                  <AlertCircle className="h-3 w-3" />
                  Action needed
                </span>
              )}
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-text">{stats.pending}</p>
            <p className="text-xs text-muted">Pending acceptance</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-bg">
                <Truck className="h-5 w-5 text-info-text" />
              </div>
              <span className="text-xs text-muted">In progress</span>
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-text">{stats.processing + stats.shipped}</p>
            <p className="text-xs text-muted">Processing & shipped</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-bg">
                <IndianRupee className="h-5 w-5 text-green-text" />
              </div>
              <span className="flex items-center gap-0.5 text-xs text-green-text">
                <TrendingUp className="h-3 w-3" />
                +12%
              </span>
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-text">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs text-muted">Total revenue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-white">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-4 py-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors',
                  statusFilter === filter.value
                    ? 'bg-orange/10 font-medium text-orange'
                    : 'text-muted hover:bg-cream-card hover:text-text'
                )}
              >
                {filter.label}
                {statusCounts[filter.value] !== undefined && (
                  <span className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs',
                    statusFilter === filter.value
                      ? 'bg-orange/20 text-orange'
                      : 'bg-cream-card text-muted'
                  )}>
                    {statusCounts[filter.value]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search and Other Filters */}
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 bg-input-bg border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={(v: typeof dateRange) => setDateRange(v)}>
                <SelectTrigger className="h-9 w-[130px] border-border bg-white">
                  <Calendar className="mr-2 h-4 w-4 text-muted" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v: typeof sortBy) => setSortBy(v)}>
                <SelectTrigger className="h-9 w-[140px] border-border bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="amount-high">Amount: High</SelectItem>
                  <SelectItem value="amount-low">Amount: Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-card">
                  <Package className="h-8 w-8 text-muted" />
                </div>
                <p className="mt-4 font-medium text-text">No orders found</p>
                <p className="mt-1 text-sm text-muted">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Orders will appear here when customers place them'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusConfig = orderStatusConfig[order.status]
                const paymentConfig = paymentStatusConfig[order.paymentStatus]
                
                return (
                  <div
                    key={order.id}
                    className="group flex flex-col gap-4 p-4 transition-colors hover:bg-cream/50 sm:flex-row sm:items-center"
                  >
                    {/* Order Info */}
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      {/* Product Images Stack */}
                      <div className="relative flex-shrink-0">
                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-border bg-cream-card">
                          <Image
                            src={order.items[0].productImage}
                            alt={order.items[0].productName}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {order.items.length > 1 && (
                          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                            +{order.items.length - 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/seller/orders/${order.id}`}
                            className="font-medium text-text hover:text-orange"
                          >
                            {order.orderNumber}
                          </Link>
                          <Badge
                            className={cn(
                              'gap-1 border text-[10px] font-semibold',
                              statusConfig.bgColor,
                              statusConfig.color,
                              statusConfig.borderColor
                            )}
                          >
                            <StatusIcon status={order.status} />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted">
                          {order.items.map(i => i.productName).join(', ')}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span>{order.customerName}</span>
                          <span className="text-border">|</span>
                          <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Meta */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Amount */}
                      <div className="text-right">
                        <p className="font-semibold text-text">{formatCurrency(order.total)}</p>
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={cn(
                            'rounded px-1.5 py-0.5 text-[10px] font-medium',
                            paymentConfig.bgColor,
                            paymentConfig.color
                          )}>
                            {paymentConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="hidden text-right sm:block">
                        <p className="text-sm text-text">{getRelativeTime(order.createdAt)}</p>
                        <p className="text-xs text-muted">{formatTime(order.createdAt)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <Link href={`/seller/orders/${order.id}`}>
                            <Button
                              size="sm"
                              className="h-8 gap-1 bg-orange text-white hover:bg-orange-hover"
                            >
                              Accept
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted hover:text-text"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/seller/orders/${order.id}`} className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {order.trackingNumber && (
                              <DropdownMenuItem className="gap-2">
                                <Truck className="h-4 w-4" />
                                Track Shipment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted">
                Showing <span className="font-medium text-text">{filteredOrders.length}</span> of{' '}
                <span className="font-medium text-text">{mockOrders.length}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="h-8 border-border">
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled className="h-8 border-border">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  )
}
