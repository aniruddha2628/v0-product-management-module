'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Upload, X, GripVertical, ImagePlus, Star, StarOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface UploadedImage {
  id: string
  url: string
  file?: File
  isPrimary: boolean
  order: number
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
  error?: string
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 8,
  error,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newImages: UploadedImage[] = []
      const remainingSlots = maxImages - images.length

      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file, index) => {
          if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file)
            newImages.push({
              id: `temp-${Date.now()}-${index}`,
              url,
              file,
              isPrimary: images.length === 0 && index === 0,
              order: images.length + index,
            })
          }
        })

      onChange([...images, ...newImages])
    },
    [images, maxImages, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileChange(e.dataTransfer.files)
    },
    [handleFileChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = useCallback(
    (id: string) => {
      const filtered = images.filter((img) => img.id !== id)
      // If removed image was primary, make first image primary
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true
      }
      // Re-order
      filtered.forEach((img, idx) => {
        img.order = idx
      })
      onChange(filtered)
    },
    [images, onChange]
  )

  const setPrimary = useCallback(
    (id: string) => {
      const updated = images.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
      onChange(updated)
    },
    [images, onChange]
  )

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
  }, [])

  const handleImageDrop = useCallback(
    (targetIndex: number) => {
      if (draggedIndex === null || draggedIndex === targetIndex) return

      const newImages = [...images]
      const [removed] = newImages.splice(draggedIndex, 1)
      newImages.splice(targetIndex, 0, removed)

      // Update order
      newImages.forEach((img, idx) => {
        img.order = idx
      })

      onChange(newImages)
      setDraggedIndex(null)
    },
    [draggedIndex, images, onChange]
  )

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer',
          isDragging
            ? 'border-orange bg-orange-pale'
            : 'border-border bg-input-bg hover:border-orange hover:bg-orange-pale',
          error && 'border-red',
          images.length >= maxImages && 'pointer-events-none opacity-50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={images.length >= maxImages}
        />
        <div className="flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-light">
            <Upload className="h-6 w-6 text-orange" />
          </div>
          <h4 className="text-sm font-medium text-text">
            {isDragging ? 'Drop images here' : 'Drag & drop product images'}
          </h4>
          <p className="mt-1 text-xs text-muted">
            or click to browse • Max {maxImages} images • JPG, PNG up to 5MB
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleImageDrop(index)}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-lg border bg-cream-card transition-all',
                image.isPrimary ? 'border-orange ring-2 ring-orange/20' : 'border-border',
                draggedIndex === index && 'opacity-50 scale-95'
              )}
            >
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute left-1.5 top-1.5 rounded bg-orange px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Primary
                </div>
              )}

              {/* Order Number */}
              <div className="absolute bottom-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded bg-black/60 text-[10px] font-semibold text-white">
                {index + 1}
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPrimary(image.id)
                  }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-colors',
                    image.isPrimary ? 'text-orange' : 'text-muted hover:text-orange'
                  )}
                  title={image.isPrimary ? 'Primary image' : 'Set as primary'}
                >
                  {image.isPrimary ? (
                    <Star className="h-4 w-4 fill-current" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(image.id)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red transition-colors hover:bg-red hover:text-white"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drag Handle */}
              <div className="absolute right-1.5 top-1.5 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-input-bg transition-all hover:border-orange hover:bg-orange-pale"
            >
              <ImagePlus className="mb-1 h-6 w-6 text-muted" />
              <span className="text-xs text-muted">Add more</span>
            </button>
          )}
        </div>
      )}

      {/* Image Count */}
      <p className="text-xs text-muted">
        {images.length} of {maxImages} images uploaded
        {images.length > 0 && ' • Drag to reorder'}
      </p>

      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  )
}
