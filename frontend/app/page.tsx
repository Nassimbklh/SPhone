import Link from 'next/link'
import BestSellers from '@/components/BestSellers'

export default function Home() {
  const categories = [
    { id: 1, name: 'Telephones', slug: 'phones', icon: '📱', description: 'Les derniers smartphones' },
    { id: 2, name: 'Coques', slug: 'cases', icon: '🛡️', description: 'Protection premium' },
    { id: 3, name: 'Accessoires', slug: 'accessories', icon: '🔌', description: 'Cables, chargeurs et plus' },
    { id: 4, name: 'Montres', slug: 'watches', icon: '⌚', description: 'Montres connectees' },
    { id: 5, name: 'Ecouteurs', slug: 'earphones', icon: '🎧', description: 'Audio haute qualite' }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue chez <span className="text-gradient">S.phone</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Decouvrez notre collection de telephones, accessoires et montres connectees de qualite premium
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-base px-8 py-3">
                Voir les produits
              </Link>
              <Link href="/qui-sommes-nous" className="btn-secondary text-base px-8 py-3">
                Qui sommes-nous ?
              </Link>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm">
              <p className="text-sm text-blue-600 font-medium">
                ✨ Livraison gratuite des 50€ d'achat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Categories</h2>
            <p className="text-gray-600">Explorez notre large gamme de produits</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Qui sommes-nous ?</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-8"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-100 p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold text-gray-900">S.phone</span> est une boutique situee en{' '}
                <span className="font-semibold text-blue-600">Seine-Saint-Denis (93)</span>, specialisee dans les smartphones
                et produits numeriques depuis plusieurs annees.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Nous proposons des produits <span className="font-semibold text-gray-900">fiables, testes et au meilleur prix</span>,
                avec un service client <span className="font-semibold text-gray-900">humain, reactif et transparent</span>.
              </p>

              <div className="flex justify-center">
                <Link href="/qui-sommes-nous" className="btn-primary px-8 py-3">
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Produits Testes</h3>
              <p className="text-gray-600">Chaque produit est controle avant expedition</p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prix Justes</h3>
              <p className="text-gray-600">Le meilleur rapport qualite-prix du marche</p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Client</h3>
              <p className="text-gray-600">Une equipe a votre ecoute 7j/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
