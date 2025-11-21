'use client'

import { useState, useEffect } from 'react'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { BRANDS_BY_CATEGORY, getModelsForBrand } from '@/lib/products-data'

const CATEGORIES = [
  { value: 'phones', label: 'Téléphones' },
  { value: 'watches', label: 'Montres connectées' },
  { value: 'earphones', label: 'Écouteurs' },
  { value: 'cases', label: 'Coques & Protection' },
  { value: 'accessories', label: 'Accessoires' },
  { value: 'electronics', label: 'Électronique' }
]

interface SmartProductSelectorProps {
  category: string
  brand: string
  model: string
  onCategoryChange: (category: string) => void
  onBrandChange: (brand: string) => void
  onModelChange: (model: string) => void
  errors?: {
    category?: string
    brand?: string
    model?: string
  }
}

export function SmartProductSelector({
  category,
  brand,
  model,
  onCategoryChange,
  onBrandChange,
  onModelChange,
  errors = {}
}: SmartProductSelectorProps) {
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [useCustomModel, setUseCustomModel] = useState(false)

  // Update available brands when category changes
  useEffect(() => {
    if (category) {
      const brands = BRANDS_BY_CATEGORY[category] || []
      setAvailableBrands(brands)

      // Reset brand and model if current brand is not in new category
      if (brand && !brands.includes(brand)) {
        onBrandChange('')
        onModelChange('')
      }
    } else {
      setAvailableBrands([])
      onBrandChange('')
      onModelChange('')
    }
  }, [category])

  // Update available models when brand changes
  useEffect(() => {
    if (category && brand) {
      const models = getModelsForBrand(category, brand)
      setAvailableModels(models)
      setUseCustomModel(models.length === 0)

      // Reset model if current model is not in new brand
      if (model && !models.includes(model)) {
        onModelChange('')
      }
    } else {
      setAvailableModels([])
      onModelChange('')
    }
  }, [category, brand])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value)
  }

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onBrandChange(e.target.value)
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onModelChange(e.target.value)
  }

  return (
    <div className="space-y-4">
      {/* Category selection */}
      <Select
        label="Catégorie"
        name="category"
        value={category}
        onChange={handleCategoryChange}
        options={CATEGORIES}
        placeholder="Sélectionner une catégorie"
        error={errors.category}
        required
      />

      {/* Brand selection */}
      {category && availableBrands.length > 0 && (
        <Select
          label="Marque"
          name="brand"
          value={brand}
          onChange={handleBrandChange}
          options={availableBrands.map(b => ({ value: b, label: b }))}
          placeholder="Sélectionner une marque"
          error={errors.brand}
          required
        />
      )}

      {/* Manual brand input for categories without predefined brands */}
      {category && availableBrands.length === 0 && (
        <Input
          label="Marque"
          name="brand"
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          placeholder="Ex: Anker, Belkin, etc."
          error={errors.brand}
          required
        />
      )}

      {/* Model selection or input */}
      {brand && (
        <div>
          {availableModels.length > 0 && !useCustomModel ? (
            <div className="space-y-2">
              <Select
                label="Modèle"
                name="model"
                value={model}
                onChange={handleModelChange}
                options={availableModels.map(m => ({ value: m, label: m }))}
                placeholder="Sélectionner un modèle"
                error={errors.model}
                required
              />
              <button
                type="button"
                onClick={() => setUseCustomModel(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Ajouter un modèle personnalisé
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                label="Modèle"
                name="model"
                value={model}
                onChange={handleModelChange}
                placeholder="Ex: iPhone 15 Pro Max, Galaxy S24 Ultra"
                error={errors.model}
                required
              />
              {availableModels.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseCustomModel(false)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Retour à la sélection prédéfinie
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
