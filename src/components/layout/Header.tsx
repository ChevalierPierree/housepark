'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Instagram, Facebook } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Icône TikTok SVG (pas dans lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDrawerOpen(false);
    setUser(null);
    setIsAdmin(false);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({ id: user.id, email: user.email });
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.role === 'admin') setIsAdmin(true);
          });
      }
    });
  }, []);

  // Bloquer le scroll body quand le drawer est ouvert
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const menuLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/villas', label: 'Nos villas' },
    { href: '/concept', label: 'Comment ça marche' },
    { href: '/contact', label: 'Contact' },
    { href: user ? '/account' : '/login', label: 'Mon compte' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-gray-200/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/Logo%20Housepark.svg"
                alt="Housespark"
                width={60}
                height={60}
                style={{ mixBlendMode: 'multiply' }}
              />
            </Link>


            {/* Droite */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:block px-4 py-2 text-sm font-medium text-gray-500 hover:text-dark rounded-lg transition-colors duration-200"
                >
                  Admin
                </Link>
              )}

              {/* Mon compte */}
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-900" />
                  </div>
                  <span className="text-xs font-medium text-dark">Mon compte</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-dark text-white text-sm font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Connexion
                </Link>
              )}

              {/* Burger */}
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Menu"
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 h-full w-[300px] sm:w-[340px] z-[70] bg-[#0f0f0f] flex flex-col"
          >
            {/* Close */}
            <div className="flex items-center justify-between px-7 pt-7 pb-2">
              <Image
                src="/images/Logo%20Housepark.svg"
                alt="Housepark"
                width={44}
                height={44}
                style={{ mixBlendMode: 'screen', filter: 'invert(1) brightness(2)' }}
              />
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-5 pt-8 space-y-1">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                  >
                    <span className="text-base font-semibold">{link.label}</span>
                    <span className="h-px w-4 bg-gray-700 group-hover:bg-primary group-hover:w-6 transition-all duration-200" />
                  </Link>
                </motion.div>
              ))}
              {/* Se connecter / Se déconnecter */}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuLinks.length * 0.06 + 0.1 }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-3.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 group"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-base font-semibold">Se déconnecter</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuLinks.length * 0.06 + 0.1 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-3.5 rounded-xl text-primary hover:text-white hover:bg-primary/10 transition-all duration-150 group"
                  >
                    <span className="text-base font-semibold">Se connecter</span>
                    <span className="h-px w-4 bg-primary/40 group-hover:w-6 transition-all duration-200" />
                  </Link>
                </motion.div>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between px-3 py-3.5 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all duration-150 text-sm font-medium"
                >
                  Administration
                </Link>
              )}
            </nav>

            {/* Bas : réseaux sociaux */}
            <div className="px-7 pb-10">
              <div className="h-px bg-gray-800 mb-7" />
              <p className="text-gray-600 text-xs uppercase tracking-[0.2em] font-semibold mb-5">Nous suivre</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-150"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-150"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-150"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
