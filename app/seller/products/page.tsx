'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { categories } from '@/lib/category-taxonomy'
import {
  mockProducts,
  mockProductStats,
  type Product,
  type ProductStatus,
  type ProductFilters,
} from '@/lib/types/product'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Archive,
  ChevronDown,
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  Grid3X3,
  List,
  ArrowUpDown,
  ExternalLink,
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

const statusConfig: Record<ProductStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: 'Active', color: 'bg-green-bg text-green-text border-green/20', icon: CheckCircle2 },
  draft: { label: 'Draft', color: 'bg-cream-card text-muted border-border', icon: Clock },
  pending_review: { label: 'Pending Review', color: 'bg-warn-bg text-warn-text border-warn-text/20', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-bg text-red border-red/20', icon: XCircle },
  out_of_stock: { label: 'Out of Stock', color: 'bg-orange-light text-orange border-orange/20', icon: AlertTriangle },
  archived: { label: 'Archived', color: 'bg-cream-card text-muted border-border', icon: Archive },
}

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<ProductFilters>({
    status: 'all',
    category: 'all',
    search: '',
    sortBy: 'newest',
  })

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts]

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      products = products.filter(p => p.status === filters.status)
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.categoryId === filters.category)
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      products = products.filter(
        p =>
          p.title.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.categoryName.toLowerCase().includes(search)
      )
    }

    // Sort
    switch (filters.sortBy) {
      case 'oldest':
        products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'price_high':
        products.sort((a, b) => b.sellingPrice - a.sellingPrice)
        break
      case 'price_low':
        products.sort((a, b) => a.sellingPrice - b.sellingPrice)
        break
      case 'most_views':
        products.sort((a, b) => b.views - a.views)
        break
      case 'most_orders':
        products.sort((a, b) => b.orders - a.orders)
        break
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return products
  }, [filters])

  return (
    <div className="animate-fade-up space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Total Products"
          value={mockProductStats.total}
          icon={Package}
          color="navy"
        />
        <StatCard
          label="Active"
          value={mockProductStats.active}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          label="Draft"
          value={mockProductStats.draft}
          icon={Clock}
          color="muted"
        />
        <StatCard
          label="Pending Review"
          value={mockProductStats.pendingReview}
          icon={AlertCircle}
          color="warn"
        />
        <StatCard
          label="Out of Stock"
          value={mockProductStats.outOfStock}
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          label="Rejected"
          value={mockProductStats.rejected}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">My Products</h1>
          <p className="text-sm text-muted">
            Manage your product catalog and inventory
          </p>
        </div>
        <Link href="/seller/products/new">
          <Button className="gap-2 bg-orange hover:bg-orange-hover">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hint" />
            <Input
              placeholder="Search products by name, SKU..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 border-border bg-input-bg focus:border-orange focus:ring-orange/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: value as ProductStatus | 'all' })}
            >
              <SelectTrigger className="w-[140px] border-border bg-input-bg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="w-[180px] border-border bg-input-bg">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={filters.sortBy || 'newest'}
              onValueChange={(value) => setFilters({ ...filters, sortBy: value as ProductFilters['sortBy'] })}
            >
              <SelectTrigger className="w-[150px] border-border bg-input-bg">
                <ArrowUpDown className="mr-2 h-4 w-4 text-muted" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="most_views">Most Views</SelectItem>
                <SelectItem value="most_orders">Most Orders</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-border bg-input-bg p-1">
              <button
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-white text-text shadow-sm'
                    : 'text-muted hover:text-text'
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-white text-text shadow-sm'
                    : 'text-muted hover:text-text'
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.status !== 'all' || filters.category !== 'all' || filters.search) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="text-sm text-muted">Filters:</span>
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="gap-1 bg-cream-card">
                Status: {statusConfig[filters.status as ProductStatus]?.label}
                <button onClick={() => setFilters({ ...filters, status: 'all' })}>
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="gap-1 bg-cream-card">
                Category: {categories.find(c => c.id === filters.category)?.name}
                <button onClick={() => setFilters({ ...filters, category: 'all' })}>
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="gap-1 bg-cream-card">
                Search: {filters.search}
                <button onClick={() => setFilters({ ...filters, search: '' })}>
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button
              className="text-sm text-orange hover:underline"
              onClick={() =>
                setFilters({ status: 'all', category: 'all', search: '', sortBy: 'newest' })
              }
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <EmptyState hasFilters={filters.status !== 'all' || filters.category !== 'all' || !!filters.search} />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'navy' | 'green' | 'muted' | 'warn' | 'orange' | 'red'
}) {
  const colorClasses = {
    navy: 'bg-navy/10 text-navy',
    green: 'bg-green-bg text-green',
    muted: 'bg-cream-card text-muted',
    warn: 'bg-warn-bg text-warn-text',
    orange: 'bg-orange-light text-orange',
    red: 'bg-red-bg text-red',
  }

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="font-serif text-2xl font-bold text-text">{value}</span>
      </div>
      <p className="mt-2 text-xs text-muted">{label}</p>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const status = statusConfig[product.status]
  const StatusIcon = status.icon
  const discount = product.mrp
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-white transition-all hover:border-orange/30 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-card">
        <Image
          src={product.images[0]?.url || '/placeholder.svg?height=400&width=400'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <div className="absolute left-2 top-2 rounded-md bg-orange px-2 py-0.5 text-xs font-semibold text-white">
            {discount}% OFF
          </div>
        )}
        {product.giTagCertified && (
          <div className="absolute right-2 top-2 rounded-md bg-purple-bg px-2 py-0.5 text-xs font-semibold text-purple">
            GI Tag
          </div>
        )}
        {/* Quick Actions */}
        <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={`/seller/products/${product.id}`}>
            <Button size="sm" variant="secondary" className="h-8 gap-1 bg-white/90 backdrop-blur-sm">
              <Eye className="h-3.5 w-3.5" />
              View
            </Button>
          </Link>
          <Link href={`/seller/products/${product.id}/edit`}>
            <Button size="sm" className="h-8 gap-1 bg-orange/90 text-white hover:bg-orange backdrop-blur-sm">
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold', status.color)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-cream-card">
                <MoreHorizontal className="h-4 w-4 text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview on Store
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-text">{product.title}</h3>
        <p className="mb-3 text-xs text-muted">
          {product.categoryName} • {product.subCategoryName}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="font-serif text-lg font-bold text-text">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.sellingPrice)}
          </span>
          {product.mrp && (
            <span className="text-sm text-muted line-through">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {product.views}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {product.orders}
            </span>
          </div>
          <div className={cn(
            'text-xs font-medium',
            product.stockQuantity === 0 ? 'text-red' : product.stockQuantity < 5 ? 'text-orange' : 'text-green'
          )}>
            {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} in stock`}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const status = statusConfig[product.status]
  const StatusIcon = status.icon
  const discount = product.mrp
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0

  return (
    <div className="group flex gap-4 rounded-xl border border-border bg-white p-4 transition-all hover:border-orange/30 hover:shadow-md">
      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-cream-card">
        <Image
          src={product.images[0]?.url || '/placeholder.svg?height=100&width=100'}
          alt={product.title}
          fill
          className="object-cover"
        />
        {discount > 0 && (
          <div className="absolute left-1 top-1 rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold', status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </div>
            {product.giTagCertified && (
              <div className="rounded-md bg-purple-bg px-1.5 py-0.5 text-[10px] font-semibold text-purple">
                GI Tag
              </div>
            )}
            <span className="text-xs text-muted">SKU: {product.sku}</span>
          </div>
          <h3 className="line-clamp-1 text-sm font-semibold text-text">{product.title}</h3>
          <p className="text-xs text-muted">
            {product.categoryName} • {product.subCategoryName}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-bold text-text">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.sellingPrice)}
            </span>
            {product.mrp && (
              <span className="text-xs text-muted line-through">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {product.views} views
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {product.orders} orders
            </span>
          </div>
          <div className={cn(
            'text-xs font-medium',
            product.stockQuantity === 0 ? 'text-red' : product.stockQuantity < 5 ? 'text-orange' : 'text-green'
          )}>
            {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} in stock`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/seller/products/${product.id}`}>
          <Button size="sm" variant="ghost" className="h-8 gap-1">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </Link>
        <Link href={`/seller/products/${product.id}/edit`}>
          <Button size="sm" variant="outline" className="h-8 gap-1 border-orange text-orange hover:bg-orange hover:text-white">
            <Edit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview on Store
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-light">
        <Package className="h-8 w-8 text-orange" />
      </div>
      <h3 className="mb-2 font-serif text-lg font-semibold text-text">
        {hasFilters ? 'No products found' : 'No products yet'}
      </h3>
      <p className="mb-6 max-w-sm text-center text-sm text-muted">
        {hasFilters
          ? 'Try adjusting your filters to find what you are looking for.'
          : 'Start adding your handcrafted products to reach customers across India.'}
      </p>
      {!hasFilters && (
        <Link href="/seller/products/new">
          <Button className="gap-2 bg-orange hover:bg-orange-hover">
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </Link>
      )}
    </div>
  )
}
