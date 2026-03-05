import { createClient } from '@/lib/supabase/server';
import VillasClient from '@/components/villas/VillasClient';
import type { Villa, Extra } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos lieux – Housespark',
  description:
    'Le lieu parfait pour ton groupe. Filtre par destination, capacité, activités et budget.',
};

export const revalidate = 60;

export default async function VillasPage() {
  const supabase = await createClient();

  const [villasRes, extrasRes] = await Promise.all([
    supabase
      .from('villas')
      .select('*, photos:villa_photos(*), villa_extras(extra_id)')
      .eq('published', true)
      .order('created_at', { ascending: false }),
    supabase.from('extras').select('*').order('name'),
  ]);

  const villas = (villasRes.data as Villa[]) || [];
  const extras = (extrasRes.data as Extra[]) || [];

  // Collect unique activities & locations
  const allActivities = Array.from(
    new Set(villas.flatMap((v) => v.activities))
  ).sort();
  const allLocations = Array.from(
    new Set(villas.map((v) => v.location_label))
  ).sort();

  return (
    <VillasClient
      villas={villas}
      allExtras={extras}
      allActivities={allActivities}
      allLocations={allLocations}
    />
  );
}
