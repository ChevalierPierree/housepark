'use server';

import { createClient } from '@/lib/supabase/server';

export async function toggleFavorite(villaId: string): Promise<{ isFavorited: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non connecté');

  const { data: existing, error: selectError } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('villa_id', villaId)
    .maybeSingle();

  if (selectError && selectError.code !== 'PGRST116') {
    throw new Error(`Supabase select error: ${selectError.message}`);
  }

  if (existing) {
    const { error: deleteError } = await supabase.from('favorites').delete().eq('id', existing.id);
    if (deleteError) throw new Error(`Supabase delete error: ${deleteError.message}`);
    return { isFavorited: false };
  } else {
    const { error: insertError } = await supabase.from('favorites').insert({ user_id: user.id, villa_id: villaId });
    if (insertError) throw new Error(`Supabase insert error: ${insertError.message}`);
    return { isFavorited: true };
  }
}

export async function getFavoriteIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('favorites')
    .select('villa_id')
    .eq('user_id', user.id);

  return (data || []).map((f) => f.villa_id);
}
