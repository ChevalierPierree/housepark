'use client';

import { useState } from 'react';
import { Share2, Heart, X, Copy, Check, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toggleFavorite } from '@/app/actions/favorites';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

interface VillaActionsProps {
  villaId: string;
  villaTitle: string;
  villaLocation: string;
  villaSlug: string;
}

export default function VillaActions({ villaId, villaTitle, villaLocation, villaSlug }: VillaActionsProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Favoris state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setIsLoggedIn(true);
      supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('villa_id', villaId)
        .maybeSingle()
        .then(({ data }) => setIsFavorited(!!data));
    });
  }, [villaId]);

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/villas/${villaSlug}`
    : `/villas/${villaSlug}`;

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(villaTitle);

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleFavorite() {
    if (favLoading) return;
    if (!isLoggedIn) { window.location.href = '/login'; return; }
    setFavLoading(true);
    const prev = isFavorited;
    setIsFavorited(!prev);
    try {
      const result = await toggleFavorite(villaId);
      setIsFavorited(result.isFavorited);
    } catch {
      setIsFavorited(prev);
    } finally {
      setFavLoading(false);
    }
  }

  const shareOptions = [
    {
      label: copied ? 'Lien copié !' : 'Copier le lien',
      icon: copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />,
      onClick: copyLink,
    },
    {
      label: 'E-mail',
      icon: <Mail className="h-5 w-5" />,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
    {
      label: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.854L0 24l6.335-1.51A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.502-5.177-1.381l-.371-.22-3.763.898.942-3.658-.242-.377A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      target: '_blank',
    },
    {
      label: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      target: '_blank',
    },
    {
      label: 'Twitter / X',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      target: '_blank',
    },
  ];

  return (
    <>
      {/* Boutons Share + Favoris */}
      <div className="flex items-center gap-1">
        {/* Share */}
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Partager"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline underline underline-offset-2">Partager</span>
        </button>

        {/* Favoris */}
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            isFavorited
              ? 'text-red-500 hover:bg-red-50'
              : 'text-gray-600 hover:bg-gray-100'
          } ${favLoading ? 'opacity-60 cursor-wait' : ''}`}
          aria-label={isFavorited ? 'Retirer des favoris' : 'Enregistrer'}
        >
          <Heart className={`h-4 w-4 transition-all ${isFavorited ? 'fill-red-500' : ''}`} />
          <span className="hidden sm:inline underline underline-offset-2">
            {isFavorited ? 'Enregistré' : 'Enregistrer'}
          </span>
        </button>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShareOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-semibold text-dark text-base">Partager cette annonce</h2>
                  <button
                    onClick={() => setShareOpen(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Mini card villa */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">{villaLocation}</p>
                  <p className="text-sm font-semibold text-dark mt-0.5 leading-snug">{villaTitle}</p>
                </div>

                {/* Options */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  {shareOptions.map((opt) =>
                    opt.href ? (
                      <a
                        key={opt.label}
                        href={opt.href}
                        target={(opt as { target?: string }).target}
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-medium text-dark"
                      >
                        {opt.icon}
                        {opt.label}
                      </a>
                    ) : (
                      <button
                        key={opt.label}
                        onClick={opt.onClick}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-sm font-medium text-dark ${
                          copied ? 'border-primary bg-primary/5 text-primary-forest' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
