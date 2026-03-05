import Link from 'next/link';
import {
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Music,
  Target,
  Bike,
  Wine,
  TreePine,
  Volleyball,
  Volume2,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activités – Housespark',
  description: 'Padel, basket, piscines, sono, chef privé, DJ… Tout ce qui t\'attend chez Housespark.',
};

const activities = [
  {
    icon: <Waves className="h-7 w-7" />,
    title: 'Piscine intérieure + extérieure',
    description:
      'Été comme hiver. Chauffée en intérieur. Parfaite pour les after ou les matinées tranquilles.',
    highlight: true,
  },
  {
    icon: <Dumbbell className="h-7 w-7" />,
    title: 'Padel',
    description:
      'Court privé sur place. Organise ton tournoi, challenge tes potes. Raquettes fournies.',
    highlight: true,
  },
  {
    icon: <Volleyball className="h-7 w-7" />,
    title: 'Basket',
    description:
      'Terrain sur place. 3v3 ou 5v5, à toi de voir. Le soir aussi, c\'est éclairé.',
    highlight: true,
  },
  {
    icon: <Volume2 className="h-7 w-7" />,
    title: 'Sono & Lights',
    description:
      'Système son pro + jeux de lumières. Monte le volume, personne ne dira rien. Zéro voisin.',
    highlight: true,
  },
  {
    icon: <Music className="h-7 w-7" />,
    title: 'DJ',
    description:
      'DJ professionnel disponible en extra. Ou ramène ta playlist — la sono est là.',
    highlight: false,
  },
  {
    icon: <UtensilsCrossed className="h-7 w-7" />,
    title: 'Chef privé',
    description:
      'Un chef prépare tout pour ton groupe. Du brunch au dîner gastronomique. Tu choisis.',
    highlight: false,
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: 'Paintball',
    description:
      'Terrain disponible, tout le matériel fourni. Parfait pour le team building entre potes.',
    highlight: false,
  },
  {
    icon: <Gamepad2 className="h-7 w-7" />,
    title: 'Karting',
    description:
      'Session karting organisée à proximité. Course, chrono et podium obligatoire.',
    highlight: false,
  },
  {
    icon: <Bike className="h-7 w-7" />,
    title: 'Vélo / VTT',
    description:
      'La campagne autour est magnifique. Vélos disponibles pour explorer les alentours.',
    highlight: false,
  },
  {
    icon: <Wine className="h-7 w-7" />,
    title: 'Dégustation vin',
    description:
      'On est entre Bordeaux et Toulouse. Les vignobles sont à côté. Visite et dégustation organisées.',
    highlight: false,
  },
  {
    icon: <TreePine className="h-7 w-7" />,
    title: 'Yoga & Bien-être',
    description:
      'Session yoga au bord de la piscine. Ou dans le jardin. Pour ceux qui veulent souffler.',
    highlight: false,
  },
  {
    icon: <UtensilsCrossed className="h-7 w-7" />,
    title: 'Barbecue géant',
    description:
      'Grand barbecue sur place. Plancha, grillades, ambiance feu de camp. Le classique.',
    highlight: false,
  },
];

export default function ActivitesPage() {
  return (
    <>
      <section className="section-breathing bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              Sur place
            </p>
            <h1 className="text-statement text-dark">
              Tout ce qu&apos;il faut pour un week-end parfait.
            </h1>
            <p className="mt-6 text-xl text-gray-500 leading-relaxed">
              Piscines, sports, fête, détente — on a pensé à tout.
              Certaines activités sont incluses, d&apos;autres disponibles en extra.
            </p>
          </div>

          {/* Highlight grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {activities.filter(a => a.highlight).map((activity) => (
              <div
                key={activity.title}
                className="p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors duration-300"
              >
                <div className="text-primary mb-4">
                  {activity.icon}
                </div>
                <h3 className="text-base font-bold text-dark mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>

          {/* All activities */}
          <h2 className="text-2xl font-bold text-dark mb-8">Toutes les activités</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.filter(a => !a.highlight).map((activity) => (
              <div
                key={activity.title}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="text-gray-400 mb-4">
                  {activity.icon}
                </div>
                <h3 className="text-base font-bold text-dark mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Envie d&apos;essayer ?
          </h2>
          <p className="mt-4 text-white/40 text-lg">
            Réserve ton week-end et profite de tout ça.
          </p>
          <Link
            href="/villas"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary text-gray-900 font-bold rounded-xl hover:bg-primary-dark transition-colors text-lg"
          >
            Choisir mon lieu
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
