'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Villa } from '@/lib/types';
import FavoriteButton from '@/components/villas/FavoriteButton';

export default function VillaCard({ villa }: { villa: Villa }) {
  const mainPhoto = villa.photos?.sort((a, b) => a.sort_order - b.sort_order)[0];

  return (
    <Link href={`/villas/${villa.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative rounded-3xl overflow-hidden bg-gray-900"
        style={{ aspectRatio: '3/4' }}
      >
        {/* Image */}
        {mainPhoto ? (
          <Image
            src={mainPhoto.url}
            alt={mainPhoto.alt || villa.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => console.error('[VillaCard] Image error:', mainPhoto.url, e)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-forest via-[#0d3a2b] to-dark flex items-center justify-center">
            <span className="text-white/10 text-8xl font-black tracking-tighter">HP</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-xs font-medium text-white/90">
            <MapPin className="h-3 w-3 text-primary" />
            {villa.location_label}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            <FavoriteButton villaId={villa.id} />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-2 font-medium">
            <Users className="h-3 w-3" />
            <span>{villa.capacity_min}–{villa.capacity_max} personnes</span>
          </div>
          <h3 className="text-xl font-black text-white leading-tight mb-4">
            {villa.title}
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/40 text-[11px] font-medium uppercase tracking-wide mb-0.5">
                {villa.price_type === 'per_night' ? 'À partir de' : 'Séjour complet'}
              </p>
              <span className="text-2xl font-black text-white">
                {formatPrice(villa.price_amount)}
              </span>
              <span className="text-white/40 text-sm ml-1">
                {villa.price_type === 'per_night' ? '/ nuit' : '/ séjour'}
              </span>
            </div>
            <span className="px-4 py-2 bg-primary text-gray-900 text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              Voir →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}