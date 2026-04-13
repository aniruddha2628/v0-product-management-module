'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getCategoryById } from '@/lib/category-taxonomy'
import { mockProducts, type Product, type ProductStatus } from '@/lib/types/product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Edit2,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  Archive,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Heart,
  Package,
  MapPin,
  Truck,
  Calendar,
  Tag,
  Info,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

const statusConfig: Record<ProductStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }>; bgColor: string }> = {
  active: { label: 'Active', color: 'text-green-text', bgColor: 'bg-green-bg border-green/20', icon: CheckCircle2 },
  draft: { label: 'Draft', color: 'text-muted', bgColor: 'bg-cream-card border-border', icon: Clock },
  pending_review: { label: 'Pending Review', color: 'text-warn-text', bgColor: 'bg-warn-bg border-warn-text/20', icon: Clock },
  rejected: { label: 'Rejected', color: 'text-red', bgColor: 'bg-red-bg border-red/20', icon: XCircle },
  out_of_stock: { label: 'Out of Stock', color: 'text-orange', bgColor: 'bg-orange-light border-orange/20', icon: AlertTriangle },
  archived: { label: 'Archived', color: 'text-muted', bgColor: 'bg-cream-card border-border', icon: Archive },
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const product = useMemo(
    () => mockProducts.find((p) => p.id === id),
    [id]
  )

  const category = useMemo(
    () => product ? getCategoryById(product.categoryId) : undefined,
    [product]
  )

  if (!product) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Package className="mb-4 h-16 w-16 text-border" />
        <h2 className="mb-2 font-serif text-xl font-semibold text-text">
          Product Not Found
        </h2>
        <p className="mb-6 text-sm text-muted">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/seller/products">
          <Button className="bg-orange hover:bg-orange-hover">
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  const status = statusConfig[product.status]
  const StatusIcon = status.icon
  const discount = product.mrp
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0

  const handleDelete = () => {
    toast.error('Product deleted', {
      description: 'This action cannot be undone.',
    })
    router.push('/seller/products')
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/seller/products"
            className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border hover:border-orange hover:text-orange"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold', status.bgColor, status.color)}>
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </div>
              {product.giTagCertified && (
                <Badge className="bg-purple-bg text-purple border border-purple/20 hover:bg-purple-bg">
                  GI Tag Certified
                </Badge>
              )}
              <span className="text-xs text-muted">SKU: {product.sku}</span>
            </div>
            <h1 className="font-serif text-xl font-bold text-text sm:text-2xl">
              {product.title}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {category?.icon} {product.categoryName} • {product.subCategoryName}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-border">
            <ExternalLink className="h-4 w-4" />
            Preview
          </Button>
          <Link href={`/seller/products/${product.id}/edit`}>
            <Button className="gap-2 bg-orange hover:bg-orange-hover">
              <Edit2 className="h-4 w-4" />
              Edit Product
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-border">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Product
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rejection Banner */}
      {product.status === 'rejected' && product.statusReason && (
        <div className="mb-6 rounded-xl border border-red/20 bg-red-bg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red" />
            <div>
              <p className="text-sm font-medium text-red">Product Rejected</p>
              <p className="mt-1 text-sm text-red/80">{product.statusReason}</p>
              <Link
                href={`/seller/products/${product.id}/edit`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red hover:underline"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit and resubmit
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">Product Images</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              {product.images.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border bg-cream-card',
                    index === 0 ? 'sm:col-span-2 sm:row-span-2' : '',
                    image.isPrimary && 'ring-2 ring-orange ring-offset-2'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute left-2 top-2 rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Primary
                    </div>
                  )}
                </div>
              ))}
              {/* Placeholder slots */}
              {Array.from({ length: Math.max(0, 4 - product.images.length) }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-cream-card"
                >
                  <Package className="h-8 w-8 text-border" />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-text">Description</h3>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">
              {category?.icon} {category?.name} Specifications
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.attributes).map(([key, value]) => {
                if (value === undefined || value === '') return null
                const attr = category?.attributes.find((a) => a.fieldName === key)
                const displayValue = typeof value === 'object' && !Array.isArray(value)
                  ? Object.entries(value as Record<string, unknown>)
                      .filter(([_, v]) => v !== undefined)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' × ')
                  : Array.isArray(value)
                  ? value.join(', ')
                  : String(value)

                return (
                  <div key={key} className="flex justify-between gap-2 border-b border-border pb-2 last:border-0">
                    <span className="text-sm text-muted capitalize">
                      {attr?.name || key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium text-text text-right">
                      {displayValue}
                      {attr?.unit ? ` ${attr.unit}` : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Search Tags */}
          {product.searchTags.length > 0 && (
            <div className="rounded-xl border border-border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-text">Search Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.searchTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-cream-card border border-border"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted">
                  <Eye className="h-4 w-4" />
                </div>
                <p className="mt-1 font-serif text-xl font-bold text-text">{product.views}</p>
                <p className="text-xs text-muted">Views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="mt-1 font-serif text-xl font-bold text-text">{product.orders}</p>
                <p className="text-xs text-muted">Orders</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted">
                  <Heart className="h-4 w-4" />
                </div>
                <p className="mt-1 font-serif text-xl font-bold text-text">{product.wishlistCount}</p>
                <p className="text-xs text-muted">Wishlist</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">Pricing</h3>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-text">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(product.sellingPrice)}
              </span>
              {product.mrp && (
                <span className="text-lg text-muted line-through">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(product.mrp)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <Badge className="bg-green-bg text-green-text border border-green/20 hover:bg-green-bg">
                {discount}% discount applied
              </Badge>
            )}
          </div>

          {/* Inventory */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">Inventory</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Stock Quantity</span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    product.stockQuantity === 0
                      ? 'text-red'
                      : product.stockQuantity < 5
                      ? 'text-orange'
                      : 'text-green'
                  )}
                >
                  {product.stockQuantity} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">SKU</span>
                <span className="text-sm font-medium text-text font-mono">{product.sku}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Origin */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">Shipping & Origin</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-muted">State of Origin</p>
                  <p className="text-sm font-medium text-text">{product.stateOfOrigin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 flex-shrink-0 text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Dispatch Time</p>
                  <p className="text-sm font-medium text-text">{product.dispatchTime}</p>
                </div>
              </div>
              {product.customisationAvailable && (
                <div className="rounded-lg bg-orange-light p-3">
                  <p className="text-xs font-medium text-orange">
                    Customisation Available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-text">Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 flex-shrink-0 text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Created</p>
                  <p className="text-sm font-medium text-text">
                    {new Date(product.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Last Updated</p>
                  <p className="text-sm font-medium text-text">
                    {new Date(product.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {product.publishedAt && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green mt-0.5" />
                  <div>
                    <p className="text-xs text-muted">Published</p>
                    <p className="text-sm font-medium text-text">
                      {new Date(product.publishedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
