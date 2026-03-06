'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/account';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Si session null = confirmation email requise
    if (!data.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    router.push(nextUrl);
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
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Rejoins Housespark</h1>
          <p className="text-gray-400 mt-2">
            Crée ton compte et réserve ton premier week-end
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary-forest" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Vérifie ta boîte mail !</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Un lien de confirmation a été envoyé à <strong>{email}</strong>.<br />
              Clique dessus pour activer ton compte, puis connecte-toi.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary-forest hover:underline">
              Aller à la connexion <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3.5 top-[38px] h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  label="Prénom"
                  type="text"
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <div>
                <Input
                  id="lastName"
                  label="Nom"
                  type="text"
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                placeholder="6 caractères minimum"
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
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Création…</span>
              ) : (
                <span className="flex items-center gap-2">Créer mon compte <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
        </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-8">
          Déjà un compte ?{' '}
          <Link
            href={`/login${nextUrl !== '/account' ? `?next=${encodeURIComponent(nextUrl)}` : ''}`}
            className="text-primary font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh]" />}>
      <RegisterForm />
    </Suspense>
  );
}
