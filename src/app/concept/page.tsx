import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Users,
  Waves,
  Volume2,
  TreePine,
  Dumbbell,
  Zap,
  X,
  Check,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Le concept – Housespark',
  description:
    'Un seul lieu pour tout ton groupe. Fêtes autorisées. Zéro voisin. Entre Bordeaux et Toulouse.',
};

export default function ConceptPage() {
  return (
    <>
      {/* HERO */}
      <section className="section-breathing bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-6">
            Le concept
          </p>
          <h1 className="text-statement text-dark max-w-3xl">
            Tu veux organiser un week-end avec ton groupe ?
            <span className="text-primary"> On a créé <span className="text-primary">Housespark</span> pour ça.</span>
          </h1>
          <p className="mt-8 text-xl text-gray-500 max-w-2xl leading-relaxed">
            Un lieu entre Bordeaux et Toulouse. Jusqu&apos;à 45 personnes. 
            Piscine, padel, basket, sono, lights. Fêtes autorisées. 
            Zéro voisin. Tu réserves, tu profites.
          </p>
        </div>
      </section>

      {/* FULL-WIDTH IMAGE */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
          alt="Vue aérienne du domaine Housespark"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-mega text-white text-center px-4">
            Pas un hôtel.
            <br />
            Pas un Airbnb.
          </h2>
        </div>
      </section>

      {/* HOUSEPARK VS AIRBNB */}
      <section className="bg-[#0c0c0c] py-28 sm:py-36 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-xs text-gray-600 uppercase tracking-[0.3em] font-semibold mb-5">
            Soyons honnêtes
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-16">
            Pourquoi pas Airbnb ?<br />
            <span className="text-gray-600">Bonne question.</span>
          </h2>

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
                    <span className="text-xs text-gray-600 font-medium">{airbnb as string}</span>
                  )}
                </div>
                <div className="p-5 flex justify-center items-center border-l border-primary-forest/40 bg-primary-forest/5">
                  {hp === true ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-xs text-primary font-medium">{String(hp)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="section-breathing bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-6">
            Comment ça marche
          </p>
          <h2 className="text-statement text-dark mb-16">
            3 étapes. C&apos;est tout.
          </h2>

          <div className="space-y-16">
            {[
              {
                step: '01',
                title: 'Tu choisis ton lieu',
                desc: 'Parcours nos espaces, regarde les photos, vérifie la capacité. Tu trouves celui qui te plaît.',
                icon: <Zap className="h-6 w-6 text-primary" />,
              },
              {
                step: '02',
                title: 'Tu personnalises',
                desc: 'Ajoute des extras si tu veux : chef privé, DJ, paintball, karting… Ou garde ça simple. C\'est ton week-end.',
                icon: <Users className="h-6 w-6 text-primary" />,
              },
              {
                step: '03',
                title: 'Tu profites',
                desc: 'On s\'occupe de tout le reste. Tu débarques avec tes potes, tout est prêt. Il ne reste qu\'à vivre le moment.',
                icon: <Volume2 className="h-6 w-6 text-primary" />,
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start">
                <div className="shrink-0">
                  <span className="text-7xl font-black text-gray-200 leading-none">{item.step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-dark mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="section-breathing bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-6">
            Ce qui nous rend différent
          </p>
          <h2 className="text-statement text-dark mb-16">
            Pas de compromis.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Users className="h-7 w-7" />,
                title: 'Jusqu\'à 45 personnes',
                desc: 'Tout le monde a un vrai lit. Pas de matelas gonflable, pas de canapé-lit douteux.',
              },
              {
                icon: <Waves className="h-7 w-7" />,
                title: 'Piscine intérieure + extérieure',
                desc: 'Été comme hiver, tu te baignes. Point.',
              },
              {
                icon: <Dumbbell className="h-7 w-7" />,
                title: 'Padel & Basket',
                desc: 'Courts privés sur place. Organise un tournoi, challenge tes potes.',
              },
              {
                icon: <Volume2 className="h-7 w-7" />,
                title: 'Sono & Lights',
                desc: 'Matériel pro. Monte le son autant que tu veux. Personne pour se plaindre.',
              },
              {
                icon: <TreePine className="h-7 w-7" />,
                title: 'Zéro voisin',
                desc: 'En pleine campagne, entre Bordeaux et Toulouse. La liberté totale.',
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: 'Fêtes autorisées',
                desc: 'C\'est littéralement fait pour ça. Anniversaires, EVG/EVJF, retrouvailles, semaines entre potes.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="text-primary mb-5">{item.icon}</div>
                <h3 className="text-lg font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-mega text-white">
            Convaincu ?
          </h2>
          <p className="mt-6 text-xl text-white/40 font-light">
            Il ne reste plus qu&apos;à choisir la date.
          </p>
          <Link
            href="/villas"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-primary text-gray-900 font-bold rounded-xl hover:bg-primary-dark transition-colors text-lg"
          >
            Voir les lieux
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
