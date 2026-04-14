'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Download,
  MessageSquare,
  RotateCcw,
  User,
  CreditCard,
  Calendar,
  AlertCircle,
  ChevronRight,
  Printer,
  IndianRupee,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SellerLayout } from '@/components/seller/seller-layout'
import { mockOrders } from '@/lib/mock-orders'
import { 
  orderStatusConfig, 
  paymentStatusConfig, 
  paymentMethodLabels,
  type OrderStatus, 
  type Order 
} from '@/lib/types/order'
import { cn } from '@/lib/utils'

const StatusIcon = ({ status, className }: { status: OrderStatus; className?: string }) => {
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
  return <Icon className={cn('h-4 w-4', className)} />
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
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

const courierPartners = [
  { value: 'dtdc', label: 'DTDC Express' },
  { value: 'bluedart', label: 'BlueDart' },
  { value: 'delhivery', label: 'Delhivery' },
  { value: 'ecom', label: 'Ecom Express' },
  { value: 'xpressbees', label: 'XpressBees' },
  { value: 'india-post', label: 'India Post' },
]

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const order = mockOrders.find(o => o.id === resolvedParams.id)

  const [isUpdating, setIsUpdating] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showShipDialog, setShowShipDialog] = useState(false)
  const [sellerNote, setSellerNote] = useState(order?.sellerNote || '')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [courierPartner, setCourierPartner] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  if (!order) {
    return (
      <SellerLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-card">
            <Package className="h-8 w-8 text-muted" />
          </div>
          <p className="mt-4 font-medium text-text">Order not found</p>
          <p className="mt-1 text-sm text-muted">This order may have been deleted or does not exist.</p>
          <Link href="/seller/orders">
            <Button className="mt-4 gap-2" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </SellerLayout>
    )
  }

  const statusConfig = orderStatusConfig[order.status]
  const paymentConfig = paymentStatusConfig[order.paymentStatus]

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsUpdating(false)
    // In real app, update the order and refresh
    router.refresh()
  }

  const handleAcceptOrder = () => handleStatusUpdate('accepted')
  const handleMarkAsPacked = () => handleStatusUpdate('packed')
  const handleMarkAsShipped = () => {
    setShowShipDialog(true)
  }
  const handleConfirmShip = async () => {
    setIsUpdating(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsUpdating(false)
    setShowShipDialog(false)
    router.refresh()
  }
  const handleMarkAsDelivered = () => handleStatusUpdate('delivered')

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/seller/orders">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-xl font-bold text-text sm:text-2xl">
                  {order.orderNumber}
                </h1>
                <Badge
                  className={cn(
                    'gap-1.5 border text-xs font-semibold',
                    statusConfig.bgColor,
                    statusConfig.color,
                    statusConfig.borderColor
                  )}
                >
                  <StatusIcon status={order.status} className="h-3.5 w-3.5" />
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 border-border text-muted">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 border-border text-muted">
              <Download className="h-4 w-4" />
              Invoice
            </Button>
          </div>
        </div>

        {/* Action Banner for Pending Orders */}
        {order.status === 'pending' && (
          <div className="flex flex-col gap-4 rounded-xl border border-orange/30 bg-orange-pale p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange/20">
                <AlertCircle className="h-5 w-5 text-orange" />
              </div>
              <div>
                <p className="font-medium text-text">New order awaiting your acceptance</p>
                <p className="text-sm text-muted">
                  Please review the order details and accept within 24 hours to avoid auto-cancellation.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="border-red/30 text-red hover:bg-red-bg"
              >
                Decline
              </Button>
              <Button
                onClick={handleAcceptOrder}
                disabled={isUpdating}
                className="gap-1.5 bg-orange text-white hover:bg-orange-hover"
              >
                {isUpdating ? 'Accepting...' : 'Accept Order'}
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress Steps for Active Orders */}
        {!['cancelled', 'returned'].includes(order.status) && (
          <div className="rounded-xl border border-border bg-white p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-text">Order Progress</h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {(['pending', 'accepted', 'packed', 'shipped', 'delivered'] as OrderStatus[]).map((step, index) => {
                  const stepConfig = orderStatusConfig[step]
                  const stepIndex = ['pending', 'accepted', 'packed', 'shipped', 'delivered'].indexOf(step)
                  const currentIndex = ['pending', 'accepted', 'packed', 'shipped', 'delivered'].indexOf(order.status)
                  const isCompleted = stepIndex < currentIndex
                  const isCurrent = step === order.status
                  const isUpcoming = stepIndex > currentIndex

                  return (
                    <div key={step} className="flex flex-1 flex-col items-center">
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                            isCompleted && 'border-green bg-green-bg',
                            isCurrent && 'border-orange bg-orange-light',
                            isUpcoming && 'border-border bg-white'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-text" />
                          ) : (
                            <StatusIcon
                              status={step}
                              className={cn(
                                isCurrent ? 'text-orange' : 'text-muted'
                              )}
                            />
                          )}
                        </div>
                        <p
                          className={cn(
                            'mt-2 text-center text-xs font-medium',
                            isCompleted && 'text-green-text',
                            isCurrent && 'text-orange',
                            isUpcoming && 'text-muted'
                          )}
                        >
                          {stepConfig.label}
                        </p>
                        {isCurrent && order.timeline.find(t => t.status === step) && (
                          <p className="mt-0.5 text-center text-[10px] text-muted">
                            {formatDateTime(order.timeline.find(t => t.status === step)!.timestamp)}
                          </p>
                        )}
                      </div>
                      {index < 4 && (
                        <div
                          className={cn(
                            'absolute top-5 h-0.5 w-full -translate-y-1/2',
                            isCompleted ? 'bg-green' : 'bg-border'
                          )}
                          style={{
                            left: `${(index + 0.5) * 25}%`,
                            width: '25%',
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next Action Button */}
            {statusConfig.nextAction && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => {
                    if (order.status === 'pending') handleAcceptOrder()
                    else if (order.status === 'accepted') handleMarkAsPacked()
                    else if (order.status === 'packed') handleMarkAsShipped()
                    else if (order.status === 'shipped') handleMarkAsDelivered()
                  }}
                  disabled={isUpdating}
                  className="gap-2 bg-orange text-white hover:bg-orange-hover"
                >
                  {isUpdating ? 'Updating...' : statusConfig.nextAction}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Order Items & Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items */}
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3 sm:px-6">
                <h3 className="font-semibold text-text">Order Items</h3>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 sm:p-6">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-cream-card">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/seller/products/${item.productId}`}
                        className="font-medium text-text hover:text-orange"
                      >
                        {item.productName}
                      </Link>
                      {item.variant && (
                        <p className="mt-0.5 text-sm text-muted">Variant: {item.variant}</p>
                      )}
                      {item.customization && (
                        <p className="mt-1 rounded bg-orange-pale px-2 py-1 text-xs text-orange">
                          Customization: {item.customization}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-muted">Qty: {item.quantity}</span>
                        <span className="text-muted">@</span>
                        <span className="text-muted">{formatCurrency(item.unitPrice)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text">{formatCurrency(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-border bg-cream/30 px-4 py-4 sm:px-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-text">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span className="text-text">
                      {order.shippingCharge === 0 ? 'Free' : formatCurrency(order.shippingCharge)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-text">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                    <span className="text-text">Total</span>
                    <span className="text-text">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3 sm:px-6">
                <h3 className="font-semibold text-text">Order Timeline</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="relative space-y-6">
                  {order.timeline.slice().reverse().map((event, index) => {
                    const config = orderStatusConfig[event.status]
                    return (
                      <div key={index} className="relative flex gap-4 pl-6">
                        <div
                          className={cn(
                            'absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full',
                            config.bgColor
                          )}
                        >
                          <StatusIcon status={event.status} className={cn('h-3 w-3', config.color)} />
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className="absolute left-[9px] top-6 h-full w-px bg-border" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-text">{config.label}</p>
                            <span className="text-xs text-muted">{formatDateTime(event.timestamp)}</span>
                          </div>
                          {event.note && <p className="mt-0.5 text-sm text-muted">{event.note}</p>}
                          {event.updatedBy && (
                            <p className="mt-0.5 text-xs text-muted">by {event.updatedBy}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Seller Notes */}
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3 sm:px-6">
                <h3 className="font-semibold text-text">Seller Notes</h3>
              </div>
              <div className="p-4 sm:p-6">
                <Textarea
                  placeholder="Add private notes about this order (only visible to you)..."
                  value={sellerNote}
                  onChange={(e) => setSellerNote(e.target.value)}
                  className="min-h-[100px] resize-none border-border bg-input-bg"
                />
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="outline" className="border-border">
                    Save Note
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-semibold text-text">Customer</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-light">
                    <User className="h-5 w-5 text-orange" />
                  </div>
                  <div>
                    <p className="font-medium text-text">{order.customerName}</p>
                    <p className="text-xs text-muted">Customer since Jan 2026</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Phone className="h-4 w-4" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.customerPhone, 'phone')}
                      className="text-muted hover:text-orange"
                    >
                      {copied === 'phone' ? (
                        <Check className="h-4 w-4 text-green" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{order.customerEmail}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.customerEmail, 'email')}
                      className="text-muted hover:text-orange"
                    >
                      {copied === 'email' ? (
                        <Check className="h-4 w-4 text-green" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {order.customerNote && (
                  <div className="mt-4 rounded-lg border border-orange/30 bg-orange-pale p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange" />
                      <div>
                        <p className="text-xs font-medium text-orange">Customer Note</p>
                        <p className="mt-0.5 text-sm text-text">{order.customerNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-semibold text-text">Shipping Address</h3>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted" />
                  <div className="text-sm">
                    <p className="font-medium text-text">{order.shippingAddress.fullName}</p>
                    <p className="text-muted">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p className="text-muted">{order.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-muted">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    {order.shippingAddress.landmark && (
                      <p className="mt-1 text-xs text-muted">
                        Landmark: {order.shippingAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Phone className="h-4 w-4" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-semibold text-text">Payment</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted" />
                    <span className="text-sm text-text">
                      {paymentMethodLabels[order.paymentMethod]}
                    </span>
                  </div>
                  <Badge
                    className={cn(
                      'border text-xs',
                      paymentConfig.bgColor,
                      paymentConfig.color
                    )}
                  >
                    {paymentConfig.label}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted">Order Total</span>
                  <span className="font-semibold text-text">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Tracking */}
            {order.trackingNumber && (
              <div className="rounded-xl border border-border bg-white">
                <div className="border-b border-border px-4 py-3">
                  <h3 className="font-semibold text-text">Tracking</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{order.courierPartner}</p>
                      <p className="text-xs text-muted">{order.trackingNumber}</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5 border-border">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Track
                    </Button>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted" />
                      <span className="text-muted">
                        Expected by {formatDate(order.estimatedDelivery)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {!['delivered', 'cancelled', 'returned'].includes(order.status) && (
              <div className="rounded-xl border border-red/20 bg-red-bg/50 p-4">
                <h4 className="text-sm font-medium text-red">Need to cancel?</h4>
                <p className="mt-1 text-xs text-muted">
                  If you cannot fulfill this order, you can cancel it.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelDialog(true)}
                  className="mt-3 border-red/30 text-red hover:bg-red-bg"
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The customer will be notified and refunded if payment was already made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction className="bg-red text-white hover:bg-red/90">
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ship Dialog */}
      <Dialog open={showShipDialog} onOpenChange={setShowShipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shipping Details</DialogTitle>
            <DialogDescription>
              Enter the tracking information to mark this order as shipped.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="courier">Courier Partner</Label>
              <Select value={courierPartner} onValueChange={setCourierPartner}>
                <SelectTrigger id="courier" className="border-border">
                  <SelectValue placeholder="Select courier partner" />
                </SelectTrigger>
                <SelectContent>
                  {courierPartners.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="e.g., DTDC123456789"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShipDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmShip}
              disabled={!courierPartner || !trackingNumber || isUpdating}
              className="bg-orange text-white hover:bg-orange-hover"
            >
              {isUpdating ? 'Updating...' : 'Mark as Shipped'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SellerLayout>
  )
}
