import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/home/HomeClient';
import type { Villa } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('villas')
    .select('*, photos:villa_photos(*)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const villas = (data as Villa[]) || [];

  return <HomeClient villas={villas} />;
}
