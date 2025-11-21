import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'S.phone - Boutique Tech Futuriste',
  description: 'Téléphones, accessoires et produits électroniques de qualité',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <main className="pt-24 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="glass border-t border-silver-200 dark:border-silver-800 mt-20">
          <div className="container-custom py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* About */}
              <div>
                <h3 className="text-lg font-bold text-gradient mb-4">S.phone</h3>
                <p className="text-sm text-silver-600 dark:text-silver-400">
                  Votre boutique de référence pour les produits électroniques et accessoires tech.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold mb-4 text-gray-900">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link></li>
                  <li><Link href="/products" className="hover:text-blue-600 transition-colors">Produits</Link></li>
                  <li><Link href="/qui-sommes-nous" className="hover:text-blue-600 transition-colors">Qui sommes-nous ?</Link></li>
                  <li><Link href="/cart" className="hover:text-blue-600 transition-colors">Panier</Link></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-4">Catégories</h4>
                <ul className="space-y-2 text-sm text-silver-600 dark:text-silver-400">
                  <li><Link href="/products?category=phones" className="hover:text-blue-500 transition-colors">Téléphones</Link></li>
                  <li><Link href="/products?category=cases" className="hover:text-blue-500 transition-colors">Coques</Link></li>
                  <li><Link href="/products?category=accessories" className="hover:text-blue-500 transition-colors">Accessoires</Link></li>
                  <li><Link href="/products?category=watches" className="hover:text-blue-500 transition-colors">Montres</Link></li>
                  <li><Link href="/products?category=earphones" className="hover:text-blue-500 transition-colors">Écouteurs</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-silver-600 dark:text-silver-400">
                  <li>Email: contact@sphone.com</li>
                  <li>Tél: +33 1 23 45 67 89</li>
                  <li>Support 7j/7</li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-silver-200 dark:border-silver-800 mt-8 pt-8 text-center text-sm text-silver-600 dark:text-silver-400">
              <p>&copy; 2024 S.phone. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
