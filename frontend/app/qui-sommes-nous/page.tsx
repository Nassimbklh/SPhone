import Link from 'next/link'

export default function AboutPage() {
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Qualite',
      description: 'Des produits controles et fiables'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Prix justes',
      description: 'Offrir le meilleur rapport qualite/prix'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: 'Transparence',
      description: 'Descriptions claires et honnetes'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Proximite',
      description: 'Un service client humain'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Securite',
      description: 'Paiements proteges, commandes suivies'
    }
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Qui sommes-nous ?
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Decouvrez l'histoire et les valeurs de S.phone, votre boutique de confiance dans le 93
            </p>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre histoire</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold text-gray-900">S.phone</span> est une boutique basee dans le{' '}
                <span className="font-semibold text-blue-600">Seine-Saint-Denis (93)</span>, specialisee dans les telephones,
                accessoires et objets connectes depuis plusieurs annees.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nous avons construit notre reputation sur la{' '}
                <span className="font-semibold">fiabilite, la qualite et la transparence</span>. Chaque jour, nous nous
                efforcons d'offrir a nos clients une experience d'achat agreable et securisee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                Rendre la technologie <span className="font-semibold">accessible, fiable et agreable</span> a acheter.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Chaque produit est selectionne avec soin, teste et controle avant d'etre propose a nos clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ce qui nous guide au quotidien et fait notre difference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-md transition-all duration-200">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nous sommes une <span className="font-semibold">boutique francaise, independante et proche de nos clients</span>.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Que vous recherchiez un smartphone, une montre connectee ou un accessoire, nous vous accompagnons
                du choix jusqu'a la livraison, avec un service client disponible et a l'ecoute.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Stock disponible</h4>
                    <p className="text-gray-600 text-sm">Produits en stock, expedition rapide</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Garantie qualite</h4>
                    <p className="text-gray-600 text-sm">Tous nos produits sont testes</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Paiement securise</h4>
                    <p className="text-gray-600 text-sm">Transactions 100% protegees</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Support reactif</h4>
                    <p className="text-gray-600 text-sm">Une equipe a votre ecoute</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-12 text-center text-white shadow-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pret a decouvrir nos produits ?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Parcourez notre catalogue et trouvez le produit ideal pour vous
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Decouvrir nos produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
