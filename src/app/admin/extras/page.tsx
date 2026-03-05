import { createClient } from '@/lib/supabase/server';
import ExtrasClient from '@/components/admin/ExtrasClient';
import type { Extra } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extras – Admin Housespark',
};

export default async function AdminExtrasPage() {
  const supabase = await createClient();
  const { data: extras } = await supabase
    .from('extras')
    .select('*')
    .order('name');

  return <ExtrasClient extras={(extras as Extra[]) || []} />;
}
