"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Trash2, Archive, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { categoryTaxonomy, type CategoryAttribute } from "@/lib/category-taxonomy"
import { DynamicAttributeField } from "@/components/seller/products/dynamic-attribute-field"
import { ImageUploader } from "@/components/seller/products/image-uploader"
import { TagsInput } from "@/components/seller/products/tags-input"
import { type Product, type ProductImage } from "@/lib/types/product"

// Mock product data - in real app this would come from API
const mockProduct: Product = {
  id: "prod_001",
  sellerId: "seller_001",
  name: "Hand-Painted Madhubani Silk Saree",
  slug: "hand-painted-madhubani-silk-saree",
  description: "Exquisite hand-painted Madhubani silk saree featuring traditional motifs of fish, peacocks, and lotus flowers. Each piece is meticulously crafted by skilled artisans from Bihar, showcasing the rich cultural heritage of India. The vibrant colors are derived from natural dyes, making each saree unique and eco-friendly.",
  shortDescription: "Traditional Madhubani art on pure silk with natural dyes",
  categoryId: "textiles",
  subcategoryId: "sarees",
  price: 15000,
  compareAtPrice: 18000,
  costPrice: 8000,
  currency: "INR",
  sku: "MBS-001-RED",
  barcode: "8901234567890",
  stock: 5,
  lowStockThreshold: 2,
  trackInventory: true,
  allowBackorders: false,
  weight: 500,
  weightUnit: "g",
  dimensions: { length: 600, width: 120, height: 5, unit: "cm" },
  images: [
    { id: "img1", url: "/placeholder.svg?height=600&width=600&text=Saree+Front", alt: "Madhubani Saree Front View", isPrimary: true, order: 0 },
    { id: "img2", url: "/placeholder.svg?height=600&width=600&text=Saree+Detail", alt: "Madhubani Saree Detail", isPrimary: false, order: 1 },
    { id: "img3", url: "/placeholder.svg?height=600&width=600&text=Saree+Pattern", alt: "Madhubani Pattern Close-up", isPrimary: false, order: 2 },
  ],
  attributes: {
    fabric_type: "Silk",
    weave_type: "Hand-woven",
    color_family: "Red",
    pattern_style: "Traditional",
    occasion: "Festive",
    saree_length: "5.5 meters",
    blouse_piece: "Included",
    border_type: "Contrast",
    craft_origin: "Bihar",
  },
  tags: ["madhubani", "silk saree", "handpainted", "traditional", "festive wear", "bridal"],
  metaTitle: "Hand-Painted Madhubani Silk Saree | ArtisanHub",
  metaDescription: "Shop authentic hand-painted Madhubani silk saree with traditional motifs. Crafted by skilled artisans from Bihar using natural dyes.",
  status: "active",
  visibility: "visible",
  isFeatured: true,
  isHandmade: true,
  isCustomizable: true,
  customizationOptions: "Custom colors, size alterations, and personalized motifs available on request.",
  craftStory: "This saree represents the ancient Madhubani art form that originated in the Mithila region of Bihar. Our artisan, Rekha Devi, has been practicing this craft for over 30 years, learning from her grandmother. Each motif tells a story - the fish symbolizes fertility, the peacock represents beauty, and the lotus signifies purity.",
  materials: ["Pure Mulberry Silk", "Natural Dyes", "Gold Zari Thread"],
  careInstructions: "Dry clean only. Store in a cool, dry place away from direct sunlight. Use muslin cloth for storage.",
  estimatedDelivery: { min: 7, max: 14, unit: "days" },
  returnPolicy: "7-day return policy for unused items with original packaging",
  rating: 4.8,
  reviewCount: 24,
  soldCount: 156,
  viewCount: 2450,
  wishlistCount: 89,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-03-10T14:45:00Z",
  publishedAt: "2024-01-16T09:00:00Z",
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    compareAtPrice: "",
    costPrice: "",
    sku: "",
    barcode: "",
    stock: "",
    lowStockThreshold: "",
    trackInventory: true,
    allowBackorders: false,
    weight: "",
    weightUnit: "g",
    length: "",
    width: "",
    height: "",
    dimensionUnit: "cm",
    tags: [] as string[],
    metaTitle: "",
    metaDescription: "",
    status: "draft" as "draft" | "active" | "inactive" | "archived",
    visibility: "visible" as "visible" | "hidden" | "scheduled",
    isFeatured: false,
    isHandmade: true,
    isCustomizable: false,
    customizationOptions: "",
    craftStory: "",
    materials: [] as string[],
    careInstructions: "",
    estimatedDeliveryMin: "",
    estimatedDeliveryMax: "",
    returnPolicy: "",
  })
  
  const [images, setImages] = useState<ProductImage[]>([])
  const [attributes, setAttributes] = useState<Record<string, string | string[]>>({})

  // Load product data
  useEffect(() => {
    // Simulate API call
    const loadProduct = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In real app, fetch product by params.id
      setProduct(mockProduct)
      
      // Populate form data
      setFormData({
        name: mockProduct.name,
        shortDescription: mockProduct.shortDescription || "",
        description: mockProduct.description,
        categoryId: mockProduct.categoryId,
        subcategoryId: mockProduct.subcategoryId,
        price: mockProduct.price.toString(),
        compareAtPrice: mockProduct.compareAtPrice?.toString() || "",
        costPrice: mockProduct.costPrice?.toString() || "",
        sku: mockProduct.sku || "",
        barcode: mockProduct.barcode || "",
        stock: mockProduct.stock.toString(),
        lowStockThreshold: mockProduct.lowStockThreshold?.toString() || "",
        trackInventory: mockProduct.trackInventory,
        allowBackorders: mockProduct.allowBackorders,
        weight: mockProduct.weight?.toString() || "",
        weightUnit: mockProduct.weightUnit || "g",
        length: mockProduct.dimensions?.length?.toString() || "",
        width: mockProduct.dimensions?.width?.toString() || "",
        height: mockProduct.dimensions?.height?.toString() || "",
        dimensionUnit: mockProduct.dimensions?.unit || "cm",
        tags: mockProduct.tags,
        metaTitle: mockProduct.metaTitle || "",
        metaDescription: mockProduct.metaDescription || "",
        status: mockProduct.status,
        visibility: mockProduct.visibility,
        isFeatured: mockProduct.isFeatured,
        isHandmade: mockProduct.isHandmade,
        isCustomizable: mockProduct.isCustomizable,
        customizationOptions: mockProduct.customizationOptions || "",
        craftStory: mockProduct.craftStory || "",
        materials: mockProduct.materials || [],
        careInstructions: mockProduct.careInstructions || "",
        estimatedDeliveryMin: mockProduct.estimatedDelivery?.min?.toString() || "",
        estimatedDeliveryMax: mockProduct.estimatedDelivery?.max?.toString() || "",
        returnPolicy: mockProduct.returnPolicy || "",
      })
      
      setImages(mockProduct.images)
      setAttributes(mockProduct.attributes || {})
      setIsLoading(false)
    }
    
    loadProduct()
  }, [params.id])

  // Get category and subcategory data
  const selectedCategory = categoryTaxonomy.find(c => c.id === formData.categoryId)
  const selectedSubcategory = selectedCategory?.subcategories.find(s => s.id === formData.subcategoryId)
  const categoryAttributes = selectedSubcategory?.attributes || selectedCategory?.commonAttributes || []

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAttributeChange = (attributeId: string, value: string | string[]) => {
    setAttributes(prev => ({ ...prev, [attributeId]: value }))
  }

  const handleSave = async (publish = false) => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log("Saving product:", {
      ...formData,
      images,
      attributes,
      status: publish ? "active" : formData.status,
    })
    
    setIsSaving(false)
    
    if (publish) {
      router.push("/seller/products")
    }
  }

  const handleDelete = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push("/seller/products")
  }

  const handleArchive = async () => {
    setFormData(prev => ({ ...prev, status: "archived" }))
    await handleSave()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Product not found</p>
          <Link href="/seller/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/seller/products/${params.id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Edit Product</h1>
                <p className="text-sm text-muted-foreground">{product.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant={formData.status === "active" ? "default" : formData.status === "draft" ? "secondary" : "outline"}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </Badge>
              
              <Link href={`/seller/products/${params.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive Product?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will hide the product from your store. You can restore it later from the archived products.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                variant="outline" 
                onClick={() => handleSave(false)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Draft
              </Button>
              
              <Button 
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save & Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>Basic details about your product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Textarea
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                        placeholder="Brief summary (displayed in product cards)"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">{formData.shortDescription.length}/160 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Full Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Detailed product description"
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Craft Story</CardTitle>
                    <CardDescription>Share the story behind this product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="craftStory">Story / Heritage</Label>
                      <Textarea
                        id="craftStory"
                        value={formData.craftStory}
                        onChange={(e) => handleInputChange("craftStory", e.target.value)}
                        placeholder="Tell buyers about the craft, tradition, and the artisan behind this product..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Materials Used</Label>
                      <TagsInput
                        value={formData.materials}
                        onChange={(tags) => handleInputChange("materials", tags)}
                        placeholder="Add material and press Enter"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="careInstructions">Care Instructions</Label>
                      <Textarea
                        id="careInstructions"
                        value={formData.careInstructions}
                        onChange={(e) => handleInputChange("careInstructions", e.target.value)}
                        placeholder="How to care for this product..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select 
                        value={formData.categoryId} 
                        onValueChange={(value) => {
                          handleInputChange("categoryId", value)
                          handleInputChange("subcategoryId", "")
                          setAttributes({})
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryTaxonomy.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <span className="mr-2">{category.icon}</span>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCategory && (
                      <div className="space-y-2">
                        <Label>Subcategory *</Label>
                        <Select 
                          value={formData.subcategoryId} 
                          onValueChange={(value) => {
                            handleInputChange("subcategoryId", value)
                            setAttributes({})
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedCategory.subcategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Tags</CardTitle>
                    <CardDescription>Help buyers find your product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TagsInput
                      value={formData.tags}
                      onChange={(tags) => handleInputChange("tags", tags)}
                      placeholder="Add tag and press Enter"
                      maxTags={15}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Handmade Product</Label>
                        <p className="text-xs text-muted-foreground">Mark if this is handcrafted</p>
                      </div>
                      <Switch
                        checked={formData.isHandmade}
                        onCheckedChange={(checked) => handleInputChange("isHandmade", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Accept Customization</Label>
                        <p className="text-xs text-muted-foreground">Allow custom orders</p>
                      </div>
                      <Switch
                        checked={formData.isCustomizable}
                        onCheckedChange={(checked) => handleInputChange("isCustomizable", checked)}
                      />
                    </div>

                    {formData.isCustomizable && (
                      <div className="space-y-2">
                        <Label htmlFor="customizationOptions">Customization Details</Label>
                        <Textarea
                          id="customizationOptions"
                          value={formData.customizationOptions}
                          onChange={(e) => handleInputChange("customizationOptions", e.target.value)}
                          placeholder="What customizations do you offer?"
                          rows={3}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Upload high-quality images. First image will be the primary image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={8}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes">
            <Card>
              <CardHeader>
                <CardTitle>Product Attributes</CardTitle>
                <CardDescription>
                  {selectedSubcategory 
                    ? `Attributes for ${selectedCategory?.name} - ${selectedSubcategory.name}`
                    : selectedCategory
                    ? `Common attributes for ${selectedCategory.name}`
                    : "Select a category to see attributes"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoryAttributes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryAttributes.map((attribute) => (
                      <DynamicAttributeField
                        key={attribute.id}
                        attribute={attribute}
                        value={attributes[attribute.id]}
                        onChange={(value) => handleAttributeChange(attribute.id, value)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Please select a category and subcategory to see available attributes.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing & Inventory Tab */}
          <TabsContent value="pricing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Selling Price (INR) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compareAtPrice">Compare at Price</Label>
                      <Input
                        id="compareAtPrice"
                        type="number"
                        value={formData.compareAtPrice}
                        onChange={(e) => handleInputChange("compareAtPrice", e.target.value)}
                        placeholder="Original price"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (for profit calculation)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange("costPrice", e.target.value)}
                      placeholder="Your cost"
                      min="0"
                    />
                    {formData.price && formData.costPrice && (
                      <p className="text-sm text-muted-foreground">
                        Profit margin: {((parseFloat(formData.price) - parseFloat(formData.costPrice)) / parseFloat(formData.price) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        placeholder="Stock keeping unit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => handleInputChange("barcode", e.target.value)}
                        placeholder="ISBN, UPC, etc."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Track Inventory</Label>
                      <p className="text-xs text-muted-foreground">Monitor stock levels</p>
                    </div>
                    <Switch
                      checked={formData.trackInventory}
                      onCheckedChange={(checked) => handleInputChange("trackInventory", checked)}
                    />
                  </div>

                  {formData.trackInventory && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock Quantity *</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => handleInputChange("stock", e.target.value)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                          <Input
                            id="lowStockThreshold"
                            type="number"
                            value={formData.lowStockThreshold}
                            onChange={(e) => handleInputChange("lowStockThreshold", e.target.value)}
                            placeholder="Alert when below"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <Label>Allow Backorders</Label>
                          <p className="text-xs text-muted-foreground">Sell when out of stock</p>
                        </div>
                        <Switch
                          checked={formData.allowBackorders}
                          onCheckedChange={(checked) => handleInputChange("allowBackorders", checked)}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Weight & Dimensions</CardTitle>
                  <CardDescription>Used for shipping calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weightUnit">Unit</Label>
                      <Select 
                        value={formData.weightUnit} 
                        onValueChange={(value) => handleInputChange("weightUnit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">Grams (g)</SelectItem>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="oz">Ounces (oz)</SelectItem>
                          <SelectItem value="lb">Pounds (lb)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        type="number"
                        value={formData.length}
                        onChange={(e) => handleInputChange("length", e.target.value)}
                        placeholder="Length"
                        min="0"
                      />
                      <Input
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleInputChange("width", e.target.value)}
                        placeholder="Width"
                        min="0"
                      />
                      <Input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        placeholder="Height"
                        min="0"
                      />
                      <Select 
                        value={formData.dimensionUnit} 
                        onValueChange={(value) => handleInputChange("dimensionUnit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="in">inches</SelectItem>
                          <SelectItem value="m">meters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery & Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Estimated Delivery Time</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={formData.estimatedDeliveryMin}
                        onChange={(e) => handleInputChange("estimatedDeliveryMin", e.target.value)}
                        placeholder="Min days"
                        min="1"
                      />
                      <Input
                        type="number"
                        value={formData.estimatedDeliveryMax}
                        onChange={(e) => handleInputChange("estimatedDeliveryMax", e.target.value)}
                        placeholder="Max days"
                        min="1"
                      />
                      <div className="flex items-center text-sm text-muted-foreground">days</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnPolicy">Return Policy</Label>
                    <Textarea
                      id="returnPolicy"
                      value={formData.returnPolicy}
                      onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
                      placeholder="Your return policy for this product..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SEO & Settings Tab */}
          <TabsContent value="seo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Search Engine Optimization</CardTitle>
                  <CardDescription>Optimize how your product appears in search results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                      placeholder="Page title for search engines"
                    />
                    <p className="text-xs text-muted-foreground">{formData.metaTitle.length}/60 characters recommended</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      placeholder="Brief description for search results"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">{formData.metaDescription.length}/160 characters recommended</p>
                  </div>

                  {/* Preview */}
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <p className="text-sm font-medium text-primary truncate">
                      {formData.metaTitle || formData.name || "Product Title"}
                    </p>
                    <p className="text-xs text-green-600 truncate">
                      artisanhub.com/products/{product.slug}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {formData.metaDescription || formData.shortDescription || formData.description || "Product description will appear here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: "draft" | "active" | "inactive" | "archived") => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select 
                      value={formData.visibility} 
                      onValueChange={(value: "visible" | "hidden" | "scheduled") => handleInputChange("visibility", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visible">Visible to everyone</SelectItem>
                        <SelectItem value="hidden">Hidden from store</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label>Featured Product</Label>
                      <p className="text-xs text-muted-foreground">Show in featured section</p>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
