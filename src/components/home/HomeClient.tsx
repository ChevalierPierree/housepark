'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowRight,
  Waves,
  Dumbbell,
  Music2,
  Users,
  Bed,
  MapPin,
  Check,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import type { Villa } from '@/lib/types';

// ─── Carrousel ────────────────────────────────────────────────────────────────

function VillasCarousel({ villas }: { villas: Villa[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const perPage = 3;
  const total = villas.length;
  const maxIndex = Math.max(0, total - perPage);

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((prev) => Math.min(Math.max(prev + dir, 0), maxIndex));
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div>
      {/* Grille visible */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {villas.slice(index, index + perPage).map((villa, i) => {
              const accent = CARD_ACCENTS[(index + i) % CARD_ACCENTS.length];
              const coverPhoto = villa.photos?.[0];
              const tags = villa.activities.slice(0, 3);

              return (
                <Link key={villa.id} href={`/villas/${villa.slug}`}>
                  <div className="relative bg-gray-900 rounded-3xl overflow-hidden h-[440px] flex flex-col justify-end group cursor-pointer">
                    {coverPhoto ? (
                      <Image
                        src={coverPhoto.url}
                        alt={coverPhoto.alt || villa.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative z-10 p-7">
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 ${accent.light}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-2xl font-black text-white mb-1">{villa.title}</h3>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{villa.location_label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">
                          {villa.capacity_max} pers. max
                        </span>
                        <span className={`text-sm font-semibold ${accent.light}`}>
                          {formatPrice(villa.price_amount, villa.price_type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {total > perPage && (
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Précédent"
            className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            disabled={index >= maxIndex}
            aria-label="Suivant"
            className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="text-gray-600 text-sm ml-2"></span>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
  y = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Bubble({
  text,
  right = false,
  delay = 0,
}: {
  text: string;
  right?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: right ? 20 : -20, scale: 0.92 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex ${right ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[72%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-snug
          ${right
            ? 'bg-primary text-gray-900 rounded-br-sm'
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
          }
        `}
      >
        {text}
      </div>
    </motion.div>
  );
}

function formatPrice(amount: number, type: 'per_night' | 'per_stay') {
  return `${amount.toLocaleString('fr-FR')} €${type === 'per_night' ? ' / nuit' : ' / séjour'}`;
}

const CARD_ACCENTS = [
  { light: 'text-primary' },
  { light: 'text-cyan-400' },
  { light: 'text-violet-400' },
  { light: 'text-orange-400' },
  { light: 'text-rose-400' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomeClient({ villas }: { villas: Villa[] }) {
  return (
    <>
      {/* SCÈNE 1 — LE CHAOS */}
      <section className="relative min-h-screen bg-[#0a0a0a] flex flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-32">
          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.0] tracking-tight">
              Un week-end à 30,
              <br />
              <span className="text-primary">
                Ça ressemble <br />
                à quoi ?
              </span>
            </h1>
          </Reveal>
          <div className="mt-16 space-y-5">
            {[
              { text: 'Airbnb refusé.', delay: 0.2 },
              { text: 'Organisation compliquée.', delay: 0.35 },
              { text: "Pas de place pour tout le monde.", delay: 0.5 },
            ].map(({ text, delay }) => (
              <Reveal key={text} delay={delay} y={20}>
                <p className="text-3xl sm:text-4xl font-bold text-gray-500">{text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.7} y={10}>
            <div className="mt-20 flex items-center gap-4">
              <div className="w-12 h-0.5 bg-gray-700" />
              <p className="text-gray-700 text-xs font-medium tracking-widest uppercase">Scroll</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCÈNE 2 — LA GALÈRE */}
      <section className="relative min-h-screen bg-[#0f0f0f] flex flex-col justify-center overflow-hidden">
        <div className="max-w-lg mx-auto px-6 py-32 w-full">
          <Reveal>
            <p className="text-gray-600 text-xs uppercase tracking-[0.3em] font-semibold mb-12">
              Le groupe WhatsApp
            </p>
          </Reveal>
          <div className="space-y-3">
            <Bubble text="Bon on fait quoi ce week-end ?" delay={0} />
            <Bubble text="Piscine obligatoire 🏊" right delay={0.15} />
            <Bubble text="On est 22 au total là" delay={0.3} />
            <Bubble text="Airbnb refuse au-delà de 16 😭" right delay={0.45} />
            <Bubble text="Qui dort où ?" delay={0.6} />
            <Bubble text="Y'a des voisins à côté ?" right delay={0.75} />
            <Bubble text="On peut faire une soirée quand même ?" delay={0.9} />
            <Bubble text="Ça fait 3 semaines qu'on cherche..." right delay={1.05} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-24 text-center"
          >
            <p className="text-6xl sm:text-8xl font-black text-white tracking-tighter">Stop.</p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-gray-500 text-base sm:text-lg font-light max-w-xs mx-auto leading-relaxed"
            >
              On a la solution
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SCÈNE 3 — LA RÉVÉLATION */}
      <section className="relative min-h-screen bg-primary-forest flex flex-col justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-32">
          <Reveal delay={0.1} y={50}>
            <h2 className="text-7xl sm:text-9xl lg:text-[10rem] font-black text-white leading-none tracking-tighter">
              Housepark.
            </h2>
          </Reveal>
          <div className="mt-16 space-y-4 max-w-2xl">
            {[
              { text: 'Un seul lieu.', delay: 0.2 },
              { text: 'De la place pour tout le monde.', delay: 0.35 },
              { text: 'Tout (vraiment) inclus.', delay: 0.5 },
            ].map(({ text, delay }) => (
              <Reveal key={text} delay={delay} y={20}>
                <p className="text-2xl sm:text-3xl font-semibold text-primary/90 leading-snug">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee transitionnel */}
      <div className="bg-primary-forest overflow-hidden py-5 border-y border-primary/20">
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {Array.from({ length: 2 }).map((_, idx) => (
            <span key={idx} className="flex items-center gap-8 pr-8">
              {[
                'Piscine intérieure',
                'Padel privé',
                'Basket',
                'Toulouse',
                'Sono & Lights',
                "Jusqu'à 45 pers.",
                'Zéro voisin',
                'Fêtes autorisées',
                'Bordeaux',
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-3 text-sm font-bold text-white/70 tracking-wide uppercase"
                >
                  <span className="w-1 h-1 bg-primary rounded-full shrink-0" />
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CONCEPT */}
      <section className="bg-white py-28 sm:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <Reveal>
            <p className="text-xs text-gray-400 uppercase tracking-[0.3em] font-semibold mb-5">Le concept</p>
            <h2 className="text-4xl sm:text-6xl font-black text-dark leading-tight max-w-3xl">
              Tout ce dont vous avez besoin.
              <br />
              <span className="text-primary">Au même endroit.</span>
            </h2>
            <p className="mt-6 text-gray-500 text-lg font-light max-w-xl leading-relaxed">
              Une villa privée entière, avec toutes les activités déjà là. <br>
              </br>Piscine, padel, sono,
              chambres pour chacun. <br>
              </br>Vous n&apos;avez qu&apos;à poser vos bagages.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Bed, label: 'Hébergement', sub: 'Chambres pour chacun' },
              { icon: Waves, label: 'Piscine', sub: 'Int. & ext.' },
              { icon: Dumbbell, label: 'Sport', sub: 'Padel, Basket...' },
              { icon: Music2, label: 'Soirée', sub: 'Sono, Lights, TV' },
              { icon: Users, label: "Jusqu'à 45 pers.", sub: "C'est laaarge" },
              { icon: Sparkles, label: 'Tout inclus', sub: 'Zéro galère' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <div className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-primary-forest/5 transition-colors cursor-default">
                  <Icon className="h-6 w-6 text-primary-forest" />
                  <div>
                    <p className="text-sm font-bold text-dark">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NOS VILLAS */}
      <section className="bg-[#0a0a0a] py-28 sm:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between mb-12">
            <Reveal>
              <p className="text-xs text-gray-600 uppercase tracking-[0.3em] font-semibold mb-4">
                Nos villas
              </p>
              <h2 className="text-4xl sm:text-6xl font-black text-white leading-none">
                Choisis le décor.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/villas"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
              >
                Voir toutes les villas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {/* Carrousel */}
          <VillasCarousel villas={villas} />

          <Reveal delay={0.3} className="mt-10 sm:hidden">
            <Link
              href="/villas"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
            >
              Voir toutes les villas
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* HOUSEPARK VS AIRBNB */}
      <section className="bg-[#0c0c0c] py-28 sm:py-36 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <Reveal>
            <p className="text-xs text-gray-600 uppercase tracking-[0.3em] font-semibold mb-5">
              Soyons honnêtes
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-16">
              Pourquoi pas Airbnb ?
              <br />
              <span className="text-gray-600">Bonne question.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl overflow-hidden border border-gray-800">
              <div className="grid grid-cols-3 bg-gray-900">
                <div className="p-5 col-span-1" />
                <div className="p-5 text-center border-l border-gray-800">
                  <p className="text-sm font-bold text-gray-500">Airbnb classique</p>
                </div>
                <div className="p-5 text-center border-l border-primary-forest/40 bg-primary-forest/10">
                  <p className="text-sm font-bold text-primary">Housepark</p>
                </div>
              </div>
              {[
                { criteria: 'Grands groupes (+20)', airbnb: false, hp: true },
                { criteria: 'Fêtes & soirées OK', airbnb: false, hp: true },
                { criteria: 'Activités sur place', airbnb: false, hp: true },
                { criteria: 'Zéro voisin', airbnb: false, hp: true },
                { criteria: 'Chambre pour chacun', airbnb: '...parfois', hp: true },
              ].map(({ criteria, airbnb, hp }, i) => (
                <div
                  key={criteria}
                  className={`grid grid-cols-3 border-t border-gray-800 ${i % 2 === 0 ? 'bg-black/20' : ''}`}
                >
                  <div className="p-5">
                    <p className="text-sm text-gray-400 font-medium">{criteria}</p>
                  </div>
                  <div className="p-5 flex justify-center items-center border-l border-gray-800">
                    {airbnb === false ? (
                      <X className="h-4 w-4 text-gray-700" />
                    ) : (
                      <span className="text-xs text-gray-600 font-medium">{airbnb}</span>
                    )}
                  </div>
                  <div className="p-5 flex justify-center items-center border-l border-primary-forest/40 bg-primary-forest/5">
                    {hp === true ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-xs text-primary font-medium">{hp}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-primary-forest py-28 sm:py-36 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <Reveal>
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter">
              C&apos;est pour quand ?
              <br />
            </h2>
          </Reveal>
          <Reveal delay={0.4} y={15}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/villas"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-primary-forest font-bold rounded-xl hover:bg-primary/20 hover:text-white transition-all duration-200 text-base"
              >
                Voir les villas
                <ArrowRight className="h-4 w-4" />
              </Link>
          </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
