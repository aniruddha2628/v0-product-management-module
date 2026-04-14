import type { Order } from './types/order'

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'AH-2026-001234',
    customerId: 'cust-001',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rahul.verma@email.com',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Blue Pottery Vase - Large',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Large (12 inch)',
        quantity: 1,
        unitPrice: 2500,
        totalPrice: 2500
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Blue Pottery Coaster Set',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Set of 6',
        quantity: 2,
        unitPrice: 800,
        totalPrice: 1600
      }
    ],
    shippingAddress: {
      fullName: 'Rahul Verma',
      phone: '+91 98765 43210',
      addressLine1: '42, Sunrise Apartments',
      addressLine2: 'Near City Mall, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      landmark: 'Opposite Metro Station'
    },
    status: 'pending',
    timeline: [
      { status: 'pending', timestamp: '2026-04-13T10:30:00Z', note: 'Order placed by customer' }
    ],
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    subtotal: 4100,
    shippingCharge: 150,
    discount: 200,
    total: 4050,
    customerNote: 'Please pack carefully, this is a gift.',
    createdAt: '2026-04-13T10:30:00Z',
    updatedAt: '2026-04-13T10:30:00Z',
    estimatedDelivery: '2026-04-18'
  },
  {
    id: '2',
    orderNumber: 'AH-2026-001235',
    customerId: 'cust-002',
    customerName: 'Anjali Patel',
    customerPhone: '+91 87654 32109',
    customerEmail: 'anjali.patel@email.com',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Hand-Painted Ceramic Plate',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Medium (10 inch)',
        quantity: 4,
        unitPrice: 1200,
        totalPrice: 4800,
        customization: 'Custom floral pattern as discussed'
      }
    ],
    shippingAddress: {
      fullName: 'Anjali Patel',
      phone: '+91 87654 32109',
      addressLine1: '15, Green Valley Society',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015'
    },
    status: 'accepted',
    timeline: [
      { status: 'pending', timestamp: '2026-04-12T14:20:00Z', note: 'Order placed by customer' },
      { status: 'accepted', timestamp: '2026-04-12T16:45:00Z', note: 'Order accepted', updatedBy: 'Priya Sharma' }
    ],
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 4800,
    shippingCharge: 200,
    discount: 0,
    total: 5000,
    createdAt: '2026-04-12T14:20:00Z',
    updatedAt: '2026-04-12T16:45:00Z',
    acceptedAt: '2026-04-12T16:45:00Z',
    estimatedDelivery: '2026-04-17'
  },
  {
    id: '3',
    orderNumber: 'AH-2026-001230',
    customerId: 'cust-003',
    customerName: 'Vikram Singh',
    customerPhone: '+91 76543 21098',
    customerEmail: 'vikram.singh@email.com',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Traditional Copper Water Pot',
        productImage: '/placeholder.svg?height=80&width=80',
        quantity: 1,
        unitPrice: 3500,
        totalPrice: 3500
      }
    ],
    shippingAddress: {
      fullName: 'Vikram Singh',
      phone: '+91 76543 21098',
      addressLine1: '78, Royal Residency',
      addressLine2: 'Sector 21',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302017',
      landmark: 'Near Central Park'
    },
    status: 'packed',
    timeline: [
      { status: 'pending', timestamp: '2026-04-11T09:00:00Z', note: 'Order placed by customer' },
      { status: 'accepted', timestamp: '2026-04-11T11:30:00Z', note: 'Order accepted', updatedBy: 'Priya Sharma' },
      { status: 'packed', timestamp: '2026-04-12T10:00:00Z', note: 'Order packed and ready', updatedBy: 'Priya Sharma' }
    ],
    paymentStatus: 'paid',
    paymentMethod: 'netbanking',
    subtotal: 3500,
    shippingCharge: 100,
    discount: 0,
    total: 3600,
    createdAt: '2026-04-11T09:00:00Z',
    updatedAt: '2026-04-12T10:00:00Z',
    acceptedAt: '2026-04-11T11:30:00Z',
    packedAt: '2026-04-12T10:00:00Z',
    estimatedDelivery: '2026-04-15'
  },
  {
    id: '4',
    orderNumber: 'AH-2026-001225',
    customerId: 'cust-004',
    customerName: 'Meera Reddy',
    customerPhone: '+91 65432 10987',
    customerEmail: 'meera.reddy@email.com',
    items: [
      {
        id: 'item-5',
        productId: 'prod-5',
        productName: 'Handwoven Silk Scarf',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Peacock Blue',
        quantity: 2,
        unitPrice: 2200,
        totalPrice: 4400
      },
      {
        id: 'item-6',
        productId: 'prod-6',
        productName: 'Brass Diya Set',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Set of 5',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500
      }
    ],
    shippingAddress: {
      fullName: 'Meera Reddy',
      phone: '+91 65432 10987',
      addressLine1: '23, Lake View Apartments',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032'
    },
    status: 'shipped',
    timeline: [
      { status: 'pending', timestamp: '2026-04-09T16:00:00Z', note: 'Order placed by customer' },
      { status: 'accepted', timestamp: '2026-04-09T18:00:00Z', note: 'Order accepted', updatedBy: 'Priya Sharma' },
      { status: 'packed', timestamp: '2026-04-10T11:00:00Z', note: 'Order packed', updatedBy: 'Priya Sharma' },
      { status: 'shipped', timestamp: '2026-04-10T14:30:00Z', note: 'Handed over to courier', updatedBy: 'Priya Sharma' }
    ],
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    subtotal: 5900,
    shippingCharge: 0,
    discount: 500,
    total: 5400,
    trackingNumber: 'DTDC123456789',
    courierPartner: 'DTDC Express',
    createdAt: '2026-04-09T16:00:00Z',
    updatedAt: '2026-04-10T14:30:00Z',
    acceptedAt: '2026-04-09T18:00:00Z',
    packedAt: '2026-04-10T11:00:00Z',
    shippedAt: '2026-04-10T14:30:00Z',
    estimatedDelivery: '2026-04-14'
  },
  {
    id: '5',
    orderNumber: 'AH-2026-001220',
    customerId: 'cust-005',
    customerName: 'Arjun Nair',
    customerPhone: '+91 54321 09876',
    customerEmail: 'arjun.nair@email.com',
    items: [
      {
        id: 'item-7',
        productId: 'prod-7',
        productName: 'Wooden Carved Elephant',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Large',
        quantity: 1,
        unitPrice: 4500,
        totalPrice: 4500
      }
    ],
    shippingAddress: {
      fullName: 'Arjun Nair',
      phone: '+91 54321 09876',
      addressLine1: '56, Coconut Grove',
      addressLine2: 'Ernakulam',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682016'
    },
    status: 'delivered',
    timeline: [
      { status: 'pending', timestamp: '2026-04-05T10:00:00Z', note: 'Order placed by customer' },
      { status: 'accepted', timestamp: '2026-04-05T12:00:00Z', note: 'Order accepted', updatedBy: 'Priya Sharma' },
      { status: 'packed', timestamp: '2026-04-06T09:00:00Z', note: 'Order packed', updatedBy: 'Priya Sharma' },
      { status: 'shipped', timestamp: '2026-04-06T11:00:00Z', note: 'Shipped via BlueDart', updatedBy: 'Priya Sharma' },
      { status: 'delivered', timestamp: '2026-04-08T15:30:00Z', note: 'Delivered successfully' }
    ],
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 4500,
    shippingCharge: 250,
    discount: 0,
    total: 4750,
    trackingNumber: 'BD987654321',
    courierPartner: 'BlueDart',
    createdAt: '2026-04-05T10:00:00Z',
    updatedAt: '2026-04-08T15:30:00Z',
    acceptedAt: '2026-04-05T12:00:00Z',
    packedAt: '2026-04-06T09:00:00Z',
    shippedAt: '2026-04-06T11:00:00Z',
    deliveredAt: '2026-04-08T15:30:00Z',
    estimatedDelivery: '2026-04-09'
  },
  {
    id: '6',
    orderNumber: 'AH-2026-001218',
    customerId: 'cust-006',
    customerName: 'Sneha Kulkarni',
    customerPhone: '+91 43210 98765',
    customerEmail: 'sneha.kulkarni@email.com',
    items: [
      {
        id: 'item-8',
        productId: 'prod-8',
        productName: 'Hand-embroidered Cushion Cover',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: '16x16 inch',
        quantity: 4,
        unitPrice: 850,
        totalPrice: 3400
      }
    ],
    shippingAddress: {
      fullName: 'Sneha Kulkarni',
      phone: '+91 43210 98765',
      addressLine1: '89, Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005'
    },
    status: 'cancelled',
    timeline: [
      { status: 'pending', timestamp: '2026-04-04T11:00:00Z', note: 'Order placed by customer' },
      { status: 'cancelled', timestamp: '2026-04-04T14:00:00Z', note: 'Cancelled by customer - found different design' }
    ],
    paymentStatus: 'refunded',
    paymentMethod: 'upi',
    subtotal: 3400,
    shippingCharge: 100,
    discount: 0,
    total: 3500,
    createdAt: '2026-04-04T11:00:00Z',
    updatedAt: '2026-04-04T14:00:00Z'
  },
  {
    id: '7',
    orderNumber: 'AH-2026-001240',
    customerId: 'cust-007',
    customerName: 'Pradeep Sharma',
    customerPhone: '+91 99887 76655',
    customerEmail: 'pradeep.sharma@email.com',
    items: [
      {
        id: 'item-9',
        productId: 'prod-9',
        productName: 'Terracotta Wall Hanging',
        productImage: '/placeholder.svg?height=80&width=80',
        quantity: 2,
        unitPrice: 1800,
        totalPrice: 3600
      }
    ],
    shippingAddress: {
      fullName: 'Pradeep Sharma',
      phone: '+91 99887 76655',
      addressLine1: '12, Gandhi Road',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001'
    },
    status: 'pending',
    timeline: [
      { status: 'pending', timestamp: '2026-04-13T08:15:00Z', note: 'Order placed by customer' }
    ],
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    subtotal: 3600,
    shippingCharge: 150,
    discount: 100,
    total: 3650,
    customerNote: 'Please ensure bubble wrap packaging.',
    createdAt: '2026-04-13T08:15:00Z',
    updatedAt: '2026-04-13T08:15:00Z',
    estimatedDelivery: '2026-04-18'
  },
  {
    id: '8',
    orderNumber: 'AH-2026-001242',
    customerId: 'cust-008',
    customerName: 'Kavitha Menon',
    customerPhone: '+91 88776 65544',
    customerEmail: 'kavitha.menon@email.com',
    items: [
      {
        id: 'item-10',
        productId: 'prod-10',
        productName: 'Bamboo Craft Lamp',
        productImage: '/placeholder.svg?height=80&width=80',
        variant: 'Floor Lamp',
        quantity: 1,
        unitPrice: 5500,
        totalPrice: 5500
      },
      {
        id: 'item-11',
        productId: 'prod-11',
        productName: 'Bamboo Craft Table Lamp',
        productImage: '/placeholder.svg?height=80&width=80',
        quantity: 2,
        unitPrice: 1800,
        totalPrice: 3600
      }
    ],
    shippingAddress: {
      fullName: 'Kavitha Menon',
      phone: '+91 88776 65544',
      addressLine1: '45, Beach Road',
      addressLine2: 'Thiruvananthapuram',
      city: 'Trivandrum',
      state: 'Kerala',
      pincode: '695001'
    },
    status: 'pending',
    timeline: [
      { status: 'pending', timestamp: '2026-04-13T11:45:00Z', note: 'Order placed by customer' }
    ],
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    subtotal: 9100,
    shippingCharge: 0,
    discount: 910,
    total: 8190,
    createdAt: '2026-04-13T11:45:00Z',
    updatedAt: '2026-04-13T11:45:00Z',
    estimatedDelivery: '2026-04-19'
  }
]

// Helper to get orders by status
export function getOrdersByStatus(status?: string): Order[] {
  if (!status || status === 'all') return mockOrders
  return mockOrders.filter(order => order.status === status)
}

// Helper to search orders
export function searchOrders(query: string): Order[] {
  const lowercaseQuery = query.toLowerCase()
  return mockOrders.filter(order => 
    order.orderNumber.toLowerCase().includes(lowercaseQuery) ||
    order.customerName.toLowerCase().includes(lowercaseQuery) ||
    order.items.some(item => item.productName.toLowerCase().includes(lowercaseQuery))
  )
}

// Get order statistics
export function getOrderStats() {
  const total = mockOrders.length
  const pending = mockOrders.filter(o => o.status === 'pending').length
  const processing = mockOrders.filter(o => ['accepted', 'packed'].includes(o.status)).length
  const shipped = mockOrders.filter(o => o.status === 'shipped').length
  const delivered = mockOrders.filter(o => o.status === 'delivered').length
  const cancelled = mockOrders.filter(o => o.status === 'cancelled').length
  
  const totalRevenue = mockOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)
  
  const pendingRevenue = mockOrders
    .filter(o => !['cancelled', 'returned'].includes(o.status) && o.status !== 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  return {
    total,
    pending,
    processing,
    shipped,
    delivered,
    cancelled,
    totalRevenue,
    pendingRevenue
  }
}
