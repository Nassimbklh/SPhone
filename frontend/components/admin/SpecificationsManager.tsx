'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { getSpecificationTemplate, generateSpecKey } from '@/lib/specifications'
import type { SpecificationField } from '@/lib/specifications'

interface Specification {
  label: string
  value: string
}

interface SpecificationsManagerProps {
  category: string
  specifications: Specification[]
  onChange: (specifications: Specification[]) => void
  errors?: Record<string, string>
}

export function SpecificationsManager({
  category,
  specifications,
  onChange,
  errors = {}
}: SpecificationsManagerProps) {
  const [customLabel, setCustomLabel] = useState('')
  const [customValue, setCustomValue] = useState('')

  const template = getSpecificationTemplate(category)

  const handleSpecChange = (index: number, field: 'label' | 'value', newValue: string) => {
    const newSpecs = [...specifications]
    newSpecs[index] = { ...newSpecs[index], [field]: newValue }
    onChange(newSpecs)
  }

  const handleRemoveSpec = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index)
    onChange(newSpecs)
  }

  const handleAddFromTemplate = (field: SpecificationField) => {
    // Check if this specification already exists
    const exists = specifications.some(spec => spec.label === field.label)
    if (!exists) {
      onChange([...specifications, { label: field.label, value: '' }])
    }
  }

  const handleAddCustomSpec = () => {
    if (customLabel.trim() && customValue.trim()) {
      onChange([...specifications, { label: customLabel.trim(), value: customValue.trim() }])
      setCustomLabel('')
      setCustomValue('')
    }
  }

  const handleSuggestionClick = (index: number, suggestion: string) => {
    handleSpecChange(index, 'value', suggestion)
  }

  return (
    <div className="space-y-6">
      {/* Template-based specifications */}
      {template.length > 0 && (
        <Card
          title="Spécifications suggérées"
          description="Ajoutez les spécifications courantes pour cette catégorie"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {template.map((field) => {
              const alreadyAdded = specifications.some(spec => spec.label === field.label)
              return (
                <button
                  key={field.key}
                  type="button"
                  onClick={() => handleAddFromTemplate(field)}
                  disabled={alreadyAdded}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    alreadyAdded
                      ? 'bg-green-50 border-green-200 text-green-700 cursor-not-allowed'
                      : 'bg-white border-gray-300 hover:border-blue-400 text-gray-700'
                  }`}
                >
                  {alreadyAdded ? '✓ ' : '+ '}
                  {field.label}
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {/* Added specifications */}
      {specifications.length > 0 && (
        <Card
          title="Spécifications ajoutées"
          description="Renseignez les valeurs pour chaque spécification"
        >
          <div className="space-y-4">
            {specifications.map((spec, index) => {
              const templateField = template.find(f => f.label === spec.label)

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      {/* Label (read-only or editable for custom specs) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la spécification
                        </label>
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                          disabled={!!templateField}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                            templateField ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                          }`}
                        />
                      </div>

                      {/* Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valeur
                        </label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          placeholder={templateField?.placeholder || 'Entrez la valeur'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Suggestions */}
                      {templateField?.suggestions && templateField.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Suggestions :</p>
                          <div className="flex flex-wrap gap-2">
                            {templateField.suggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSuggestionClick(index, suggestion)}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Retirer cette spécification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Add custom specification */}
      <Card
        title="Spécification personnalisée"
        description="Ajoutez une spécification qui n'est pas dans la liste suggérée"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom"
            name="customLabel"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Ex: Poids, Dimensions..."
          />
          <Input
            label="Valeur"
            name="customValue"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Ex: 221 g, 160 x 78 x 8 mm..."
          />
        </div>
        <button
          type="button"
          onClick={handleAddCustomSpec}
          disabled={!customLabel.trim() || !customValue.trim()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          + Ajouter la spécification
        </button>
      </Card>

      {errors.specifications && (
        <p className="text-sm text-red-600">{errors.specifications}</p>
      )}
    </div>
  )
}
