import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="pt-16 pb-8 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex mb-5">
              <Image
                src="/images/Logo Housepark.svg"
                alt="Housespark"
                width={105}
                height={30}
                className="brightness-0 invert"
              />
            </Link>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-5">
              Explorer
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/villas', label: 'Nos villas' },
                { href: '/concept', label: 'Comment ça marche' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-5">
              Aide
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/login', label: 'Se connecter' },
                { href: '/register', label: 'Créer un compte' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:contact@housespark.fr" className="hover:text-white transition-colors">
                  contact@housespark.fr
                </a>
              </li>
            </ul>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-150"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-150"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-150"
                >
                  <TikTokIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Housespark. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Mentions légales</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
