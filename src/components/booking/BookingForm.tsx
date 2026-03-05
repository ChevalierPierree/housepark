'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Users, Check, ChevronRight, ChevronLeft, Minus, Plus, LogIn, UserPlus } from 'lucide-react';
import { formatPrice, calculateNights } from '@/lib/utils';
import BookingCalendar, { dateToISO } from '@/components/ui/BookingCalendar';
import { createClient } from '@/lib/supabase/client';
import type { Villa, Extra } from '@/lib/types';

const STEPS = ['Dates', 'Groupe', 'Extras', 'Réservation'];

interface BookingFormProps {
  villa: Villa;
  extras: Extra[];
}

export default function BookingForm({ villa, extras }: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(villa.capacity_min || 2);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  const startDate = checkInDate ? dateToISO(checkInDate) : '';
  const endDate = checkOutDate ? dateToISO(checkOutDate) : '';

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return calculateNights(startDate, endDate);
  }, [startDate, endDate]);

  const villaPrice = villa.price_type === 'per_night'
    ? villa.price_amount * Math.max(nights, 0)
    : villa.price_amount;

  const extrasPrice = selectedExtras.reduce((sum, id) => {
    const extra = extras.find((e) => e.id === id);
    if (!extra) return sum;
    return sum + (extra.pricing_type === 'per_person'
      ? extra.price_amount * Math.max(guests, 1)
      : extra.price_amount);
  }, 0);

  const total = villaPrice + extrasPrice;

  const toggleExtra = (id: string) =>
    setSelectedExtras((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!startDate || !endDate) { setError('Choisis tes dates.'); return; }
      if (nights <= 0) { setError('La date de départ doit être après l\'arrivée.'); return; }
    }
    if (step === 1) {
      if (guests > villa.capacity_max) { setError(`Max ${villa.capacity_max} personnes.`); return; }
    }
    // Skip extras step if no extras available
    if (step === 1 && extras.length === 0) { setStep(3); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    const params = new URLSearchParams({
      villa_id: villa.id,
      start_date: startDate,
      end_date: endDate,
      guests_count: String(guests),
      extras: selectedExtras.join(','),
      total: String(total),
    });
    router.push(`/booking/recap?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      {/* Price header */}
      <div className="px-7 pt-7 pb-5 border-b border-gray-100">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-dark">{formatPrice(villa.price_amount)}</span>
            <span className="text-gray-400 ml-1 text-sm">
              {villa.price_type === 'per_night' ? '/ nuit' : '/ séjour'}
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {villa.capacity_min}–{villa.capacity_max} pers.
          </span>
        </div>

        {/* Step progress — cercles numérotés uniquement */}
        <div className="flex items-center w-full mt-5">
          {STEPS.map((_, i) => {
            const done = i < step;
            const active = i === step;
            if (i === 2 && extras.length === 0) return null;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 shrink-0 ${
                  done ? 'bg-primary-forest text-white' :
                  active ? 'bg-dark text-white scale-110' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && !(extras.length === 0 && i === 1) && (
                  <div className="flex-1 h-px bg-gray-200 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="px-7 py-6 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* STEP 0 — Dates */}
            {step === 0 && (
              <div>
                <h3 className="text-base font-black text-dark mb-5">Quand vous arrivez ?</h3>
                <BookingCalendar
                  checkIn={checkInDate}
                  checkOut={checkOutDate}
                  onChange={(ci, co) => { setCheckInDate(ci); setCheckOutDate(co); }}
                />
                {nights > 0 && (
                  <p className="mt-4 text-sm font-semibold text-primary-forest text-center">
                    {nights} nuit{nights > 1 ? 's' : ''} — {formatPrice(villaPrice)}
                  </p>
                )}
              </div>
            )}

            {/* STEP 1 — Guests */}
            {step === 1 && (
              <div>
                <h3 className="text-base font-black text-dark mb-2">Vous êtes combien ?</h3>
                <p className="text-xs text-gray-400 mb-6">Max {villa.capacity_max} personnes</p>
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                  <button
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-gray-300 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-black text-dark">{guests}</span>
                    <p className="text-xs text-gray-400 mt-1">personne{guests > 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => setGuests((g) => Math.min(villa.capacity_max, g + 1))}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-gray-300 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="mt-4 bg-gray-50 rounded-xl px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Capacité</span>
                  <div className="flex gap-1">
                    {Array.from({ length: villa.capacity_max }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-4 rounded-full transition-colors duration-200 ${i < guests ? 'bg-primary-forest' : 'bg-gray-200'}`} />
                    )).slice(0, Math.min(villa.capacity_max, 20))}
                    {villa.capacity_max > 20 && <span className="text-[10px] text-gray-400 self-end">+{villa.capacity_max - 20}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 — Extras */}
            {step === 2 && extras.length > 0 && (
              <div>
                <h3 className="text-base font-black text-dark mb-1">Des extras ?</h3>
                <p className="text-xs text-gray-400 mb-5">Tout optionnel. Tu peux skipper.</p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {extras.map((extra) => {
                    const isOn = selectedExtras.includes(extra.id);
                    return (
                      <label key={extra.id} className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${isOn ? 'bg-primary-forest/5 border-primary-forest/20' : 'border-transparent hover:bg-gray-50'}`}>
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${isOn ? 'bg-primary-forest border-primary-forest' : 'border-gray-200'}`}>
                          {isOn && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input type="checkbox" checked={isOn} onChange={() => toggleExtra(extra.id)} className="sr-only" />
                        <span className="flex-1 text-sm font-medium text-dark">{extra.name}</span>
                        <span className="text-sm font-bold text-gray-500">
                          {formatPrice(extra.price_amount)}{extra.pricing_type === 'per_person' ? '/p.' : ''}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3 — Récap */}
            {step === 3 && (
              <div>
                <h3 className="text-base font-black text-dark mb-5">C&apos;est parti ?</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400 flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" /> Dates</span>
                    <span className="font-semibold text-dark">{new Date(startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → {new Date(endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400 flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Groupe</span>
                    <span className="font-semibold text-dark">{guests} personnes</span>
                  </div>
                  {nights > 0 && villa.price_type === 'per_night' && (
                    <div className="flex justify-between py-2 border-b border-gray-50 text-gray-400">
                      <span>{nights} nuit{nights > 1 ? 's' : ''} × {formatPrice(villa.price_amount)}</span>
                      <span className="font-medium text-dark">{formatPrice(villaPrice)}</span>
                    </div>
                  )}
                  {extrasPrice > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-50 text-gray-400">
                      <span>Extras</span>
                      <span className="font-medium text-dark">{formatPrice(extrasPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 font-black text-dark text-base">
                    <span>Total estimé</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-red-500 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-7 pb-7 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => { setError(''); setStep((s) => s - 1); }}
            className="w-11 h-11 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-dark text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
          >
            Continuer <ChevronRight className="h-4 w-4" />
          </button>
        ) : step === 3 && isLoggedIn === false ? (
          // Non connecté — invitation à se connecter
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-xs text-gray-400 text-center mb-1">Connecte-toi pour finaliser ta réservation</p>
            <button
              onClick={() => router.push(`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-dark text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
            >
              <LogIn className="h-4 w-4" /> Se connecter
            </button>
            <button
              onClick={() => router.push(`/register?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              <UserPlus className="h-4 w-4" /> Créer un compte
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoggedIn === null}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-forest text-white font-bold rounded-xl hover:bg-[#044039] transition-colors text-sm disabled:opacity-60"
          >
            Réserver <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>


    </div>
  );
}

