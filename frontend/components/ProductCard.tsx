import Link from 'next/link'
import Image from 'next/image'
import { translateCategory, getCategoryEmoji, translateLabel } from '@/lib/translations'

interface Product {
  _id: string
  id?: number
  name: string
  category: string
  price: number
  pricePublic?: number
  image?: string
  images?: string[]
  stock: number
  totalStock?: number  // Stock calculé de toutes les variantes
  variants?: any
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.pricePublic && product.pricePublic > product.price
    ? Math.round(((product.pricePublic - product.price) / product.pricePublic) * 100)
    : null

  // Déterminer l'image à afficher
  const getProductImage = () => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string') {
      let imageUrl = product.images[0]
      if (imageUrl.startsWith('http')) {
        // URL complète, utiliser telle quelle
        return imageUrl
      } else if (imageUrl.startsWith('/')) {
        // Chemin relatif commençant par /, préfixer avec l'URL de l'API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        return `${apiUrl}${imageUrl}`
      } else {
        // Nom de fichier seul, construire le chemin complet
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        return `${apiUrl}/uploads/${imageUrl}`
      }
    }
    return null
  }

  const productImage = getProductImage()

  // Utiliser totalStock si disponible (pour produits avec variantes), sinon stock
  const displayStock = product.totalStock !== undefined ? product.totalStock : product.stock

  return (
    <Link href={`/product/${product._id}`} className="group block h-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col hover:border-gray-300">
        {/* Image Container */}
        <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="text-8xl transition-transform duration-300 group-hover:scale-110">
              {getCategoryEmoji(product.category)}
            </div>
          )}

          {/* Stock Badge */}
          {displayStock < 10 && displayStock > 0 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">
              {translateLabel('limitedStock')}
            </div>
          )}

          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-3 left-3 bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
              -{discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3 flex-wrap">
              {discount ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}€
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.pricePublic}€
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {product.price}€
                </span>
              )}
            </div>

            {/* Stock Info */}
            <div className="text-xs text-gray-500 mb-3">
              {displayStock > 0 ? (
                <span className="text-green-600 font-medium">✓ {translateLabel('inStock')}</span>
              ) : (
                <span className="text-red-600 font-medium">{translateLabel('outOfStock')}</span>
              )}
            </div>

            {/* CTA Button */}
            <button className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm">
              {translateLabel('viewDetails')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
