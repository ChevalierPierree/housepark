import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PhotoCarousel from '@/components/villas/PhotoCarousel';
import BookingForm from '@/components/booking/BookingForm';
import VillaActions from '@/components/villas/VillaActions';
import VillaMapClient from '@/components/villas/VillaMapClient';
import { formatPrice } from '@/lib/utils';
import {
  MapPin,
  Users,
  ArrowLeft,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Music2,
  ChefHat,
  Bed,
  Tv,
  Flame,
  Snowflake,
  TreePine,
  Wine,
  CircleDot,
  Sofa,
  Droplets,
  Building2,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import type { Villa, Extra } from '@/lib/types';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: villa } = await supabase
    .from('villas')
    .select('title, description')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!villa) return { title: 'Villa introuvable – Housespark' };

  return {
    title: `${villa.title} – Housespark`,
    description: villa.description.slice(0, 160),
  };
}

export const revalidate = 60;

// Icône décorative selon mot-clé équipement
function getEquipmentIcon(item: string) {
  const l = item.toLowerCase();
  if (l.includes('wifi') || l.includes('internet')) return <Wifi className="h-3.5 w-3.5" />;
  if (l.includes('parking') || l.includes('garage') || l.includes('voiture')) return <Car className="h-3.5 w-3.5" />;
  if (l.includes('piscine') || l.includes('bain') || l.includes('pool')) return <Waves className="h-3.5 w-3.5" />;
  if (l.includes('spa') || l.includes('jacuzzi') || l.includes('sauna')) return <Droplets className="h-3.5 w-3.5" />;
  if (l.includes('lit') || l.includes('chambre') || l.includes('suite')) return <Bed className="h-3.5 w-3.5" />;
  if (l.includes('padel') || l.includes('tennis') || l.includes('basket') || l.includes('sport') || l.includes('gym') || l.includes('fitness')) return <Dumbbell className="h-3.5 w-3.5" />;
  if (l.includes('cuisine') || l.includes('chef') || l.includes('culinaire')) return <ChefHat className="h-3.5 w-3.5" />;
  if (l.includes('bbq') || l.includes('barbecue') || l.includes('cheminée') || l.includes('foyer')) return <Flame className="h-3.5 w-3.5" />;
  if (l.includes('sono') || l.includes('musique') || l.includes('dj') || l.includes('son') || l.includes('light')) return <Music2 className="h-3.5 w-3.5" />;
  if (l.includes('cinéma') || l.includes('cinema') || l.includes('tv') || l.includes('télé') || l.includes('home')) return <Tv className="h-3.5 w-3.5" />;
  if (l.includes('clim') || l.includes('chauffage') || l.includes('climatisation')) return <Snowflake className="h-3.5 w-3.5" />;
  if (l.includes('jardin') || l.includes('parc') || l.includes('verger') || l.includes('potager') || l.includes('forêt') || l.includes('rivière') || l.includes('lac')) return <TreePine className="h-3.5 w-3.5" />;
  if (l.includes('vin') || l.includes('cave') || l.includes('armagnac') || l.includes('bar')) return <Wine className="h-3.5 w-3.5" />;
  if (l.includes('réception') || l.includes('salle') || l.includes('voûtée')) return <Building2 className="h-3.5 w-3.5" />;
  if (l.includes('lounge') || l.includes('terrasse') || l.includes('salon')) return <Sofa className="h-3.5 w-3.5" />;
  if (l.includes('restaurant') || l.includes('repas') || l.includes('dîner')) return <Utensils className="h-3.5 w-3.5" />;
  // Icône par défaut pour tout le reste
  return <CircleDot className="h-3.5 w-3.5" />;
}

export default async function VillaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: villa } = await supabase
    .from('villas')
    .select('*, photos:villa_photos(*), villa_extras(extra_id)')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!villa) notFound();

  const typedVilla = villa as Villa;

  const extraIds = typedVilla.villa_extras?.map((ve) => ve.extra_id) || [];

  let extras: Extra[] = [];
  if (extraIds.length > 0) {
    const { data } = await supabase
      .from('extras')
      .select('*')
      .in('id', extraIds);
    extras = (data as Extra[]) || [];
  }

  const hasMap = typedVilla.latitude != null && typedVilla.longitude != null;

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar sticky */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/villas"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-dark transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 mr-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {typedVilla.location_label}
            </span>
            <VillaActions
              villaId={typedVilla.id}
              villaTitle={typedVilla.title}
              villaLocation={typedVilla.location_label}
              villaSlug={typedVilla.slug}
            />
          </div>
        </div>
      </div>

      {/* Gallery pleine largeur */}
      <PhotoCarousel photos={typedVilla.photos || []} />

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-10">

            {/* Titre + badges */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark leading-tight tracking-tight mb-4">
                {typedVilla.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full">
                  <Users className="h-3.5 w-3.5" />
                  {typedVilla.capacity_min}–{typedVilla.capacity_max} personnes
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full">
                  <MapPin className="h-3.5 w-3.5" />
                  {typedVilla.location_label}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary-forest text-sm font-semibold px-3 py-1.5 rounded-full">
                  {formatPrice(typedVilla.price_amount)}
                  <span className="font-normal text-primary-forest/60">
                    {typedVilla.price_type === 'per_night' ? '/ nuit' : '/ séjour'}
                  </span>
                </span>
              </div>
            </div>

            {/* Carte compacte juste après le titre */}
            {hasMap && (
              <VillaMapClient
                latitude={typedVilla.latitude!}
                longitude={typedVilla.longitude!}
                locationLabel={typedVilla.location_label}
              />
            )}

            <hr className="border-gray-100" />

            {/* Description */}
            <div>
              <h2 className="text-base font-semibold text-dark mb-3">À propos</h2>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                {typedVilla.description}
              </p>
            </div>

            {/* Équipements */}
            {typedVilla.equipments.length > 0 && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <h2 className="text-base font-semibold text-dark mb-4">Équipements</h2>
                  <div className="flex flex-wrap gap-2">
                    {typedVilla.equipments.map((item) => {
                      const icon = getEquipmentIcon(item);
                      return (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full"
                        >
                          {icon && <span className="text-primary-forest">{icon}</span>}
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Activités */}
            {typedVilla.activities.length > 0 && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <h2 className="text-base font-semibold text-dark mb-4">Activités</h2>
                  <div className="flex flex-wrap gap-2">
                    {typedVilla.activities.map((item) => (
                      <span
                        key={item}
                        className="text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Extras / À la carte */}
            {extras.length > 0 && (
              <>
                <hr className="border-gray-100" />
                <div>
                  <h2 className="text-base font-semibold text-dark mb-1">À la carte</h2>
                  <p className="text-sm text-gray-400 mb-5">Des options pour personnaliser votre séjour.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extras.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-dark">{extra.name}</p>
                          {extra.description && (
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{extra.description}</p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-bold text-sm text-dark">{formatPrice(extra.price_amount)}</p>
                          <p className="text-[11px] text-gray-400">
                            {extra.pricing_type === 'per_person' ? 'par pers.' : 'forfait'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar réservation — sticky Airbnb-style */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <BookingForm villa={typedVilla} extras={extras} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
