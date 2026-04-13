'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  categories,
  sharedAttributes,
  getCategoryById,
  type Category,
  type SubCategory,
} from '@/lib/category-taxonomy'
import { DynamicAttributeField } from '@/components/seller/products/dynamic-attribute-field'
import { ImageUploader, type UploadedImage } from '@/components/seller/products/image-uploader'
import { TagsInput } from '@/components/seller/products/tags-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  Eye,
  Info,
  AlertCircle,
  Sparkles,
  Package,
  ImageIcon,
  Tags,
  Layers,
  BadgeIndianRupee,
} from 'lucide-react'
import { toast } from 'sonner'

// Form steps
const steps = [
  { id: 'category', title: 'Category', description: 'Select product category', icon: Layers },
  { id: 'basic', title: 'Basic Info', description: 'Title, description, images', icon: ImageIcon },
  { id: 'attributes', title: 'Specifications', description: 'Category-specific details', icon: Tags },
  { id: 'pricing', title: 'Pricing & Stock', description: 'Price and inventory', icon: BadgeIndianRupee },
  { id: 'review', title: 'Review', description: 'Review and submit', icon: Check },
]

interface FormData {
  // Category
  categoryId: string
  subCategoryId: string
  
  // Basic info
  title: string
  description: string
  images: UploadedImage[]
  
  // Shared attributes
  stateOfOrigin: string
  giTagCertified: boolean
  dispatchTime: string
  customisationAvailable: boolean
  searchTags: string[]
  
  // Pricing
  sellingPrice: number | undefined
  mrp: number | undefined
  stockQuantity: number | undefined
  sku: string
  
  // Category-specific attributes
  attributes: Record<string, unknown>
}

const initialFormData: FormData = {
  categoryId: '',
  subCategoryId: '',
  title: '',
  description: '',
  images: [],
  stateOfOrigin: '',
  giTagCertified: false,
  dispatchTime: '',
  customisationAvailable: false,
  searchTags: [],
  sellingPrice: undefined,
  mrp: undefined,
  stockQuantity: undefined,
  sku: '',
  attributes: {},
}

export default function AddProductPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = useMemo(
    () => getCategoryById(formData.categoryId),
    [formData.categoryId]
  )

  const selectedSubCategory = useMemo(
    () => selectedCategory?.subCategories.find((s) => s.id === formData.subCategoryId),
    [selectedCategory, formData.subCategoryId]
  )

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    // Clear errors for updated fields
    const errorKeys = Object.keys(updates)
    setErrors((prev) => {
      const newErrors = { ...prev }
      errorKeys.forEach((key) => delete newErrors[key])
      return newErrors
    })
  }, [])

  const updateAttribute = useCallback((fieldName: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [fieldName]: value },
    }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`attr_${fieldName}`]
      return newErrors
    })
  }, [])

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {}

      switch (step) {
        case 0: // Category
          if (!formData.categoryId) newErrors.categoryId = 'Please select a category'
          if (!formData.subCategoryId) newErrors.subCategoryId = 'Please select a sub-category'
          break

        case 1: // Basic Info
          if (!formData.title.trim()) newErrors.title = 'Product title is required'
          else if (formData.title.length > 120) newErrors.title = 'Title must be 120 characters or less'
          if (!formData.description.trim()) newErrors.description = 'Description is required'
          else if (formData.description.length > 2000) newErrors.description = 'Description must be 2000 characters or less'
          if (formData.images.length === 0) newErrors.images = 'At least 1 product image is required'
          break

        case 2: // Attributes
          // Validate required category-specific attributes
          selectedCategory?.attributes.forEach((attr) => {
            if (attr.required) {
              const value = formData.attributes[attr.fieldName]
              if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
                newErrors[`attr_${attr.fieldName}`] = `${attr.name} is required`
              }
            }
          })
          break

        case 3: // Pricing
          if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required'
          else if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Price must be greater than 0'
          if (formData.mrp && formData.mrp < formData.sellingPrice) {
            newErrors.mrp = 'MRP cannot be less than selling price'
          }
          if (!formData.stockQuantity && formData.stockQuantity !== 0) {
            newErrors.stockQuantity = 'Stock quantity is required'
          }
          if (!formData.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required'
          if (!formData.dispatchTime) newErrors.dispatchTime = 'Dispatch time is required'
          break
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [formData, selectedCategory]
  )

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }, [currentStep, validateStep])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback(
    (step: number) => {
      // Only allow going to previous steps or current step
      if (step <= currentStep) {
        setCurrentStep(step)
      }
    },
    [currentStep]
  )

  const handleSubmit = useCallback(
    async (saveAsDraft: boolean = false) => {
      if (!saveAsDraft && !validateStep(currentStep)) return

      setIsSubmitting(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast.success(
          saveAsDraft
            ? 'Product saved as draft'
            : 'Product submitted for review',
          {
            description: saveAsDraft
              ? 'You can continue editing this product later.'
              : 'Your product will be reviewed and published within 24-48 hours.',
          }
        )

        router.push('/seller/products')
      } catch (error) {
        toast.error('Failed to save product', {
          description: 'Please try again.',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentStep, validateStep, router]
  )

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/seller/products"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-orange hover:text-orange"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-text sm:text-2xl">
              Add New Product
            </h1>
            <p className="text-sm text-muted">
              {selectedCategory
                ? `${selectedCategory.icon} ${selectedCategory.name}`
                : 'Select a category to get started'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-border"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isClickable = index <= currentStep

            return (
              <div
                key={step.id}
                className="flex flex-1 items-center"
              >
                <button
                  onClick={() => goToStep(index)}
                  disabled={!isClickable}
                  className={cn(
                    'flex items-center gap-3 transition-all',
                    isClickable && 'cursor-pointer',
                    !isClickable && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      isCompleted && 'border-green bg-green text-white',
                      isActive && 'border-orange bg-orange text-white shadow-md',
                      !isActive && !isCompleted && 'border-border bg-cream-card text-muted'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-text' : 'text-muted'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-hint">{step.description}</p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-4 h-0.5 flex-1 rounded',
                      isCompleted ? 'bg-green' : 'bg-border'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl border border-border bg-white">
        {/* Step 0: Category Selection */}
        {currentStep === 0 && (
          <CategoryStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <BasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )}

        {/* Step 2: Category Attributes */}
        {currentStep === 2 && selectedCategory && (
          <AttributesStep
            category={selectedCategory}
            formData={formData}
            updateAttribute={updateAttribute}
            errors={errors}
          />
        )}

        {/* Step 3: Pricing & Stock */}
        {currentStep === 3 && (
          <PricingStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && selectedCategory && (
          <ReviewStep
            formData={formData}
            category={selectedCategory}
            subCategory={selectedSubCategory}
            goToStep={goToStep}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} className="gap-2 bg-orange hover:bg-orange-hover">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="gap-2 bg-orange hover:bg-orange-hover"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  Submit for Review
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Step Components
function CategoryStep({
  formData,
  updateFormData,
  errors,
}: {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}) {
  const selectedCategory = getCategoryById(formData.categoryId)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-text">
          Select Product Category
        </h2>
        <p className="text-sm text-muted">
          Choose the category that best describes your handcrafted product
        </p>
      </div>

      {/* Category Grid */}
      <div className="mb-6">
        <Label className="mb-3 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
          Category <span className="text-orange">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                updateFormData({
                  categoryId: category.id,
                  subCategoryId: '',
                  attributes: {},
                })
              }
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                formData.categoryId === category.id
                  ? 'border-orange bg-orange-light'
                  : 'border-border bg-input-bg hover:border-orange/50 hover:bg-orange-pale'
              )}
            >
              <span className="text-3xl">{category.icon}</span>
              <span className="text-sm font-medium text-text">{category.name}</span>
            </button>
          ))}
        </div>
        {errors.categoryId && (
          <p className="mt-2 text-xs text-red">{errors.categoryId}</p>
        )}
      </div>

      {/* Sub-category Selection */}
      {selectedCategory && (
        <div className="animate-fade-up">
          <Label className="mb-3 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
            Sub-category <span className="text-orange">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedCategory.subCategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => updateFormData({ subCategoryId: sub.id })}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all',
                  formData.subCategoryId === sub.id
                    ? 'border-orange bg-orange-light text-orange font-medium'
                    : 'border-border bg-input-bg text-muted hover:border-orange hover:text-orange'
                )}
              >
                {sub.name}
                {sub.hasGiTag && (
                  <span className="rounded bg-purple-bg px-1.5 py-0.5 text-[10px] font-semibold text-purple">
                    GI
                  </span>
                )}
              </button>
            ))}
          </div>
          {errors.subCategoryId && (
            <p className="mt-2 text-xs text-red">{errors.subCategoryId}</p>
          )}

          {/* Category Info */}
          <div className="mt-6 rounded-lg border border-info-border bg-info-bg p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 flex-shrink-0 text-info-text" />
              <div>
                <p className="text-sm font-medium text-info-text">
                  About {selectedCategory.name}
                </p>
                <p className="mt-1 text-sm text-info-text/80">
                  {selectedCategory.description}
                </p>
                <p className="mt-2 text-xs text-info-text/60">
                  {selectedCategory.attributes.filter((a) => a.required).length} required
                  fields • {selectedCategory.attributes.length} total specifications
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BasicInfoStep({
  formData,
  updateFormData,
  errors,
}: {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-text">
          Basic Product Information
        </h2>
        <p className="text-sm text-muted">
          Add title, description, and images for your product
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label
            htmlFor="title"
            className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted"
          >
            Product Title <span className="text-orange">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g., Handmade Blue Pottery Vase - Traditional Jaipur Design"
            className={cn(
              'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
              errors.title && 'border-red'
            )}
            maxLength={120}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className={errors.title ? 'text-red' : 'text-hint'}>
              {errors.title || 'Be descriptive and include key features'}
            </span>
            <span className="text-hint">{formData.title.length}/120</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="description"
            className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted"
          >
            Description <span className="text-orange">*</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe your product in detail. Include materials, techniques, story behind the craft, and care instructions..."
            className={cn(
              'min-h-[160px] border-border bg-input-bg focus:border-orange focus:ring-orange/20',
              errors.description && 'border-red'
            )}
            maxLength={2000}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className={errors.description ? 'text-red' : 'text-hint'}>
              {errors.description || 'Include materials, techniques, and story behind the craft'}
            </span>
            <span className="text-hint">{formData.description.length}/2000</span>
          </div>
        </div>

        {/* Images */}
        <div>
          <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
            Product Images <span className="text-orange">*</span>
          </Label>
          <ImageUploader
            images={formData.images}
            onChange={(images) => updateFormData({ images })}
            maxImages={8}
            error={errors.images}
          />
        </div>

        {/* Search Tags */}
        <div>
          <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
            Search Tags
          </Label>
          <TagsInput
            value={formData.searchTags}
            onChange={(tags) => updateFormData({ searchTags: tags })}
            maxTags={13}
            placeholder="Add tags to help buyers find your product..."
            suggestions={[
              'handmade',
              'traditional',
              'artisan',
              'vintage',
              'eco-friendly',
              'gift',
              'home decor',
              'wedding',
              'festive',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function AttributesStep({
  category,
  formData,
  updateAttribute,
  errors,
}: {
  category: Category
  formData: FormData
  updateAttribute: (fieldName: string, value: unknown) => void
  errors: Record<string, string>
}) {
  const requiredAttributes = category.attributes.filter((a) => a.required)
  const optionalAttributes = category.attributes.filter((a) => !a.required)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-text">
          {category.icon} {category.name} Specifications
        </h2>
        <p className="text-sm text-muted">
          Add category-specific details to help buyers understand your product
        </p>
      </div>

      {/* Required Attributes */}
      {requiredAttributes.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange" />
            <span className="text-sm font-medium text-text">Required Information</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {requiredAttributes.map((attr) => (
              <DynamicAttributeField
                key={attr.fieldName}
                attribute={attr}
                value={formData.attributes[attr.fieldName]}
                onChange={updateAttribute}
                error={errors[`attr_${attr.fieldName}`]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Optional Attributes */}
      {optionalAttributes.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-hint" />
            <span className="text-sm font-medium text-muted">
              Optional Details (Recommended)
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {optionalAttributes.map((attr) => (
              <DynamicAttributeField
                key={attr.fieldName}
                attribute={attr}
                value={formData.attributes[attr.fieldName]}
                onChange={updateAttribute}
                error={errors[`attr_${attr.fieldName}`]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PricingStep({
  formData,
  updateFormData,
  errors,
}: {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}) {
  const discount = formData.mrp && formData.sellingPrice
    ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)
    : 0

  // Find shared attributes
  const stateAttribute = sharedAttributes.find((a) => a.fieldName === 'stateOfOrigin')
  const dispatchAttribute = sharedAttributes.find((a) => a.fieldName === 'dispatchTime')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-text">
          Pricing & Inventory
        </h2>
        <p className="text-sm text-muted">
          Set your price, stock quantity, and shipping details
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pricing */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-text">Pricing</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                Selling Price <span className="text-orange">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                  ₹
                </span>
                <Input
                  type="number"
                  value={formData.sellingPrice || ''}
                  onChange={(e) =>
                    updateFormData({
                      sellingPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="0"
                  className={cn(
                    'pl-8 border-border bg-input-bg focus:border-orange focus:ring-orange/20',
                    errors.sellingPrice && 'border-red'
                  )}
                />
              </div>
              {errors.sellingPrice && (
                <p className="mt-1 text-xs text-red">{errors.sellingPrice}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                MRP / Original Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                  ₹
                </span>
                <Input
                  type="number"
                  value={formData.mrp || ''}
                  onChange={(e) =>
                    updateFormData({
                      mrp: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="0"
                  className={cn(
                    'pl-8 border-border bg-input-bg focus:border-orange focus:ring-orange/20',
                    errors.mrp && 'border-red'
                  )}
                />
              </div>
              {errors.mrp && <p className="mt-1 text-xs text-red">{errors.mrp}</p>}
              {discount > 0 && (
                <p className="mt-1 text-xs text-green">{discount}% discount will be shown</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                Stock Quantity <span className="text-orange">*</span>
              </Label>
              <Input
                type="number"
                value={formData.stockQuantity ?? ''}
                onChange={(e) =>
                  updateFormData({
                    stockQuantity: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="0"
                min="0"
                className={cn(
                  'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
                  errors.stockQuantity && 'border-red'
                )}
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-xs text-red">{errors.stockQuantity}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                SKU / Product Code
              </Label>
              <Input
                value={formData.sku}
                onChange={(e) => updateFormData({ sku: e.target.value })}
                placeholder="e.g., BP-VASE-001"
                className="border-border bg-input-bg focus:border-orange focus:ring-orange/20"
              />
              <p className="mt-1 text-xs text-hint">Auto-generated if left blank</p>
            </div>
          </div>
        </div>

        {/* Shipping & Origin */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-text">Shipping & Origin</h3>

          <div>
            <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              State of Origin <span className="text-orange">*</span>
            </Label>
            <Select
              value={formData.stateOfOrigin}
              onValueChange={(value) => updateFormData({ stateOfOrigin: value })}
            >
              <SelectTrigger
                className={cn(
                  'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
                  errors.stateOfOrigin && 'border-red'
                )}
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {stateAttribute?.options?.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stateOfOrigin && (
              <p className="mt-1 text-xs text-red">{errors.stateOfOrigin}</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              Dispatch Time <span className="text-orange">*</span>
            </Label>
            <Select
              value={formData.dispatchTime}
              onValueChange={(value) => updateFormData({ dispatchTime: value })}
            >
              <SelectTrigger
                className={cn(
                  'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
                  errors.dispatchTime && 'border-red'
                )}
              >
                <SelectValue placeholder="Select dispatch time" />
              </SelectTrigger>
              <SelectContent>
                {dispatchAttribute?.options?.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dispatchTime && (
              <p className="mt-1 text-xs text-red">{errors.dispatchTime}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-input-bg p-4">
              <div>
                <p className="text-sm font-medium text-text">GI Tag Certified</p>
                <p className="text-xs text-muted">
                  Does this product have a Geographical Indication certification?
                </p>
              </div>
              <Switch
                checked={formData.giTagCertified}
                onCheckedChange={(checked) => updateFormData({ giTagCertified: checked })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-input-bg p-4">
              <div>
                <p className="text-sm font-medium text-text">Customisation Available</p>
                <p className="text-xs text-muted">Can customers request customizations?</p>
              </div>
              <Switch
                checked={formData.customisationAvailable}
                onCheckedChange={(checked) =>
                  updateFormData({ customisationAvailable: checked })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewStep({
  formData,
  category,
  subCategory,
  goToStep,
}: {
  formData: FormData
  category: Category
  subCategory?: SubCategory
  goToStep: (step: number) => void
}) {
  const discount = formData.mrp && formData.sellingPrice
    ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)
    : 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-serif text-lg font-semibold text-text">
          Review Your Product
        </h2>
        <p className="text-sm text-muted">
          Please review all details before submitting for review
        </p>
      </div>

      <div className="space-y-6">
        {/* Preview Card */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Image Preview */}
            <div className="relative aspect-square w-full sm:w-64 bg-cream-card flex-shrink-0">
              {formData.images[0] ? (
                <img
                  src={formData.images[0].url}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-16 w-16 text-border" />
                </div>
              )}
              {discount > 0 && (
                <div className="absolute left-2 top-2 rounded-md bg-orange px-2 py-0.5 text-xs font-semibold text-white">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                <span className="text-xs text-muted">
                  {category.name} • {subCategory?.name}
                </span>
                {subCategory?.hasGiTag && (
                  <span className="rounded bg-purple-bg px-1.5 py-0.5 text-[10px] font-semibold text-purple">
                    GI
                  </span>
                )}
              </div>

              <h3 className="mb-2 font-serif text-lg font-semibold text-text">
                {formData.title || 'Untitled Product'}
              </h3>

              <p className="mb-4 line-clamp-2 text-sm text-muted">
                {formData.description || 'No description provided'}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-text">
                  {formData.sellingPrice
                    ? new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(formData.sellingPrice)
                    : '₹0'}
                </span>
                {formData.mrp && (
                  <span className="text-sm text-muted line-through">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(formData.mrp)}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-green">
                {formData.stockQuantity} in stock • {formData.dispatchTime}
              </p>
            </div>
          </div>
        </div>

        {/* Section Summaries */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category */}
          <ReviewSection
            title="Category"
            onEdit={() => goToStep(0)}
            items={[
              { label: 'Category', value: category.name },
              { label: 'Sub-category', value: subCategory?.name || '-' },
            ]}
          />

          {/* Basic Info */}
          <ReviewSection
            title="Basic Info"
            onEdit={() => goToStep(1)}
            items={[
              { label: 'Title', value: formData.title || '-' },
              { label: 'Images', value: `${formData.images.length} uploaded` },
              { label: 'Tags', value: formData.searchTags.length > 0 ? formData.searchTags.join(', ') : '-' },
            ]}
          />

          {/* Specifications */}
          <ReviewSection
            title="Specifications"
            onEdit={() => goToStep(2)}
            items={Object.entries(formData.attributes)
              .filter(([_, value]) => value !== undefined && value !== '')
              .slice(0, 4)
              .map(([key, value]) => ({
                label: key,
                value: Array.isArray(value) ? value.join(', ') : String(value),
              }))}
          />

          {/* Pricing */}
          <ReviewSection
            title="Pricing & Stock"
            onEdit={() => goToStep(3)}
            items={[
              {
                label: 'Price',
                value: formData.sellingPrice
                  ? `₹${formData.sellingPrice.toLocaleString('en-IN')}`
                  : '-',
              },
              { label: 'Stock', value: formData.stockQuantity?.toString() || '-' },
              { label: 'Origin', value: formData.stateOfOrigin || '-' },
              { label: 'Dispatch', value: formData.dispatchTime || '-' },
            ]}
          />
        </div>

        {/* Info Banner */}
        <div className="rounded-lg border border-info-border bg-info-bg p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 flex-shrink-0 text-info-text" />
            <div>
              <p className="text-sm font-medium text-info-text">What happens next?</p>
              <p className="mt-1 text-sm text-info-text/80">
                Your product will be reviewed by our team within 24-48 hours. Once approved,
                it will be published on the marketplace and visible to buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewSection({
  title,
  onEdit,
  items,
}: {
  title: string
  onEdit: () => void
  items: Array<{ label: string; value: string }>
}) {
  return (
    <div className="rounded-lg border border-border bg-input-bg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 px-2 text-xs text-orange hover:text-orange-hover"
        >
          Edit
        </Button>
      </div>
      <dl className="space-y-1.5">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between gap-2">
            <dt className="text-xs text-muted capitalize">{item.label}</dt>
            <dd className="text-xs font-medium text-text text-right truncate max-w-[60%]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
