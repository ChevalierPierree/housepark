'use client';

import dynamic from 'next/dynamic';

const VillaMapDynamic = dynamic(() => import('./VillaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-2xl bg-gray-100 animate-pulse" />
  ),
});

interface VillaMapClientProps {
  latitude: number;
  longitude: number;
  locationLabel: string;
}

export default function VillaMapClient(props: VillaMapClientProps) {
  return <VillaMapDynamic {...props} />;
}
