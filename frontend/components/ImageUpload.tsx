'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import DefaultImageGallery from './DefaultImageGallery'
import { getFirstDefaultImage, isDefaultImage } from '@/lib/defaultImages'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  category?: string
  maxImages?: number
  maxSize?: number // en MB
}

export default function ImageUpload({
  images,
  onImagesChange,
  category,
  maxImages = 5,
  maxSize = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ajouter automatiquement une image par défaut si aucune image n'est présente et qu'une catégorie est fournie
  useEffect(() => {
    if (category && images.length === 0) {
      const defaultImage = getFirstDefaultImage(category)
      if (defaultImage) {
        onImagesChange([defaultImage.path])
      }
    }
  }, [category])

  // Fonction pour ajouter une image prédéfinie
  const handleDefaultImageSelect = (imagePath: string) => {
    // Si l'image est déjà présente, ne rien faire
    if (images.includes(imagePath)) {
      return
    }

    // Remplacer l'image par défaut existante ou ajouter en première position
    const hasDefaultImage = images.some(img => isDefaultImage(img))
    if (hasDefaultImage) {
      // Remplacer la première image par défaut
      const newImages = images.map(img => isDefaultImage(img) ? imagePath : img)
      onImagesChange(newImages)
    } else if (images.length < maxImages) {
      // Ajouter en première position
      onImagesChange([imagePath, ...images])
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('http://localhost:5001/api/products/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Erreur lors de l\'upload')
    }

    return data.url
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)

    // Vérifier le nombre d'images
    if (images.length + acceptedFiles.length > maxImages) {
      setError(`Vous ne pouvez ajouter que ${maxImages} images maximum`)
      return
    }

    // Vérifier la taille des fichiers
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`Certaines images dépassent ${maxSize} Mo`)
      return
    }

    setUploading(true)

    try {
      // Upload toutes les images en parallèle
      const uploadPromises = acceptedFiles.map(file => uploadImage(file))
      const uploadedUrls = await Promise.all(uploadPromises)

      // Ajouter les URLs aux images existantes
      onImagesChange([...images, ...uploadedUrls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, maxSize, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg']
    },
    disabled: uploading || images.length >= maxImages
  })

  const removeImage = async (index: number) => {
    const imageUrl = images[index]

    // Si c'est une image uploadée (commence par /uploads), la supprimer du serveur
    if (imageUrl.startsWith('/uploads')) {
      try {
        await fetch('http://localhost:5001/api/products/image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ url: imageUrl })
        })
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'image:', err)
      }
    }

    // Retirer l'image de la liste
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Zone de Drag & Drop */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-gray-600">Upload en cours...</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive
                    ? 'Déposez vos photos ici...'
                    : 'Glissez-déposez vos photos ici ou cliquez pour importer'}
                </p>
                <p className="text-sm text-gray-500">
                  .jpg, .jpeg, .png, .webp, .svg - Maximum {maxImages} images - {maxSize} Mo par image
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {images.length}/{maxImages} images ajoutées
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Prévisualisations des images */}
      {images.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Images ajoutées ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                    <Image
                      src={
                        isDefaultImage(imageUrl)
                          ? imageUrl // Image locale (assets)
                          : imageUrl.startsWith('/')
                          ? `http://localhost:5001${imageUrl}` // Image uploadée
                          : imageUrl // URL externe
                      }
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>❌</span>
                    </div>
                  )}
                </div>

                {/* Bouton de suppression */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>

                {/* Badge de position */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si limite atteinte */}
      {images.length >= maxImages && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
          ⚠️ Limite de {maxImages} images atteinte. Supprimez une image pour en ajouter une nouvelle.
        </div>
      )}

      {/* Galerie d'images prédéfinies */}
      {category && (
        <DefaultImageGallery
          category={category}
          onSelect={handleDefaultImageSelect}
          selectedImage={images.find(img => isDefaultImage(img))}
        />
      )}
    </div>
  )
}
