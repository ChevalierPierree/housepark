import { createClient } from '@/lib/supabase/server';
import { formatDate, formatPrice } from '@/lib/utils';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réservations – Admin Housespark',
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, villa:villas(title, location_label)')
    .order('created_at', { ascending: false });

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending_test: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    confirmed_test: { label: 'Confirmée', color: 'bg-primary/15 text-primary-text' },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Réservations</h1>
        <p className="text-gray-500 mt-1">
          {(bookings || []).length} réservation
          {(bookings || []).length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Référence
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Villa
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">
                  Client
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">
                  Dates
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">
                  Pers.
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Total
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings?.map((booking: any) => {
                const status =
                  statusLabels[booking.status] || statusLabels.pending_test;
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-medium text-dark text-xs">
                        {booking.reference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark">
                        {booking.villa?.title || '-'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {booking.villa?.location_label}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-dark">{booking.guest_name}</p>
                      <p className="text-xs text-gray-400">
                        {booking.guest_email}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {formatDate(booking.start_date)} →{' '}
                        {formatDate(booking.end_date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {booking.guests_count}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-dark">
                      {formatPrice(booking.total_estimated)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(!bookings || bookings.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            Aucune réservation.
          </div>
        )}
      </div>
    </div>
  );
}
