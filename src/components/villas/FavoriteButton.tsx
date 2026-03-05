'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toggleFavorite } from '@/app/actions/favorites';

interface FavoriteButtonProps {
  villaId: string;
}

export default function FavoriteButton({ villaId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setIsLoggedIn(true);
      supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('villa_id', villaId)
        .single()
        .then(({ data }) => {
          setIsFavorited(!!data);
        });
    });
  }, [villaId]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    const prev = isFavorited;
    setIsFavorited(!prev); // optimistic
    setError(false);
    try {
      const result = await toggleFavorite(villaId);
      setIsFavorited(result.isFavorited);
    } catch (err) {
      console.error('[FavoriteButton] Erreur:', err);
      setIsFavorited(prev); // rollback
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={error ? 'Erreur — migration Supabase non exécutée ?' : undefined}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
        loading ? 'opacity-60 cursor-wait' : ''
      } ${
        error
          ? 'bg-red-500 text-white'
          : isFavorited
          ? 'bg-white text-red-500 shadow-md'
          : 'bg-black/30 backdrop-blur-sm text-white hover:bg-white hover:text-red-400'
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-200 ${isFavorited ? 'fill-current' : ''}`}
      />
    </button>
  );
}
