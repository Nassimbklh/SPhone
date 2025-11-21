import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="container-custom py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement annulé</h1>
        <p className="text-gray-600 mb-8">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold text-blue-900 mb-3">Que s'est-il passé ?</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Vous avez annulé le paiement ou fermé la fenêtre de paiement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Vos articles sont toujours dans votre panier</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Vous pouvez réessayer le paiement à tout moment</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cart"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Retour au panier
          </Link>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  )
}
