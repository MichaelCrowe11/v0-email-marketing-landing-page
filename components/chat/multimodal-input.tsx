"use client"

import { useState, useRef } from "react"
import { Image as ImageIcon, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MultimodalInputProps {
  onImagesChange: (images: File[]) => void
  disabled?: boolean
}

export function MultimodalInput({ onImagesChange, disabled }: MultimodalInputProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      const newImages = [...images, ...imageFiles].slice(0, 4) // Max 4 images
      setImages(newImages)
      onImagesChange(newImages)

      // Create previews
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
      setPreviews(prev => [...prev, ...newPreviews].slice(0, 4))
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(previews[index])
    
    setImages(newImages)
    setPreviews(newPreviews)
    onImagesChange(newImages)
  }

  const clearAll = () => {
    previews.forEach(url => URL.revokeObjectURL(url))
    setImages([])
    setPreviews([])
    onImagesChange([])
  }

  return (
    <div className="space-y-2">
      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <Image
                src={preview}
                alt={`Upload ${index + 1}`}
                width={80}
                height={80}
                className="rounded-lg object-cover border-2 border-border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {previews.length > 0 && (
            <button
              onClick={clearAll}
              className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || images.length >= 4}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || images.length >= 4}
        className="gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        <span className="text-xs">
          {images.length > 0 ? `${images.length}/4 images` : "Add images"}
        </span>
      </Button>
    </div>
  )
}
