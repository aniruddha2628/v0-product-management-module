// Order Status Flow: pending → accepted → packed → shipped → delivered
// Or: pending → cancelled

export type OrderStatus = 
  | 'pending'      // New order, awaiting artisan acceptance
  | 'accepted'     // Artisan accepted, preparing to pack
  | 'packed'       // Order packed, awaiting pickup
  | 'shipped'      // In transit
  | 'delivered'    // Successfully delivered
  | 'cancelled'    // Order cancelled
  | 'returned'     // Order returned

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  variant?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customization?: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
}

export interface OrderTimeline {
  status: OrderStatus
  timestamp: string
  note?: string
  updatedBy?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  
  // Status
  status: OrderStatus
  timeline: OrderTimeline[]
  
  // Payment
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  
  // Pricing
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  
  // Shipping
  trackingNumber?: string
  courierPartner?: string
  estimatedDelivery?: string
  deliveredAt?: string
  
  // Notes
  customerNote?: string
  sellerNote?: string
  
  // Timestamps
  createdAt: string
  updatedAt: string
  acceptedAt?: string
  packedAt?: string
  shippedAt?: string
}

// Status configuration for UI
export const orderStatusConfig: Record<OrderStatus, {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
  description: string
  nextStatus?: OrderStatus
  nextAction?: string
}> = {
  pending: {
    label: 'Pending',
    color: 'text-warn-text',
    bgColor: 'bg-warn-bg',
    borderColor: 'border-orange/30',
    icon: 'Clock',
    description: 'Awaiting your acceptance',
    nextStatus: 'accepted',
    nextAction: 'Accept Order'
  },
  accepted: {
    label: 'Accepted',
    color: 'text-info-text',
    bgColor: 'bg-info-bg',
    borderColor: 'border-info-border',
    icon: 'CheckCircle',
    description: 'Preparing to pack',
    nextStatus: 'packed',
    nextAction: 'Mark as Packed'
  },
  packed: {
    label: 'Packed',
    color: 'text-purple',
    bgColor: 'bg-purple-bg',
    borderColor: 'border-purple/30',
    icon: 'Package',
    description: 'Ready for pickup',
    nextStatus: 'shipped',
    nextAction: 'Mark as Shipped'
  },
  shipped: {
    label: 'Shipped',
    color: 'text-info-text',
    bgColor: 'bg-info-bg',
    borderColor: 'border-info-border',
    icon: 'Truck',
    description: 'In transit to customer',
    nextStatus: 'delivered',
    nextAction: 'Mark as Delivered'
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-text',
    bgColor: 'bg-green-bg',
    borderColor: 'border-green/30',
    icon: 'CheckCircle2',
    description: 'Successfully delivered'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red',
    bgColor: 'bg-red-bg',
    borderColor: 'border-red/30',
    icon: 'XCircle',
    description: 'Order was cancelled'
  },
  returned: {
    label: 'Returned',
    color: 'text-muted',
    bgColor: 'bg-cream-card',
    borderColor: 'border-border',
    icon: 'RotateCcw',
    description: 'Order was returned'
  }
}

export const paymentStatusConfig: Record<PaymentStatus, {
  label: string
  color: string
  bgColor: string
}> = {
  pending: { label: 'Pending', color: 'text-warn-text', bgColor: 'bg-warn-bg' },
  paid: { label: 'Paid', color: 'text-green-text', bgColor: 'bg-green-bg' },
  failed: { label: 'Failed', color: 'text-red', bgColor: 'bg-red-bg' },
  refunded: { label: 'Refunded', color: 'text-muted', bgColor: 'bg-cream-card' }
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Credit/Debit Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
  cod: 'Cash on Delivery'
}
