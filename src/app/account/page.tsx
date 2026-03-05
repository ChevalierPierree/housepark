import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MapPin } from 'lucide-react';
import type { Booking, Profile, Villa } from '@/lib/types';
import type { Metadata } from 'next';
import AccountTabs from '@/components/account/AccountTabs';

export const metadata: Metadata = {
  title: 'Mon compte – Housespark',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [profileRes, bookingsRes, favoritesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('bookings')
      .select('*, villa:villas(title, slug, location_label, latitude, longitude)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('favorites')
      .select('villa_id, villas(id, title, slug, location_label, price_amount, price_type, photos:villa_photos(url, alt, sort_order))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const profile = profileRes.data as (Profile & { phone?: string }) | null;
  const bookings = (bookingsRes.data as (Booking & { villa: { title: string; slug: string; location_label: string; latitude?: number | null; longitude?: number | null } | null })[]) || [];
  const favorites = ((favoritesRes.data || []).map((f: Record<string, unknown>) => f.villas).filter(Boolean)) as Partial<Villa>[];

  // Prénom : on prend le premier mot, capitalize
  const rawFirst = profile?.name?.trim().split(' ')[0] || 'toi';
  const firstName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase();

  const memberYear = new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* En-tête de profil */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Mon espace</p>
              <h1 className="text-2xl font-black text-dark">
                Bonjour, {firstName} 👋
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="text-sm text-gray-400">{profile?.email}</span>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400 font-medium">Membre depuis {memberYear}</span>
              </div>
            </div>

            <Link
              href="/villas"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-forest text-white text-sm font-bold rounded-xl hover:bg-[#044039] transition-colors shrink-0"
            >
              Réserver <MapPin className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Onglets + contenu */}
      <AccountTabs
        profile={profile}
        bookings={bookings}
        favorites={favorites}
      />
    </div>
  );
}
