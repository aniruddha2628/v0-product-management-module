// Product types for ArtisanHub

export type ProductStatus = 'draft' | 'pending_review' | 'active' | 'rejected' | 'out_of_stock' | 'archived'

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

export interface ProductDimensions {
  length?: number
  width?: number
  height?: number
  unit: 'cm' | 'inches'
}

export interface Product {
  id: string
  title: string
  description: string
  categoryId: string
  categoryName: string
  subCategoryId: string
  subCategoryName: string
  
  // Pricing
  sellingPrice: number
  mrp?: number
  currency: string
  
  // Inventory
  stockQuantity: number
  sku: string
  lowStockThreshold?: number
  
  // Media
  images: ProductImage[]
  
  // Shared attributes
  stateOfOrigin: string
  giTagCertified: boolean
  dispatchTime: string
  customisationAvailable: boolean
  searchTags: string[]
  
  // Category-specific attributes (dynamic)
  attributes: Record<string, unknown>
  
  // Status
  status: ProductStatus
  statusReason?: string
  
  // Analytics
  views: number
  orders: number
  wishlistCount: number
  
  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface ProductStats {
  total: number
  active: number
  draft: number
  pendingReview: number
  rejected: number
  outOfStock: number
  archived: number
}

export interface ProductFilters {
  status?: ProductStatus | 'all'
  category?: string
  search?: string
  sortBy?: 'newest' | 'oldest' | 'price_high' | 'price_low' | 'most_views' | 'most_orders'
}

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Handmade Blue Pottery Vase - Traditional Jaipur Design',
    description: 'Beautiful handcrafted blue pottery vase featuring traditional Jaipur floral motifs. Made using centuries-old techniques passed down through generations.',
    categoryId: 'pottery-ceramics',
    categoryName: 'Pottery & Ceramics',
    subCategoryId: 'blue-pottery',
    subCategoryName: 'Blue Pottery',
    sellingPrice: 1850,
    mrp: 2200,
    currency: 'INR',
    stockQuantity: 8,
    sku: 'BP-VASE-001',
    images: [
      { id: '1', url: '/placeholder.svg?height=400&width=400', alt: 'Blue pottery vase front view', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Rajasthan',
    giTagCertified: true,
    dispatchTime: '3-5 business days',
    customisationAvailable: true,
    searchTags: ['blue pottery', 'vase', 'jaipur', 'handmade', 'home decor'],
    attributes: {
      clayType: 'Quartz-mix (blue pottery)',
      firingTechnique: 'Kiln-fired',
      glazeType: 'Full glaze',
      finish: ['Hand-painted'],
      dimensions: { length: 15, width: 15, height: 25 },
      weight: 850,
      foodSafe: false,
      craftTradition: 'Blue pottery (Jaipur)',
    },
    status: 'active',
    views: 324,
    orders: 12,
    wishlistCount: 45,
    createdAt: '2026-03-15T10:30:00Z',
    updatedAt: '2026-04-10T14:20:00Z',
    publishedAt: '2026-03-16T09:00:00Z',
  },
  {
    id: '2',
    title: 'Madhubani Fish Painting on Handmade Paper - Original Art',
    description: 'Authentic Madhubani painting featuring the traditional fish motif, symbolizing fertility and prosperity. Hand-painted using natural pigments.',
    categoryId: 'paintings-folk-art',
    categoryName: 'Paintings & Folk Art',
    subCategoryId: 'madhubani',
    subCategoryName: 'Madhubani / Mithila',
    sellingPrice: 3500,
    mrp: 4000,
    currency: 'INR',
    stockQuantity: 5,
    sku: 'MP-FISH-002',
    images: [
      { id: '2', url: '/placeholder.svg?height=400&width=400', alt: 'Madhubani fish painting', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Bihar',
    giTagCertified: true,
    dispatchTime: '1-2 business days',
    customisationAvailable: false,
    searchTags: ['madhubani', 'painting', 'folk art', 'mithila', 'fish'],
    attributes: {
      artStyle: 'Madhubani',
      surface: 'Handmade paper',
      medium: ['Natural / vegetable pigments'],
      artDimensions: '45 × 30 cm',
      framed: 'Unframed (rolled)',
      signed: true,
      certificate: true,
      subject: ['Nature & flora', 'Village life'],
    },
    status: 'active',
    views: 189,
    orders: 6,
    wishlistCount: 28,
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-04-08T16:45:00Z',
    publishedAt: '2026-02-21T08:30:00Z',
  },
  {
    id: '3',
    title: 'Handwoven Chanderi Silk Saree - Zari Border',
    description: 'Elegant Chanderi silk saree with intricate zari border work. Lightweight and comfortable, perfect for festive occasions.',
    categoryId: 'handloom-textiles',
    categoryName: 'Handloom & Textiles',
    subCategoryId: 'sarees',
    subCategoryName: 'Sarees',
    sellingPrice: 8500,
    mrp: 10000,
    currency: 'INR',
    stockQuantity: 3,
    sku: 'TX-SAR-003',
    images: [
      { id: '3', url: '/placeholder.svg?height=400&width=400', alt: 'Chanderi silk saree', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Madhya Pradesh',
    giTagCertified: true,
    dispatchTime: '3-5 business days',
    customisationAvailable: true,
    searchTags: ['chanderi', 'saree', 'silk', 'handwoven', 'zari'],
    attributes: {
      fabricType: 'Chanderi',
      weaveTechnique: 'Handloom (plain)',
      productType: 'Saree',
      textileDimensions: '5.5m × 1.1m',
      blousePiece: 'Yes',
      washCare: ['Dry clean only'],
      occasion: ['Festive', 'Wedding'],
      transparency: 'Semi-transparent',
      craftTradition: 'Chanderi',
    },
    status: 'active',
    views: 567,
    orders: 4,
    wishlistCount: 89,
    createdAt: '2026-01-10T09:15:00Z',
    updatedAt: '2026-04-12T11:30:00Z',
    publishedAt: '2026-01-11T10:00:00Z',
  },
  {
    id: '4',
    title: 'Dokra Brass Horse Figurine - Tribal Art',
    description: 'Traditional Dokra cast brass horse figurine using the ancient lost-wax casting technique. Each piece is unique and handmade by tribal artisans.',
    categoryId: 'metal-craft',
    categoryName: 'Metal Craft & Brassware',
    subCategoryId: 'dhokra',
    subCategoryName: 'Dhokra Craft',
    sellingPrice: 2800,
    currency: 'INR',
    stockQuantity: 12,
    sku: 'MC-DHK-004',
    images: [
      { id: '4', url: '/placeholder.svg?height=400&width=400', alt: 'Dokra brass horse', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'West Bengal',
    giTagCertified: true,
    dispatchTime: '1 week',
    customisationAvailable: false,
    searchTags: ['dokra', 'brass', 'horse', 'tribal', 'figurine'],
    attributes: {
      metalType: 'Brass',
      craftTechnique: 'Lost-wax casting (Dhokra)',
      finish: 'Antique / oxidised',
      dimensions: { length: 20, width: 8, height: 18 },
      weight: 650,
    },
    status: 'active',
    views: 234,
    orders: 8,
    wishlistCount: 34,
    createdAt: '2026-03-01T14:00:00Z',
    updatedAt: '2026-04-11T09:20:00Z',
    publishedAt: '2026-03-02T11:00:00Z',
  },
  {
    id: '5',
    title: 'Phulkari Dupatta - Hand Embroidered',
    description: 'Traditional Punjab Phulkari dupatta with vibrant hand embroidery. Features classic geometric patterns in silk thread on cotton base.',
    categoryId: 'embroidery-needlework',
    categoryName: 'Embroidery & Needlework',
    subCategoryId: 'phulkari',
    subCategoryName: 'Phulkari',
    sellingPrice: 4200,
    mrp: 4800,
    currency: 'INR',
    stockQuantity: 0,
    sku: 'EM-PHK-005',
    images: [
      { id: '5', url: '/placeholder.svg?height=400&width=400', alt: 'Phulkari dupatta', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Punjab',
    giTagCertified: true,
    dispatchTime: '3-5 business days',
    customisationAvailable: false,
    searchTags: ['phulkari', 'dupatta', 'embroidery', 'punjab', 'handmade'],
    attributes: {
      embroideryTechnique: 'Phulkari',
      baseFabric: 'Cotton',
      threadMaterial: ['Silk thread'],
      coverage: 'All-over',
      productType: 'Dupatta',
      dimensions: '2.5m × 1m',
      washCare: ['Hand wash cold', 'Do not wring'],
      stitchHours: '50–100h',
    },
    status: 'out_of_stock',
    views: 412,
    orders: 15,
    wishlistCount: 67,
    createdAt: '2025-12-15T08:00:00Z',
    updatedAt: '2026-04-05T17:00:00Z',
    publishedAt: '2025-12-16T09:30:00Z',
  },
  {
    id: '6',
    title: 'Terracotta Table Lamp - Handcrafted',
    description: 'Unique terracotta table lamp with hand-carved patterns. Creates beautiful ambient lighting with warm, earthy tones.',
    categoryId: 'pottery-ceramics',
    categoryName: 'Pottery & Ceramics',
    subCategoryId: 'diyas-lamps',
    subCategoryName: 'Diyas, Lamps & Ritual Items',
    sellingPrice: 1200,
    currency: 'INR',
    stockQuantity: 15,
    sku: 'PC-LAMP-006',
    images: [
      { id: '6', url: '/placeholder.svg?height=400&width=400', alt: 'Terracotta lamp', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Gujarat',
    giTagCertified: false,
    dispatchTime: '1-2 business days',
    customisationAvailable: true,
    searchTags: ['terracotta', 'lamp', 'home decor', 'handmade', 'lighting'],
    attributes: {
      clayType: 'Terracotta',
      firingTechnique: 'Wood-fired',
      finish: ['Plain / natural'],
      dimensions: { length: 12, width: 12, height: 30 },
      weight: 950,
      foodSafe: false,
    },
    status: 'draft',
    views: 0,
    orders: 0,
    wishlistCount: 0,
    createdAt: '2026-04-12T10:00:00Z',
    updatedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: '7',
    title: 'Kolhapuri Leather Chappals - Women',
    description: 'Authentic hand-stitched Kolhapuri chappals made with vegetable-tanned leather. Classic design with modern comfort.',
    categoryId: 'leather-goods',
    categoryName: 'Leather Goods',
    subCategoryId: 'footwear',
    subCategoryName: 'Footwear',
    sellingPrice: 1500,
    mrp: 1800,
    currency: 'INR',
    stockQuantity: 20,
    sku: 'LG-KOL-007',
    images: [
      { id: '7', url: '/placeholder.svg?height=400&width=400', alt: 'Kolhapuri chappals', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Maharashtra',
    giTagCertified: true,
    dispatchTime: '3-5 business days',
    customisationAvailable: true,
    searchTags: ['kolhapuri', 'chappals', 'leather', 'footwear', 'handmade'],
    attributes: {
      leatherType: 'Tan leather',
      tanningProcess: 'Vegetable tanned',
      embellishment: ['Plain'],
      dimensions: { length: 25, width: 10, height: 2 },
      footwearSize: '6',
    },
    status: 'pending_review',
    views: 0,
    orders: 0,
    wishlistCount: 0,
    createdAt: '2026-04-10T15:30:00Z',
    updatedAt: '2026-04-10T15:30:00Z',
  },
  {
    id: '8',
    title: 'Warli Art Coasters Set of 4',
    description: 'Hand-painted Warli art coasters on natural wood. Each coaster features unique tribal motifs depicting village life.',
    categoryId: 'wood-craft',
    categoryName: 'Wood Craft & Carving',
    subCategoryId: 'kitchenware-wood',
    subCategoryName: 'Kitchenware & Tableware',
    sellingPrice: 650,
    mrp: 800,
    currency: 'INR',
    stockQuantity: 25,
    sku: 'WC-COA-008',
    images: [
      { id: '8', url: '/placeholder.svg?height=400&width=400', alt: 'Warli coasters', isPrimary: true, order: 1 },
    ],
    stateOfOrigin: 'Maharashtra',
    giTagCertified: false,
    dispatchTime: '1-2 business days',
    customisationAvailable: false,
    searchTags: ['warli', 'coasters', 'wood', 'tableware', 'tribal art'],
    attributes: {
      woodType: 'Mango wood',
      craftTechnique: 'Hand-painted',
      finish: ['Lacquer-coated'],
      dimensions: { length: 10, width: 10, height: 1 },
      weight: 200,
    },
    status: 'rejected',
    statusReason: 'Images do not meet quality standards. Please upload high-resolution product photos with proper lighting.',
    views: 0,
    orders: 0,
    wishlistCount: 0,
    createdAt: '2026-04-08T09:00:00Z',
    updatedAt: '2026-04-09T14:00:00Z',
  },
]

export const mockProductStats: ProductStats = {
  total: mockProducts.length,
  active: mockProducts.filter(p => p.status === 'active').length,
  draft: mockProducts.filter(p => p.status === 'draft').length,
  pendingReview: mockProducts.filter(p => p.status === 'pending_review').length,
  rejected: mockProducts.filter(p => p.status === 'rejected').length,
  outOfStock: mockProducts.filter(p => p.status === 'out_of_stock').length,
  archived: mockProducts.filter(p => p.status === 'archived').length,
}
