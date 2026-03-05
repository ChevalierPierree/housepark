'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Heart,
  User,
  MapPin,
  ChevronRight,
  LogOut,
  CheckCircle,
  AlertCircle,
  Pencil,
  X,
  Home,
  Clock,
  Users,
  Hash,
  Phone,
  ExternalLink,
} from 'lucide-react';
import type { Booking, Profile, Villa } from '@/lib/types';
import { formatDate, formatPrice } from '@/lib/utils';
import { updateProfile } from '@/app/actions/profile';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type BookingWithVilla = Booking & {
  villa: {
    title: string;
    slug: string;
    location_label: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
};

type FavoriteVilla = Partial<Villa> & {
  photos?: { url: string; alt?: string; sort_order: number }[];
};

type Props = {
  profile: (Profile & { phone?: string }) | null;
  bookings: BookingWithVilla[];
  favorites: FavoriteVilla[];
};

const STATUS = {
  pending_test: { label: 'En attente', bg: 'bg-amber-50 text-amber-600 border border-amber-100', dot: 'bg-amber-400' },
  confirmed_test: { label: 'Confirmée', bg: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' },
  cancelled: { label: 'Annulée', bg: 'bg-red-50 text-red-500 border border-red-100', dot: 'bg-red-400' },
} as Record<string, { label: string; bg: string; dot: string }>;

const TABS = [
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'favoris', label: 'Favoris', icon: Heart },
  { id: 'profil', label: 'Profil', icon: User },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AccountTabs({ profile, bookings, favorites }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('reservations');

  return (
    <div className="bg-gray-50 min-h-[60vh]">
      {/* Barre d'onglets */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-150 ${
                    active
                      ? 'border-primary-forest text-primary-forest'
                      : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'reservations' && bookings.length > 0 && (
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-primary-forest/10 text-primary-forest' : 'bg-gray-100 text-gray-400'}`}>
                      {bookings.length}
                    </span>
                  )}
                  {tab.id === 'favoris' && favorites.length > 0 && (
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-primary-forest/10 text-primary-forest' : 'bg-gray-100 text-gray-400'}`}>
                      {favorites.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'reservations' && <ReservationsTab bookings={bookings} />}
        {activeTab === 'favoris' && <FavorisTab favorites={favorites} />}
        {activeTab === 'profil' && <ProfilTab profile={profile} />}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── Onglet Réservations */
function ReservationsTab({ bookings }: { bookings: BookingWithVilla[] }) {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithVilla | null>(null);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-9 w-9 text-primary-forest" />
        </div>
        <p className="text-xl font-black text-dark mb-2">Aucune réservation pour l&apos;instant.</p>
        <p className="text-sm text-gray-400 mb-8 font-light">Ton premier week-end Housespark t&apos;attend.</p>
        <Link
          href="/villas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-forest text-white font-bold rounded-xl hover:bg-[#044039] transition-colors"
        >
          Découvrir les villas <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const status = STATUS[booking.status] ?? STATUS.pending_test;
          return (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                    <span className="font-black text-dark text-lg leading-tight">
                      {booking.villa?.title || 'Villa'}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold ${status.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {booking.villa?.location_label && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary-forest shrink-0" />
                        {booking.villa.location_label}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                      {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-dark">{formatPrice(booking.total_estimated)}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{booking.reference}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                  {booking.guests_count} personne{booking.guests_count > 1 ? 's' : ''} · Réservé le {formatDate(booking.created_at)}
                </span>
                <button
                  className="text-xs font-bold text-primary-forest flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-forest/5"
                >
                  Voir +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────────── Modal réservation */
function BookingModal({ booking, onClose }: { booking: BookingWithVilla; onClose: () => void }) {
  const status = STATUS[booking.status] ?? STATUS.pending_test;

  const nights = Math.round(
    (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const mapsUrl =
    booking.villa?.latitude && booking.villa?.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${booking.villa.latitude},${booking.villa.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.villa?.location_label || '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold mb-2 ${status.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </div>
            <h2 className="text-xl font-black text-dark leading-tight">{booking.villa?.title}</h2>
            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 text-primary-forest" />
              {booking.villa?.location_label}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0 ml-4">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Dates */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Votre séjour</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-400 mb-1">Arrivée</p>
                <p className="text-base font-black text-dark">{formatDate(booking.start_date)}</p>
                <p className="text-xs text-primary-forest font-semibold mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> À partir de 16h00
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-400 mb-1">Départ</p>
                <p className="text-base font-black text-dark">{formatDate(booking.end_date)}</p>
                <p className="text-xs text-primary-forest font-semibold mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Avant 11h00
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 px-1">
              <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <Calendar className="h-3.5 w-3.5 text-gray-300" />
                {nights} nuit{nights > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <Users className="h-3.5 w-3.5 text-gray-300" />
                {booking.guests_count} personne{booking.guests_count > 1 ? 's' : ''}
              </span>
            </div>
          </section>

          {/* Adresse */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Adresse</h3>
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-forest/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Home className="h-4 w-4 text-primary-forest" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">{booking.villa?.title}</p>
                  <p className="text-sm text-gray-500">{booking.villa?.location_label}</p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-primary-forest hover:text-[#044039] transition-colors whitespace-nowrap px-3 py-2 bg-white rounded-xl border border-gray-200 hover:border-primary-forest/30"
              >
                Itinéraire <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>

          {/* À savoir */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">À savoir</h3>
            <div className="space-y-2.5">
              <ModalInfoLine icon={<Clock className="h-3.5 w-3.5 text-primary-forest" />} label="Check-in" value="À partir de 16h00 — accès autonome par code" />
              <ModalInfoLine icon={<Clock className="h-3.5 w-3.5 text-primary-forest" />} label="Check-out" value="Avant 11h00 — laisser les clés sur place" />
              <ModalInfoLine icon={<Home className="h-3.5 w-3.5 text-primary-forest" />} label="Arrivée" value="Instructions détaillées envoyées 48h avant" />
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Housespark</h3>
            <div className="bg-primary-forest/5 border border-primary-forest/10 rounded-2xl p-4 space-y-2">
              <ModalInfoLine icon={<Phone className="h-3.5 w-3.5 text-primary-forest" />} label="Urgences" value="+33 1 00 00 00 00 — 7j/7" />
              <ModalInfoLine icon={<Hash className="h-3.5 w-3.5 text-primary-forest" />} label="Référence" value={booking.reference} mono />
            </div>
          </section>

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-400">Total réservation</span>
            <span className="text-2xl font-black text-dark">{formatPrice(booking.total_estimated)}</span>
          </div>

          <Link
            href={`/villas/${booking.villa?.slug}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-dark text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-colors"
          >
            Voir la villa <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ModalInfoLine({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-xs font-semibold text-gray-400 shrink-0">{label} :</span>
        <span className={`text-sm text-dark font-medium break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── Onglet Favoris */
function FavorisTab({ favorites }: { favorites: FavoriteVilla[] }) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Heart className="h-9 w-9 text-red-300" />
        </div>
        <p className="text-xl font-black text-dark mb-2">Aucun favori pour l&apos;instant.</p>
        <p className="text-sm text-gray-400 mb-8 font-light">Clique sur le ♡ d&apos;une villa pour la retrouver ici.</p>
        <Link
          href="/villas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-forest text-white font-bold rounded-xl hover:bg-[#044039] transition-colors"
        >
          Explorer les villas <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {favorites.map((villa) => {
        const sortedPhotos = [...(villa.photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
        const photo = sortedPhotos[0];
        return (
          <Link
            key={villa.id}
            href={`/villas/${villa.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-gray-100 block"
            style={{ aspectRatio: '4/3' }}
          >
            {photo ? (
              <img
                src={photo.url}
                alt={photo.alt || villa.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-forest to-dark" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-white font-black text-base leading-tight">{villa.title}</p>
              <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {villa.location_label}
              </p>
            </div>
            {villa.price_amount != null && (
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                {formatPrice(villa.price_amount)}{villa.price_type === 'per_night' ? '/nuit' : '/séjour'}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── Onglet Profil */
function ProfilTab({ profile }: { profile: (Profile & { phone?: string }) | null }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const router = useRouter();

  const parts = profile?.name?.trim().split(' ') ?? [];
  const defaultFirst = parts[0] ?? '';
  const defaultLast = parts.slice(1).join(' ') ?? '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProfile(fd);
      setResult(res);
      if (res.success) setEditing(false);
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-xl">

      {/* Carte informations */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* En-tête carte */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <h2 className="text-base font-black text-dark">Informations personnelles</h2>
          {!editing ? (
            <button
              onClick={() => { setEditing(true); setResult(null); }}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-forest hover:text-[#044039] transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </button>
          ) : (
            <button
              onClick={() => { setEditing(false); setResult(null); }}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Annuler
            </button>
          )}
        </div>

        {/* Contenu */}
        {!editing ? (
          <div className="px-6 py-5 space-y-4">
            <InfoRow label="Prénom" value={defaultFirst || '—'} />
            <InfoRow label="Nom" value={defaultLast || '—'} />
            <InfoRow label="E-mail" value={profile?.email || '—'} />
            <InfoRow label="Téléphone" value={profile?.phone || '—'} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Prénom</label>
                <input
                  name="firstName"
                  defaultValue={defaultFirst}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-forest/30 focus:border-primary-forest transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Nom</label>
                <input
                  name="lastName"
                  defaultValue={defaultLast}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-forest/30 focus:border-primary-forest transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">E-mail</label>
              <input
                value={profile?.email || ''}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">L&apos;adresse e-mail ne peut pas être modifiée ici.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Téléphone <span className="normal-case font-normal">(optionnel)</span>
              </label>
              <input
                name="phone"
                defaultValue={profile?.phone || ''}
                type="tel"
                placeholder="+33 6 …"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-forest/30 focus:border-primary-forest transition-colors"
              />
            </div>

            {result?.error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {result.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-primary-forest text-white text-sm font-bold rounded-xl hover:bg-[#044039] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
          </form>
        )}

        {result?.success && (
          <div className="mx-6 mb-5 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Profil mis à jour avec succès.
          </div>
        )}
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-dark">Déconnexion</p>
            <p className="text-xs text-gray-400 mt-0.5">Tu seras redirigé vers l&apos;accueil.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-dark">{value}</span>
    </div>
  );
}
