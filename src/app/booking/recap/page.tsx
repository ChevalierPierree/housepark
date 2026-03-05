'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays, Users, MapPin, AlertCircle, ArrowLeft,
  Check, Shield, Loader2, CreditCard, ChevronRight,
  Pencil, Smartphone, Wallet, Banknote, FlaskConical
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate, calculateNights } from '@/lib/utils';
import Input from '@/components/ui/Input';
import type { Villa, Extra } from '@/lib/types';

export default function BookingRecapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <BookingRecapContent />
    </Suspense>
  );
}

const STEPS = ['Coordonnées', 'Paiement', 'Confirmation'];

const PAYMENT_METHODS = [
  { id: 'cb',       label: 'Carte bancaire',  icon: CreditCard,   functional: false },
  { id: 'apple',    label: 'Apple Pay',       icon: Smartphone,   functional: false },
  { id: 'google',   label: 'Google Pay',      icon: Wallet,       functional: false },
  { id: 'paypal',   label: 'PayPal',          icon: Banknote,     functional: false },
  { id: 'demo',     label: 'Démo',            icon: FlaskConical, functional: true  },
];

function BookingRecapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const villaId     = searchParams.get('villa_id') || '';
  const startDate   = searchParams.get('start_date') || '';
  const endDate     = searchParams.get('end_date') || '';
  const guestsCount = parseInt(searchParams.get('guests_count') || '0');
  const extraIds    = (searchParams.get('extras') || '').split(',').filter(Boolean);
  const totalFromUrl = parseFloat(searchParams.get('total') || '0');

  const [step, setStep]             = useState(0);
  const [villa, setVilla]           = useState<Villa | null>(null);
  const [extras, setExtras]         = useState<Extra[]>([]);
  const [userId, setUserId]         = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [editMode, setEditMode]     = useState(false);

  // Coordonnées
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');

  // Paiement
  const [payMethod, setPayMethod]   = useState<string>('demo');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc]       = useState('');
  const [cardName, setCardName]     = useState('');

  // Booking ref
  const [bookingRef, setBookingRef] = useState('');

  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const nights = calculateNights(startDate, endDate);

  useEffect(() => {
    const supabase = createClient();

    supabase.from('villas').select('*, photos:villa_photos(*)').eq('id', villaId).single()
      .then(({ data }) => { if (data) setVilla(data as Villa); });

    if (extraIds.length > 0) {
      supabase.from('extras').select('*').in('id', extraIds)
        .then(({ data }) => { if (data) setExtras(data as Extra[]); });
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setEmail(user.email || '');
        supabase.from('profiles').select('name, email').eq('id', user.id).single()
          .then(({ data }) => {
            if (data?.name) {
              const parts = data.name.trim().split(' ');
              setFirstName(parts[0] || '');
              setLastName(parts.slice(1).join(' ') || '');
              const complete = !!(parts[0] && parts.slice(1).join(' ') && (data.email || user.email));
              setProfileComplete(complete);
              setEditMode(!complete);
            } else {
              setEditMode(true);
            }
          });
      } else {
        setEditMode(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villaId]);

  // ─── Step 0 : valider coordonnées ────────────────────────────────────────
  const handleNextCoords = () => {
    setError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Prénom, nom et email sont requis.');
      return;
    }
    setStep(1);
  };

  // ─── Step 1 : paiement ───────────────────────────────────────────────────
  const handlePay = async () => {
    setError('');
    if (payMethod !== 'demo') {
      setError('Cette option de paiement n\'est pas disponible en démo. Choisis l\'option Démo.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villa_id: villaId,
          user_id: userId,
          guest_name: `${firstName} ${lastName}`,
          guest_email: email,
          guest_phone: phone,
          start_date: startDate,
          end_date: endDate,
          guests_count: guestsCount,
          extras: extraIds,
          total_estimated: totalFromUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erreur lors de la réservation.'); setLoading(false); return; }
      setBookingRef(data.reference);
      setStep(2);
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    }
    setLoading(false);
  };

  if (!villa) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const heroPhoto = villa.photos?.sort((a, b) => a.sort_order - b.sort_order)[0];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link */}
        <Link href={`/villas/${villa.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-dark mb-8 group transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour à la villa
        </Link>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done ? 'bg-primary text-dark' : active ? 'bg-dark text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${
                    active ? 'text-dark' : done ? 'text-primary-forest' : 'text-gray-400'
                  }`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-16 rounded-full ml-1 ${done ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Colonne gauche : wizard ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

              {/* ══ STEP 0 — Coordonnées ══════════════════════════════════ */}
              {step === 0 && (
                <div>
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary-forest" />
                      </div>
                      <h2 className="text-lg font-bold text-dark">Vos coordonnées</h2>
                    </div>
                    {profileComplete && !editMode && (
                      <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-dark transition-colors">
                        <Pencil className="h-3.5 w-3.5" /> Modifier
                      </button>
                    )}
                  </div>

                  {/* Profil complet → affichage lecture */}
                  {profileComplete && !editMode ? (
                    <div className="space-y-3 mb-7">
                      <div className="bg-gray-50 rounded-2xl px-5 py-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Prénom</p>
                          <p className="font-semibold text-dark">{firstName}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Nom</p>
                          <p className="font-semibold text-dark">{lastName}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Email</p>
                          <p className="font-semibold text-dark">{email}</p>
                        </div>
                        {phone && (
                          <div className="col-span-2">
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Téléphone</p>
                            <p className="font-semibold text-dark">{phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Formulaire éditable */
                    <div className="space-y-4 mb-7">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input id="firstName" label="Prénom *" placeholder="Jean" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <Input id="lastName" label="Nom *" placeholder="Dupont" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                      <Input id="email" label="Email *" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      <Input id="phone" label="Téléphone (optionnel)" type="tel" placeholder="+33 6 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-5">
                      <AlertCircle className="h-4 w-4 shrink-0" />{error}
                    </div>
                  )}

                  <button onClick={handleNextCoords} className="w-full flex items-center justify-center gap-2 py-4 bg-dark text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
                    Continuer <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* ══ STEP 1 — Paiement ════════════════════════════════════ */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary-forest" />
                    </div>
                    <h2 className="text-lg font-bold text-dark">Paiement</h2>
                  </div>

                  {/* Méthodes de paiement */}
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Choisir un moyen de paiement</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon = m.icon;
                      const active = payMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setPayMethod(m.id)}
                          className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border-2 text-sm font-semibold transition-all ${
                            active
                              ? m.id === 'demo'
                                ? 'border-primary bg-primary/10 text-primary-forest'
                                : 'border-dark bg-dark text-white'
                              : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{m.label}</span>
                          {m.id === 'demo' && !active && (
                            <span className="text-[10px] text-primary-forest font-bold -mt-1">Disponible</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Formulaire CB */}
                  {payMethod === 'cb' && (
                    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Numéro de carte</label>
                        <input
                          type="text" maxLength={19} placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-dark/20"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Expiration</label>
                          <input type="text" placeholder="MM / AA" maxLength={7}
                            value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-dark/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">CVC</label>
                          <input type="text" placeholder="123" maxLength={4}
                            value={cardCvc} onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-dark/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nom sur la carte</label>
                        <input type="text" placeholder="JEAN DUPONT"
                          value={cardName} onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-dark/20"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 text-center">💳 Paiement sécurisé — non fonctionnel en mode démo</p>
                    </div>
                  )}

                  {/* Apple Pay */}
                  {payMethod === 'apple' && (
                    <div className="mb-6 p-4 bg-black rounded-2xl flex items-center justify-center">
                      <span className="text-white font-semibold text-sm tracking-wide">🍎 Pay</span>
                      <span className="text-white/40 text-xs ml-4">— non disponible en démo</span>
                    </div>
                  )}

                  {/* Google Pay */}
                  {payMethod === 'google' && (
                    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-2">
                      <span className="font-bold text-sm"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span></span>
                      <span className="font-semibold text-sm text-gray-700">Pay</span>
                      <span className="text-gray-400 text-xs ml-3">— non disponible en démo</span>
                    </div>
                  )}

                  {/* PayPal */}
                  {payMethod === 'paypal' && (
                    <div className="mb-6 p-4 bg-[#003087] rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Pay<span className="text-[#009cde]">Pal</span></span>
                      <span className="text-white/40 text-xs ml-4">— non disponible en démo</span>
                    </div>
                  )}

                  {/* Demo */}
                  {payMethod === 'demo' && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-2xl text-sm text-primary-forest">
                      <p className="font-semibold mb-1">✅ Mode démo activé</p>
                      <p className="text-xs text-primary-forest/70">Le paiement sera validé automatiquement sans débit réel.</p>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-5">
                      <AlertCircle className="h-4 w-4 shrink-0" />{error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => { setError(''); setStep(0); }} className="w-11 h-14 border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
                      <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={handlePay}
                      disabled={loading}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-2xl transition-colors text-sm disabled:opacity-60 ${
                        payMethod === 'demo'
                          ? 'bg-primary-forest text-white hover:bg-[#044039]'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : payMethod === 'demo' ? <>Valider le paiement <ChevronRight className="h-4 w-4" /></> : 'Non disponible en démo'}
                    </button>
                  </div>
                </div>
              )}

              {/* ══ STEP 2 — Confirmation ════════════════════════════════ */}
              {step === 2 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="h-8 w-8 text-primary-forest" />
                  </div>
                  <h2 className="text-2xl font-black text-dark mb-2">Réservation confirmée !</h2>
                  {bookingRef && (
                    <p className="text-sm text-gray-400 mb-2">Référence : <span className="font-bold text-dark">{bookingRef}</span></p>
                  )}
                  <p className="text-gray-400 text-sm mb-8">Un email de confirmation vous a été envoyé à <span className="font-semibold text-dark">{email}</span>.</p>
                  <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 text-sm mb-8">
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Dates</span>
                      <span className="font-semibold">{formatDate(startDate)} → {formatDate(endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center gap-2"><Users className="h-4 w-4" /> Groupe</span>
                      <span className="font-semibold">{guestsCount} personnes</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3 font-black text-base">
                      <span>Total</span>
                      <span>{formatPrice(totalFromUrl)}</span>
                    </div>
                  </div>
                  <Link href="/" className="inline-flex items-center gap-2 py-3.5 px-8 bg-dark text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors text-sm">
                    Retour à l&apos;accueil
                  </Link>
                </div>
              )}

            </div>
          </div>

          {/* ── Colonne droite : résumé ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
              {heroPhoto && (
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5">
                  <Image src={heroPhoto.url} alt={heroPhoto.alt} fill className="object-cover" sizes="300px" />
                </div>
              )}
              <h3 className="font-bold text-dark text-lg mb-4">{villa.title}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{villa.location_label}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{formatDate(startDate)} → {formatDate(endDate)} · {nights} nuit{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Users className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{guestsCount} personne{guestsCount > 1 ? 's' : ''}</span>
                </div>
              </div>
              {extras.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Extras</p>
                  <div className="flex flex-wrap gap-2">
                    {extras.map((extra) => (
                      <span key={extra.id} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">{extra.name}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-base font-bold text-dark">Total estimé</span>
                <span className="text-2xl font-bold text-primary-forest">{formatPrice(totalFromUrl)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

