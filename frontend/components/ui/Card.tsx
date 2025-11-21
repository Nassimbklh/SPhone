'use client'

import { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  icon?: ReactNode
  badge?: ReactNode
}

export function Card({
  title,
  description,
  children,
  className = '',
  icon,
  badge
}: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && <div className="text-blue-600">{icon}</div>}
              {title && (
                <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
              )}
            </div>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
