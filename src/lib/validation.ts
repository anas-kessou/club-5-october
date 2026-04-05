import { z } from 'zod'

export const reservationSchema = z
  .object({
    full_name: z.string().min(3, 'Nom requis (min 3 caractères).'),
    email: z.string().email('Adresse email invalide.'),
    phone: z.string().min(8, 'Téléphone invalide.'),
    reservation_date: z.string().min(1, 'Date requise.'),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure de début invalide.'),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure de fin invalide.'),
    guests: z.number().min(8).max(20),
    notes: z.string().max(300).optional().or(z.literal('')),
    language: z.enum(['fr', 'ar']),
  })
  .refine((value) => value.start_time < value.end_time, {
    message: 'L’heure de fin doit être après l’heure de début.',
    path: ['end_time'],
  })

export const menuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.enum([
    'Boissons Chaudes',
    'Boissons Fraîches',
    'Petit Déjeuner',
    'Plats Légers',
    'Spécialités Marocaines',
    'Desserts',
  ]),
  price_mad: z.number().min(5),
  is_available: z.boolean(),
  image_url: z.string().url().optional().or(z.literal('')),
})

export const gallerySchema = z.object({
  title: z.string().min(2),
  alt_text: z.string().optional().or(z.literal('')),
})

export type ReservationFormValues = z.infer<typeof reservationSchema>
export type MenuItemFormValues = z.infer<typeof menuItemSchema>
export type GalleryFormValues = z.infer<typeof gallerySchema>
