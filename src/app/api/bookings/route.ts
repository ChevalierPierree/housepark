import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      villa_id,
      user_id,
      guest_name,
      guest_email,
      guest_phone,
      start_date,
      end_date,
      guests_count,
      extras,
      total_estimated,
    } = body;

    // Validation
    if (!villa_id || !start_date || !end_date || !guests_count || !guest_name || !guest_email) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants.' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end <= start) {
      return NextResponse.json(
        { error: 'La date de départ doit être après la date d\'arrivée.' },
        { status: 400 }
      );
    }

    // Check villa exists and capacity
    const { data: villa } = await supabaseAdmin
      .from('villas')
      .select('id, title, capacity_max, location_label')
      .eq('id', villa_id)
      .single();

    if (!villa) {
      return NextResponse.json(
        { error: 'Villa introuvable.' },
        { status: 404 }
      );
    }

    if (guests_count > villa.capacity_max) {
      return NextResponse.json(
        { error: `Capacité maximale dépassée (${villa.capacity_max} pers.).` },
        { status: 400 }
      );
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        villa_id,
        user_id: user_id || null,
        guest_name,
        guest_email,
        guest_phone: guest_phone || '',
        start_date,
        end_date,
        guests_count,
        total_estimated: total_estimated || 0,
        status: 'pending_test',
      })
      .select('id, reference')
      .single();

    if (bookingError) {
      console.error('Booking insert error:', bookingError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la réservation.' },
        { status: 500 }
      );
    }

    // Insert booking extras
    if (extras && extras.length > 0) {
      const { data: extrasData } = await supabaseAdmin
        .from('extras')
        .select('id, price_amount, pricing_type')
        .in('id', extras);

      if (extrasData) {
        const bookingExtras = extrasData.map((extra) => ({
          booking_id: booking.id,
          extra_id: extra.id,
          quantity: 1,
          price_at_booking:
            extra.pricing_type === 'per_person'
              ? extra.price_amount * guests_count
              : extra.price_amount,
        }));

        await supabaseAdmin.from('booking_extras').insert(bookingExtras);
      }
    }

    // Send confirmation email via Resend
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key') {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const nights = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        await resend.emails.send({
          from: 'Housespark <onboarding@resend.dev>',
          to: guest_email,
          subject: `Confirmation de réservation – ${booking.reference}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #FF385C;">Housespark</h1>
              <h2>Merci pour votre réservation !</h2>
              <p>Bonjour ${guest_name},</p>
              <p>Votre demande de réservation a bien été enregistrée. Voici le récapitulatif :</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p><strong>Référence :</strong> ${booking.reference}</p>
                <p><strong>Villa :</strong> ${villa.title}</p>
                <p><strong>Lieu :</strong> ${villa.location_label}</p>
                <p><strong>Dates :</strong> ${start_date} → ${end_date} (${nights} nuit${nights > 1 ? 's' : ''})</p>
                <p><strong>Personnes :</strong> ${guests_count}</p>
                <p><strong>Total estimé :</strong> ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total_estimated || 0)}</p>
              </div>
              <p style="color: #717171; font-size: 14px;">
                Ceci est une réservation test. Aucun paiement n'a été débité.
              </p>
              <p>À bientôt,<br/>L'équipe Housespark</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      id: booking.id,
      reference: booking.reference,
    });
  } catch (err) {
    console.error('Booking API error:', err);
    return NextResponse.json(
      { error: 'Erreur interne.' },
      { status: 500 }
    );
  }
}
