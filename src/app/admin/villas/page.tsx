import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import type { Villa } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Villas – Admin Housespark',
};

export default async function AdminVillasPage() {
  const supabase = await createClient();

  const { data: villas } = await supabase
    .from('villas')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Villas</h1>
          <p className="text-gray-500 mt-1">
            {(villas || []).length} villa{(villas || []).length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/villas/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-gray-900 font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle villa
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Villa</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Localisation</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Capacité</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Prix</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(villas as Villa[])?.map((villa) => (
              <tr key={villa.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-dark">{villa.title}</p>
                  <p className="text-xs text-gray-400">/{villa.slug}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                  {villa.location_label}
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                  {villa.capacity_min}–{villa.capacity_max}
                </td>
                <td className="px-4 py-3 font-medium text-dark">
                  {formatPrice(villa.price_amount)}
                  <span className="text-gray-400 text-xs ml-1">
                    {villa.price_type === 'per_night' ? '/nuit' : '/séjour'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {villa.published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/15 text-primary-text text-xs font-medium rounded-full">
                      <Eye className="h-3 w-3" /> Publiée
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                      <EyeOff className="h-3 w-3" /> Brouillon
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/villas/${villa.id}`}
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!villas || villas.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            Aucune villa. Créez-en une !
          </div>
        )}
      </div>
    </div>
  );
}
