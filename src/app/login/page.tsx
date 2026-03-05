'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('not confirmed')) {
        setError('Ton email n\'est pas encore confirmé. Vérifie ta boîte mail et clique sur le lien reçu.');
      } else if (error.message.toLowerCase().includes('invalid login')) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    router.push('/account');
    router.refresh();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-gray-50/50">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-8 group">
            <Image
              src="/images/Logo%20Housepark.svg"
              alt="Housespark"
              width={60}
              height={60}
              className="group-hover:scale-110 transition-transform"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Content de te revoir !</h1>
          <p className="text-gray-400 mt-2">
            Connecte-toi pour accéder à ton espace
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3.5 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                id="password"
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full !py-4" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Connexion…</span>
              ) : (
                <span className="flex items-center gap-2">Se connecter <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
