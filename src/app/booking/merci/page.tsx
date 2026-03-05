'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home, User, Sparkles, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function MerciPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <MerciContent />
    </Suspense>
  );
}

function MerciContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') || '';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-white">
      <div className="max-w-md w-full text-center">
        {/* Animated icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
          <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <CheckCircle className="h-10 w-10 text-gray-900" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-4 tracking-tight">
          C&apos;est
          <span className="gradient-text"> validé</span> !
        </h1>

        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Ton week-end est réservé. Il ne reste plus qu&apos;à préparer ta valise.
        </p>

        {reference && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ta référence</p>
            <p className="text-3xl font-bold text-dark tracking-wider font-mono">
              {reference}
            </p>
          </div>
        )}

        <p className="text-gray-400 text-sm mb-10 leading-relaxed">
          Un email de confirmation t&apos;a été envoyé. Retrouve ta réservation dans ton espace personnel.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </Link>
          <Link href="/account">
            <Button className="w-full sm:w-auto">
              <User className="h-4 w-4 mr-2" />
              Mon espace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
