import type { MenuItem } from '@/lib/types'

export const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Espace Rencontres', path: '/espace-rencontres' },
  { label: 'À propos', path: '/a-propos' },
  { label: 'Durabilité', path: '/durabilite' },
  { label: 'Galerie', path: '/galerie' },
  { label: 'Réservation', path: '/reservation' },
  { label: 'Contact', path: '/contact' },
]

export const menuCategories = [
  'Boissons Chaudes',
  'Boissons Fraîches',
  'Petit Déjeuner',
  'Plats Légers',
  'Spécialités Marocaines',
  'Desserts',
] as const

export const sampleMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Thé à la Menthe',
    description: 'Thé vert infusé à la menthe fraîche et sucre.',
    price_mad: 25,
    category: 'Boissons Chaudes',
    is_available: true,
  },
  {
    id: '2',
    name: 'Espresso',
    description: 'Café serré arabica, service rapide.',
    price_mad: 30,
    category: 'Boissons Chaudes',
    is_available: true,
  },
  {
    id: '3',
    name: 'Jus d’Orange Pressé',
    description: 'Orange locale pressée minute.',
    price_mad: 28,
    category: 'Boissons Fraîches',
    is_available: true,
  },
  {
    id: '4',
    name: 'Shakshuka',
    description: 'Œufs mijotés à la tomate, poivron et cumin.',
    price_mad: 65,
    category: 'Petit Déjeuner',
    is_available: true,
  },
  {
    id: '5',
    name: 'Salade Méditerranéenne',
    description: 'Légumes croquants, huile d’olive et citron.',
    price_mad: 58,
    category: 'Plats Légers',
    is_available: true,
  },
  {
    id: '6',
    name: 'Harira',
    description: 'Soupe marocaine traditionnelle aux légumineuses.',
    price_mad: 45,
    category: 'Spécialités Marocaines',
    is_available: true,
  },
  {
    id: '7',
    name: 'Chebakia',
    description: 'Pâtisserie marocaine au miel et sésame.',
    price_mad: 35,
    category: 'Desserts',
    is_available: true,
  },
]

export const sampleGallery = [
  {
    id: '1',
    title: 'Terrasse lumineuse',
    image_url:
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80',
    alt_text: 'Terrasse du café avec fauteuils en rotin',
  },
  {
    id: '2',
    title: 'Coin rencontres',
    image_url:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80',
    alt_text: 'Espace calme pour réunions et ateliers',
  },
  {
    id: '3',
    title: 'Service brunch',
    image_url:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80',
    alt_text: 'Petit déjeuner marocain servi sur table en bois',
  },
]
