'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non connecté' };

  const name  = `${(formData.get('firstName') as string || '').trim()} ${(formData.get('lastName') as string || '').trim()}`.trim();
  const phone = (formData.get('phone') as string || '').trim();

  // Try with phone first; if column doesn't exist, retry without
  const { error } = await supabase
    .from('profiles')
    .update({ name, ...(phone ? { phone } : {}) })
    .eq('id', user.id);

  if (error) {
    if (error.message?.includes('phone')) {
      // Column doesn't exist yet — update only name
      const { error: e2 } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);
      if (e2) return { error: e2.message };
    } else {
      return { error: error.message };
    }
  }

  revalidatePath('/account');
  return { success: true };
}
