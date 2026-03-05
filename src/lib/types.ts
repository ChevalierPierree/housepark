export type Villa = {
  id: string;
  title: string;
  slug: string;
  location_label: string;
  description: string;
  capacity_min: number;
  capacity_max: number;
  price_type: 'per_night' | 'per_stay';
  price_amount: number;
  activities: string[];
  equipments: string[];
  published: boolean;
  available: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  photos?: VillaPhoto[];
  villa_extras?: { extra_id: string; extras?: Extra }[];
};

export type VillaPhoto = {
  id: string;
  villa_id: string;
  url: string;
  alt: string;
  sort_order: number;
};

export type Extra = {
  id: string;
  name: string;
  description: string;
  pricing_type: 'fixed' | 'per_person';
  price_amount: number;
};

export type Booking = {
  id: string;
  reference: string;
  user_id: string | null;
  villa_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  start_date: string;
  end_date: string;
  guests_count: number;
  total_estimated: number;
  status: 'pending_test' | 'confirmed_test' | 'cancelled';
  created_at: string;
  villa?: Villa;
  booking_extras?: BookingExtra[];
};

export type BookingExtra = {
  booking_id: string;
  extra_id: string;
  quantity: number;
  price_at_booking: number;
  extras?: Extra;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
};
