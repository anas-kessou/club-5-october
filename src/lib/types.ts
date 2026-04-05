export type Language = 'fr' | 'ar'

export type MenuCategory =
  | 'Boissons Chaudes'
  | 'Boissons Fraîches'
  | 'Petit Déjeuner'
  | 'Plats Légers'
  | 'Spécialités Marocaines'
  | 'Desserts'

export interface MenuItem {
  id: string
  name: string
  description: string
  price_mad: number
  category: MenuCategory
  is_available: boolean
  image_url?: string | null
}

export interface Reservation {
  id: string
  full_name: string
  email: string
  phone: string
  reservation_date: string
  start_time: string
  end_time: string
  guests: number
  notes?: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  language: Language
}

export interface GalleryImage {
  id: string
  title: string
  image_url: string
  alt_text?: string | null
  uploaded_by?: string | null
  created_at?: string
}

export interface SupabaseEnv {
  url: string
  anonKey: string
}
