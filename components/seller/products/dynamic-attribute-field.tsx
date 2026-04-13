'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CategoryAttribute } from '@/lib/category-taxonomy'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DynamicAttributeFieldProps {
  attribute: CategoryAttribute
  value: unknown
  onChange: (fieldName: string, value: unknown) => void
  error?: string
}

export function DynamicAttributeField({
  attribute,
  value,
  onChange,
  error,
}: DynamicAttributeFieldProps) {
  const { name, fieldName, type, required, options, placeholder, hint, unit } = attribute

  const handleChange = (newValue: unknown) => {
    onChange(fieldName, newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label
          htmlFor={fieldName}
          className="text-[10.5px] font-semibold uppercase tracking-wider text-muted"
        >
          {name}
          {required && <span className="ml-1 text-orange">*</span>}
        </Label>
        {hint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-hint cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {hint}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {type === 'text' && (
        <div className="relative">
          <Input
            id={fieldName}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
              error && 'border-red focus:border-red'
            )}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
              {unit}
            </span>
          )}
        </div>
      )}

      {type === 'number' && (
        <div className="relative">
          {unit === '₹' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
              {unit}
            </span>
          )}
          <Input
            id={fieldName}
            type="number"
            value={(value as number) || ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={placeholder}
            className={cn(
              'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
              unit === '₹' && 'pl-8',
              unit && unit !== '₹' && 'pr-16',
              error && 'border-red focus:border-red'
            )}
          />
          {unit && unit !== '₹' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
              {unit}
            </span>
          )}
        </div>
      )}

      {type === 'dropdown' && options && (
        <Select
          value={(value as string) || ''}
          onValueChange={(val) => handleChange(val)}
        >
          <SelectTrigger
            className={cn(
              'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
              error && 'border-red focus:border-red'
            )}
          >
            <SelectValue placeholder={placeholder || `Select ${name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {type === 'multi-select' && options && (
        <MultiSelectField
          options={options}
          value={(value as string[]) || []}
          onChange={(val) => handleChange(val)}
          placeholder={placeholder}
          error={!!error}
        />
      )}

      {type === 'toggle' && (
        <div className="flex items-center gap-3">
          <Switch
            id={fieldName}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => handleChange(checked)}
          />
          <Label htmlFor={fieldName} className="text-sm text-text cursor-pointer">
            {(value as boolean) ? 'Yes' : 'No'}
          </Label>
        </div>
      )}

      {type === 'dimensions' && (
        <DimensionsField
          value={(value as { length?: number; width?: number; height?: number }) || {}}
          onChange={(val) => handleChange(val)}
          error={!!error}
        />
      )}

      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  )
}

function MultiSelectField({
  options,
  value,
  onChange,
  placeholder,
  error,
}: {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  error?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const removeOption = (option: string) => {
    onChange(value.filter((v) => v !== option))
  }

  return (
    <div className="space-y-2">
      {/* Selected badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="gap-1 bg-orange-light text-orange border border-orange/20"
            >
              {item}
              <button
                type="button"
                onClick={() => removeOption(item)}
                className="hover:bg-orange/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Options */}
      <div className="flex flex-wrap gap-2">
        {options
          .filter((opt) => !value.includes(opt))
          .map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[13px] transition-all',
                'border-border bg-input-bg text-muted hover:border-orange hover:text-orange'
              )}
            >
              {option}
            </button>
          ))}
      </div>
    </div>
  )
}

function DimensionsField({
  value,
  onChange,
  error,
}: {
  value: { length?: number; width?: number; height?: number }
  onChange: (value: { length?: number; width?: number; height?: number }) => void
  error?: boolean
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <Label className="text-[10px] text-hint mb-1 block">Length (cm)</Label>
        <Input
          type="number"
          value={value.length || ''}
          onChange={(e) =>
            onChange({ ...value, length: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="L"
          className={cn(
            'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
            error && 'border-red'
          )}
        />
      </div>
      <div>
        <Label className="text-[10px] text-hint mb-1 block">Width (cm)</Label>
        <Input
          type="number"
          value={value.width || ''}
          onChange={(e) =>
            onChange({ ...value, width: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="W"
          className={cn(
            'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
            error && 'border-red'
          )}
        />
      </div>
      <div>
        <Label className="text-[10px] text-hint mb-1 block">Height (cm)</Label>
        <Input
          type="number"
          value={value.height || ''}
          onChange={(e) =>
            onChange({ ...value, height: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="H"
          className={cn(
            'border-border bg-input-bg focus:border-orange focus:ring-orange/20',
            error && 'border-red'
          )}
        />
      </div>
    </div>
  )
}
