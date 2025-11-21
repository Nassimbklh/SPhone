'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getImagesForCategory, DefaultImage } from '@/lib/defaultImages'

interface DefaultImageGalleryProps {
  category: string
  onSelect: (imagePath: string) => void
  selectedImage?: string
}

export default function DefaultImageGallery({
  category,
  onSelect,
  selectedImage
}: DefaultImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const images = getImagesForCategory(category)

  if (images.length === 0) {
    return null
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {isOpen ? 'Masquer' : 'Choisir'} parmi les images prédéfinies ({images.length})
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                onSelect(image.path)
                setIsOpen(false)
              }}
              className={`relative group rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                selectedImage === image.path
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Image container with aspect ratio */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  <Image
                    src={image.path}
                    alt={image.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      // Fallback en cas d'erreur de chargement
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Image name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white font-medium line-clamp-1">
                  {image.name}
                </p>
              </div>

              {/* Selected indicator */}
              {selectedImage === image.path && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Images prédéfinies</p>
              <p>Cliquez sur une image pour l'utiliser comme image principale du produit. Vous pouvez toujours uploader vos propres images.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
