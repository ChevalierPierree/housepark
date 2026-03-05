import { createClient } from '@/lib/supabase/server';
import VillaForm from '@/components/admin/VillaForm';
import type { Extra } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nouvelle villa – Admin Housespark',
};

export default async function NewVillaPage() {
  const supabase = await createClient();
  const { data: extras } = await supabase.from('extras').select('*').order('name');

  return <VillaForm allExtras={(extras as Extra[]) || []} />;
}
