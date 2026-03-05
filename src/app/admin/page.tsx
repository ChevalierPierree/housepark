import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Home,
  Building,
  Sparkles,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration – Housespark',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [villasRes, extrasRes, bookingsRes] = await Promise.all([
    supabase.from('villas').select('id', { count: 'exact', head: true }),
    supabase.from('extras').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      label: 'Villas',
      count: villasRes.count || 0,
      icon: <Building className="h-6 w-6" />,
      href: '/admin/villas',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Extras',
      count: extrasRes.count || 0,
      icon: <Sparkles className="h-6 w-6" />,
      href: '/admin/extras',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Réservations',
      count: bookingsRes.count || 0,
      icon: <CalendarDays className="h-6 w-6" />,
      href: '/admin/bookings',
      color: 'bg-primary/10 text-primary-text',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="text-gray-400 hover:text-dark transition-colors"
        >
          <Home className="h-5 w-5" />
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-dark">Administration</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stat.count}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/villas"
          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
        >
          <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="font-medium text-dark">Gérer les villas</p>
        </Link>
        <Link
          href="/admin/extras"
          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
        >
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="font-medium text-dark">Gérer les extras</p>
        </Link>
        <Link
          href="/admin/bookings"
          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
        >
          <CalendarDays className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="font-medium text-dark">Voir les réservations</p>
        </Link>
      </div>
    </div>
  );
}
