'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
  placeholder?: string
  suggestions?: string[]
  error?: string
}

export function TagsInput({
  value,
  onChange,
  maxTags = 13,
  placeholder = 'Add a tag...',
  suggestions = [],
  error,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
      onChange([...value, trimmed])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(s.toLowerCase())
  )

  return (
    <div className="space-y-3">
      {/* Input and Tags */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 rounded-lg border p-2.5 transition-colors focus-within:border-orange focus-within:ring-2 focus-within:ring-orange/20',
          error ? 'border-red' : 'border-border bg-input-bg'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 bg-orange-light text-orange border border-orange/20 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
              className="hover:bg-orange/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {value.length < maxTags && (
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-7 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
      </div>

      {/* Suggestions */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filteredSuggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="flex items-center gap-1 rounded-full border border-border bg-input-bg px-2.5 py-1 text-xs text-muted transition-colors hover:border-orange hover:text-orange"
            >
              <Plus className="h-3 w-3" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-muted">
        {value.length} of {maxTags} tags • Press Enter or comma to add
      </p>

      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  )
}
