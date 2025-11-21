'use client'

import { useState } from 'react'
import { Accordion } from '@/components/ui/Accordion'
import { STORAGE_CAPACITIES } from '@/lib/products-data'
import { ETAT_ORDER, ETAT_LABELS, ETAT_DESCRIPTIONS } from '@/lib/conditions'
import type { EtatType, StorageType, ProductVariants } from '@/lib/conditions'

// Couleurs prédéfinies avec leurs codes hexadécimaux
const PREDEFINED_COLORS = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Argent', hex: '#C0C0C0' },
  { name: 'Or', hex: '#FFD700' },
  { name: 'Bleu', hex: '#0000FF' },
  { name: 'Bleu Ciel', hex: '#87CEEB' },
  { name: 'Bleu Nuit', hex: '#191970' },
  { name: 'Rouge', hex: '#FF0000' },
  { name: 'Bordeaux', hex: '#800020' },
  { name: 'Rose', hex: '#FFC0CB' },
  { name: 'Corail', hex: '#FF7F50' },
  { name: 'Vert', hex: '#00FF00' },
  { name: 'Vert Forêt', hex: '#228B22' },
  { name: 'Vert Menthe', hex: '#98FF98' },
  { name: 'Jaune', hex: '#FFFF00' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Violet', hex: '#8B00FF' },
  { name: 'Marron', hex: '#8B4513' },
  { name: 'Beige', hex: '#F5F5DC' }
]

interface VariantsManagerProps {
  variants: ProductVariants
  onChange: (variants: ProductVariants) => void
  errors?: Record<string, string>
}

export function VariantsManager({ variants, onChange, errors = {} }: VariantsManagerProps) {
  const [selectedStorages, setSelectedStorages] = useState<string[]>(
    Object.keys(variants).length > 0 ? Object.keys(variants) : []
  )

  const handleStorageToggle = (storage: string) => {
    const newVariants = JSON.parse(JSON.stringify(variants)) // Copie profonde

    if (selectedStorages.includes(storage)) {
      // Retirer le stockage
      delete newVariants[storage]
      setSelectedStorages(selectedStorages.filter(s => s !== storage))
    } else {
      // Ajouter le stockage avec des états vides
      newVariants[storage] = {}
      setSelectedStorages([...selectedStorages, storage])
    }

    onChange(newVariants)
  }

  const handleVariantChange = (
    storage: string,
    etat: EtatType,
    field: 'prix' | 'prixPublic' | 'couleurs',
    value: any
  ) => {
    const newVariants = JSON.parse(JSON.stringify(variants)) // Copie profonde

    if (!newVariants[storage]) {
      newVariants[storage] = {}
    }

    if (!newVariants[storage][etat]) {
      // Créer avec une couleur vide par défaut pour que l'utilisateur voie les champs immédiatement
      newVariants[storage][etat] = { prix: 0, couleurs: [{ nom: '', stock: 0 }] }
    }

    newVariants[storage][etat][field] = value

    onChange(newVariants)
  }

  const handleAddCouleur = (storage: string, etat: EtatType) => {
    const newVariants = JSON.parse(JSON.stringify(variants)) // Copie profonde

    if (!newVariants[storage]) {
      newVariants[storage] = {}
    }

    if (!newVariants[storage][etat]) {
      newVariants[storage][etat] = { prix: 0, couleurs: [{ nom: '', stock: 0 }] }
    }

    // Ajouter une couleur vide supplémentaire
    const currentCouleurs = newVariants[storage][etat].couleurs || []
    newVariants[storage][etat].couleurs = [...currentCouleurs, { nom: '', stock: 0 }]

    onChange(newVariants)
  }

  const handleRemoveCouleur = (storage: string, etat: EtatType, index: number) => {
    const newVariants = JSON.parse(JSON.stringify(variants)) // Copie profonde

    if (!newVariants[storage]?.[etat]) return

    const currentCouleurs = newVariants[storage][etat].couleurs || []
    newVariants[storage][etat].couleurs = currentCouleurs.filter((_: any, i: number) => i !== index)

    onChange(newVariants)
  }

  const handleCouleurChange = (
    storage: string,
    etat: EtatType,
    index: number,
    field: 'nom' | 'stock',
    value: string | number
  ) => {
    const newVariants = JSON.parse(JSON.stringify(variants)) // Copie profonde

    if (!newVariants[storage]?.[etat]) return

    const currentCouleurs = newVariants[storage][etat].couleurs || []
    if (!currentCouleurs[index]) return

    currentCouleurs[index][field] = value

    onChange(newVariants)
  }

  const handleRemoveEtat = (storage: string, etat: EtatType) => {
    const newVariants = JSON.parse(JSON.stringify(variants)) // Copie profonde

    if (newVariants[storage]) {
      delete newVariants[storage][etat]
    }

    onChange(newVariants)
  }

  const hasAnyEtat = (storage: string): boolean => {
    return variants[storage] && Object.keys(variants[storage]).length > 0
  }

  const getEtatsForStorage = (storage: string): EtatType[] => {
    if (!variants[storage]) return []
    return Object.keys(variants[storage]) as EtatType[]
  }

  return (
    <div className="space-y-6">
      {/* Sélection des capacités de stockage */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Capacités de stockage disponibles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {STORAGE_CAPACITIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStorageToggle(value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedStorages.includes(value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <p className="font-semibold text-gray-900">{label}</p>
                {selectedStorages.includes(value) && hasAnyEtat(value) && (
                  <p className="text-xs text-blue-600 mt-1">
                    {getEtatsForStorage(value).length} état(s)
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
        {errors.storages && <p className="mt-2 text-sm text-red-600">{errors.storages}</p>}
      </div>

      {/* Gestion des variantes par stockage */}
      {selectedStorages.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Configuration des variantes</h3>

          {selectedStorages.sort((a, b) => parseInt(a) - parseInt(b)).map(storage => (
            <Accordion
              key={storage}
              title={`${STORAGE_CAPACITIES.find(s => s.value === storage)?.label}`}
              defaultOpen={selectedStorages.length === 1}
              badge={getEtatsForStorage(storage).length}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              }
            >
              <div className="space-y-4">
                {/* Liste des états configurés */}
                {ETAT_ORDER.map(etat => {
                  const variant = variants[storage]?.[etat]
                  const isConfigured = variant !== undefined

                  return (
                    <div
                      key={etat}
                      className={`border rounded-lg p-4 ${
                        isConfigured ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{ETAT_LABELS[etat]}</h4>
                            {isConfigured && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Configuré
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{ETAT_DESCRIPTIONS[etat]}</p>
                        </div>

                        {isConfigured && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEtat(storage, etat)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Retirer cet état"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {isConfigured ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Prix */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix (€) *
                              </label>
                              <input
                                type="number"
                                value={variant.prix || ''}
                                onChange={(e) => handleVariantChange(storage, etat, 'prix', parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>

                            {/* Prix public */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix public (€)
                              </label>
                              <input
                                type="number"
                                value={variant.prixPublic || ''}
                                onChange={(e) => handleVariantChange(storage, etat, 'prixPublic', parseFloat(e.target.value) || undefined)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Optionnel"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          {/* Couleurs avec stock */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Couleurs et stock *
                            </label>
                            <div className="space-y-4">
                              {(variant.couleurs || []).map((couleur, index) => {
                                const isCustomColor = !PREDEFINED_COLORS.some(c => c.name === couleur.nom)
                                const selectedColor = PREDEFINED_COLORS.find(c => c.name === couleur.nom)

                                return (
                                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-700">Couleur {index + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveCouleur(storage, etat, index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                        title="Supprimer cette couleur"
                                      >
                                        ✕ Supprimer
                                      </button>
                                    </div>

                                    {/* Grille de pastilles de couleurs */}
                                    <div className="mb-3">
                                      <p className="text-xs text-gray-600 mb-2">Choisissez une couleur :</p>
                                      <div className="grid grid-cols-5 gap-2">
                                        {PREDEFINED_COLORS.map((color) => (
                                          <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => handleCouleurChange(storage, etat, index, 'nom', color.name)}
                                            className={`relative h-12 rounded-lg border-2 transition-all ${
                                              couleur.nom === color.name
                                                ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                          >
                                            {couleur.nom === color.name && (
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}>
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                              </div>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Couleur sélectionnée + Stock */}
                                    <div className="flex gap-3 items-center">
                                      {/* Aperçu de la couleur sélectionnée */}
                                      <div className="flex items-center gap-2 flex-1">
                                        {selectedColor && (
                                          <div
                                            className="w-8 h-8 rounded border-2 border-gray-300"
                                            style={{ backgroundColor: selectedColor.hex }}
                                          />
                                        )}
                                        <span className={`text-sm font-semibold ${couleur.nom ? 'text-gray-900' : 'text-gray-400'}`}>
                                          {couleur.nom || 'Aucune couleur sélectionnée'}
                                        </span>
                                      </div>

                                      {/* Champ stock */}
                                      <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-600">Stock:</label>
                                        <input
                                          type="number"
                                          value={couleur.stock}
                                          onChange={(e) => handleCouleurChange(storage, etat, index, 'stock', parseInt(e.target.value) || 0)}
                                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                          placeholder="0"
                                          min="0"
                                          step="1"
                                        />
                                      </div>
                                    </div>

                                    {/* Option couleur personnalisée */}
                                    {isCustomColor && (
                                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                                        <p className="text-xs text-blue-700 mb-1">✏️ Couleur personnalisée</p>
                                        <input
                                          type="text"
                                          value={couleur.nom}
                                          onChange={(e) => handleCouleurChange(storage, etat, index, 'nom', e.target.value)}
                                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                          placeholder="Nom de la couleur personnalisée"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                              <button
                                type="button"
                                onClick={() => handleAddCouleur(storage, etat)}
                                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                              >
                                + Ajouter une couleur
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantChange(storage, etat, 'prix', 0)
                          }
                          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          + Ajouter cet état
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  )
}
