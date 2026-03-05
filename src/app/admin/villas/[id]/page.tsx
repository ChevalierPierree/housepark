import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import VillaForm from '@/components/admin/VillaForm';
import type { Villa, Extra } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modifier villa – Admin Housespark',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVillaPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [villaRes, extrasRes, villaExtrasRes] = await Promise.all([
    supabase
      .from('villas')
      .select('*, photos:villa_photos(*)')
      .eq('id', id)
      .single(),
    supabase.from('extras').select('*').order('name'),
    supabase.from('villa_extras').select('extra_id').eq('villa_id', id),
  ]);

  if (!villaRes.data) notFound();

  const villa = villaRes.data as Villa;
  const extras = (extrasRes.data as Extra[]) || [];
  const villaExtraIds =
    villaExtrasRes.data?.map((ve: { extra_id: string }) => ve.extra_id) || [];

  return (
    <VillaForm villa={villa} allExtras={extras} villaExtraIds={villaExtraIds} />
  );
}
