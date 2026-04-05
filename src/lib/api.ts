import { sampleGallery, sampleMenu } from '@/lib/content'
import { canUseDemoData, supabase, supabaseConfigError } from '@/lib/supabase'
import type { GalleryImage, MenuItem, Reservation } from '@/lib/types'

function resolveClientState() {
  if (supabase) {
    return { client: supabase, isDemo: false as const }
  }

  if (canUseDemoData) {
    return { client: null, isDemo: true as const }
  }

  throw new Error(supabaseConfigError ?? 'Supabase is not configured.')
}

export async function fetchMenuItems() {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return sampleMenu
  }

  const { data, error } = await client.from('menu_items').select('*').order('category').order('name')
  if (error) throw error
  return (data as MenuItem[]) ?? []
}

export async function createMenuItem(item: Omit<MenuItem, 'id'>) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return { ...item, id: crypto.randomUUID() }
  }

  const { data, error } = await client.from('menu_items').insert(item).select().single()
  if (error) throw error
  return data as MenuItem
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return { id, ...item } as MenuItem
  }

  const { data, error } = await client.from('menu_items').update(item).eq('id', id).select().single()
  if (error) throw error
  return data as MenuItem
}

export async function deleteMenuItem(id: string) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return
  }

  const { error } = await client.from('menu_items').delete().eq('id', id)
  if (error) throw error
}

export async function fetchGalleryImages() {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return sampleGallery as GalleryImage[]
  }

  const { data, error } = await client.from('gallery_images').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data as GalleryImage[]) ?? []
}

export async function createGalleryImage(image: Omit<GalleryImage, 'id'>) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return { ...image, id: crypto.randomUUID() }
  }

  const { data, error } = await client.from('gallery_images').insert(image).select().single()
  if (error) throw error
  return data as GalleryImage
}

export async function deleteGalleryImage(id: string) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return
  }

  const { error } = await client.from('gallery_images').delete().eq('id', id)
  if (error) throw error
}

function intersectsRange(existingStart: string, existingEnd: string, start: string, end: string) {
  return existingStart < end && start < existingEnd
}

export async function checkReservationAvailability(date: string, start: string, end: string) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return true
  }

  const { data, error } = await client
    .from('reservations')
    .select('start_time, end_time, status')
    .eq('reservation_date', date)
    .in('status', ['pending', 'confirmed'])

  if (error) throw error

  return !(data ?? []).some((item) => intersectsRange(item.start_time, item.end_time, start, end))
}

export async function createReservation(payload: Omit<Reservation, 'id' | 'status'>) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return { ...payload, id: crypto.randomUUID(), status: 'pending' as const }
  }

  const { error } = await client
    .from('reservations')
    .insert({
      ...payload,
      status: 'pending',
    })

  if (error) throw error
  return { ...payload, id: 'temp-id', status: 'pending' as const } as Reservation
}

export async function fetchReservations() {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return [] as Reservation[]
  }

  const { data, error } = await client.from('reservations').select('*').order('reservation_date', { ascending: false })
  if (error) throw error
  return (data as Reservation[]) ?? []
}

export async function updateReservation(id: string, status: Reservation['status']) {
  const { client, isDemo } = resolveClientState()
  if (isDemo) {
    return
  }

  const { error } = await client.from('reservations').update({ status }).eq('id', id)
  if (error) throw error
}
