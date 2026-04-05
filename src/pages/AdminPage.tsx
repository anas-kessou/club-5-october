import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  UtensilsCrossed,
  XCircle,
  FileText
} from 'lucide-react'

import {
  createGalleryImage,
  createMenuItem,
  deleteGalleryImage,
  deleteMenuItem,
  fetchGalleryImages,
  fetchMenuItems,
  fetchReservations,
  updateReservation,
} from '@/lib/api'
import { menuCategories } from '@/lib/content'
import { supabase } from '@/lib/supabase'
import type { GalleryImage, MenuItem, Reservation } from '@/lib/types'
import { gallerySchema, menuItemSchema, type GalleryFormValues, type MenuItemFormValues } from '@/lib/validation'
import { AdminGate } from '@/components/auth/AdminGate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

async function uploadGalleryAsset(file: File) {
  if (!supabase) {
    throw new Error('Supabase n’est pas configuré pour l’upload.')
  }

  const extension = file.name.split('.').pop()
  const filePath = `gallery/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from('club-gallery').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from('club-gallery').getPublicUrl(filePath)
  return data.publicUrl
}

export function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isRefreshingReservations, setIsRefreshingReservations] = useState(false)

  const menuForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Boissons Chaudes',
      price_mad: 25,
      is_available: true,
      image_url: '',
    },
  })

  const galleryForm = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: '',
      alt_text: '',
    },
  })

  function isRlsError(error: unknown) {
    if (!error || typeof error !== 'object') return false
    const maybeCode = (error as { code?: unknown }).code
    return maybeCode === '42501'
  }

  async function refreshReservations(options?: { silent?: boolean }) {
    const { silent = false } = options ?? {}

    if (!silent) {
      setIsRefreshingReservations(true)
    }

    try {
      const booking = await fetchReservations()
      setReservations(booking)
    } catch (error) {
      if (!silent) {
        if (isRlsError(error)) {
          toast.error('Accès refusé aux réservations. Vérifiez que votre profil est admin (is_admin=true).')
        } else {
          toast.error('Impossible d’actualiser les réservations.')
        }
      }
    } finally {
      if (!silent) {
        setIsRefreshingReservations(false)
      }
    }
  }

  async function refreshAll(options?: { silentReservations?: boolean }) {
    const { silentReservations = false } = options ?? {}
    const [menuResult, galleryResult] = await Promise.allSettled([fetchMenuItems(), fetchGalleryImages()])

    if (menuResult.status === 'fulfilled') {
      setMenuItems(menuResult.value)
    }

    if (galleryResult.status === 'fulfilled') {
      setGalleryImages(galleryResult.value)
    }

    await refreshReservations({ silent: silentReservations })

    if (menuResult.status === 'rejected') {
      toast.error('Impossible de charger le menu admin.')
    }

    if (galleryResult.status === 'rejected') {
      toast.error('Impossible de charger la galerie admin.')
    }
  }

  useEffect(() => {
    void refreshAll()
  }, [])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      void refreshReservations({ silent: true })
    }, 60_000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const handleCreateMenu = menuForm.handleSubmit(async (values) => {
    await createMenuItem({ ...values, image_url: values.image_url || null })
    menuForm.reset()
    toast.success('Plat ajouté au menu.')
    await refreshAll()
  })

  const handleCreateGallery = galleryForm.handleSubmit(async (values) => {
    let imageUrl = ''

    if (selectedFile) {
      imageUrl = await uploadGalleryAsset(selectedFile)
    }

    if (!imageUrl) {
      toast.error('Veuillez sélectionner une image.')
      return
    }

    await createGalleryImage({
      title: values.title,
      alt_text: values.alt_text || null,
      image_url: imageUrl,
    })

    galleryForm.reset()
    setSelectedFile(null)
    toast.success('Photo ajoutée à la galerie.')
    await refreshAll()
  })

  async function handleReservationStatus(id: string, status: Reservation['status']) {
    await updateReservation(id, status)
    toast.success(`Réservation ${status}.`)
    await refreshAll()
  }

  return (
    <AdminGate>
      <div className="min-h-screen bg-stone-50 pb-16">
        <div className="bg-white border-b border-stone-200 pt-32 pb-8 px-6 lg:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-stone-900 mb-2">Tableau de bord</h1>
              <p className="text-stone-500 max-w-2xl text-sm md:text-base">Gérez le menu, la galerie et les réservations du Club 5 Octobre depuis un seul espace sécurisé.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm flex items-center shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Connecté en tant qu'admin
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="mb-8 p-1 h-14 bg-white border shadow-sm rounded-xl inline-flex w-full overflow-x-auto justify-start sm:w-auto">
              <TabsTrigger value="menu" className="flex items-center gap-2 h-10 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow text-stone-600 font-medium">
                <UtensilsCrossed className="w-4 h-4" /> Menu
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2 h-10 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow text-stone-600 font-medium">
                <ImageIcon className="w-4 h-4" /> Galerie
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2 h-10 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow text-stone-600 font-medium">
                <CalendarDays className="w-4 h-4" /> Réservations
                {reservations.filter((r) => r.status === 'pending').length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
                    {reservations.filter((r) => r.status === 'pending').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-0 shadow-sm lg:col-span-3">
                <CardHeader className="bg-white rounded-t-xl border-b border-stone-100 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Ajouter un article au Menu</CardTitle>
                </CardHeader>
                <CardContent className="bg-white p-6 rounded-b-xl border border-t-0 border-stone-200">
                  <form className="grid gap-5 md:grid-cols-2" onSubmit={handleCreateMenu}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du plat/boisson</Label>
                      <Input id="name" placeholder="Ex: Thé vert Royal" className="bg-stone-50" {...menuForm.register('name')} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (MAD)</Label>
                      <Input id="price" placeholder="Prix" type="number" className="bg-stone-50" {...menuForm.register('price_mad', { valueAsNumber: true })} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <select id="category" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-stone-50 px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50" {...menuForm.register('category')}>
                        {menuCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
                      <Input id="image_url" placeholder="https://..." className="bg-stone-50" {...menuForm.register('image_url')} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" className="bg-stone-50" placeholder="Ingrédients, préparation..." rows={3} {...menuForm.register('description')} />
                    </div>

                    <Button type="submit" className="md:col-span-2 w-full md:w-auto justify-self-end mt-2">
                      <Plus className="w-4 h-4 mr-2" /> Ajouter l'article
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-4 ml-1">Menu Actuel ({menuItems.length})</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-all border-stone-200 flex flex-col">
                      {item.image_url ? (
                        <div className="h-40 w-full overflow-hidden bg-stone-100 shrink-0">
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="h-3 w-full bg-gradient-to-r from-primary/20 to-primary/40 shrink-0"></div>
                      )}
                      <CardContent className="pt-5 p-5 flex flex-col grow">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h4 className="font-playfair text-[1.15rem] font-bold text-stone-800 leading-tight">{item.name}</h4>
                          <span className="shrink-0 bg-stone-100 text-stone-800 font-semibold px-2 py-1 rounded text-sm whitespace-nowrap">{item.price_mad} MAD</span>
                        </div>
                        <div className="mb-3">
                           <Badge variant="outline" className="text-stone-500 font-normal bg-stone-50 border-stone-200">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-stone-500 mb-6 flex-grow">{item.description}</p>
                        
                        <div className="flex justify-end border-t border-stone-100 pt-4 mt-auto">
                          <Button variant="ghost" size="sm" onClick={() => void deleteMenuItem(item.id).then(() => refreshAll())} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3">
                            <Trash2 className="h-4 w-4 shrink-0 mr-2" /> Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-white rounded-t-xl border-b border-stone-100 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary" /> Ajouter une photo à la Galerie</CardTitle>
                </CardHeader>
                <CardContent className="bg-white p-6 rounded-b-xl border border-t-0 border-stone-200">
                  <form className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-end" onSubmit={handleCreateGallery}>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-title">Titre visible</Label>
                      <Input id="gallery-title" placeholder="Intérieur élégant" className="bg-stone-50" {...galleryForm.register('title')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-alt">Texte alternatif (SEO)</Label>
                      <Input id="gallery-alt" placeholder="Description de l'image" className="bg-stone-50" {...galleryForm.register('alt_text')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-upload">Fichier Image</Label>
                      <Input
                        id="gallery-upload"
                        type="file"
                        accept="image/*"
                        className="bg-stone-50 file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-medium hover:file:bg-primary/20 transition-colors file:cursor-pointer"
                        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                      />
                    </div>
                    <Button type="submit" className="md:col-span-2 lg:col-span-3 w-full md:w-auto mt-2 text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" /> Téléverser l'image
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-4 ml-1">Images ({galleryImages.length})</h3>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {galleryImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden group border border-stone-200 shadow-sm relative rounded-xl aspect-[4/3] bg-stone-100 flex items-center justify-center">
                      <img src={image.image_url} alt={image.alt_text ?? image.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                        <p className="text-stone-50 font-medium text-center mb-4 text-sm truncate w-full px-2 drop-shadow-md" title={image.title}>{image.title}</p>
                        <Button size="sm" variant="destructive" onClick={() => void deleteGalleryImage(image.id).then(() => refreshAll())} className="rounded-full shadow-lg h-9">
                          <Trash2 className="h-4 w-4 mr-2" /> Retirer
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reservations" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="flex justify-between items-end ml-1 mb-4">
                <h3 className="text-lg font-semibold text-stone-800">Toutes les réservations ({reservations.length})</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void refreshReservations()}
                  disabled={isRefreshingReservations}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshingReservations ? 'animate-spin' : ''}`} />
                  {isRefreshingReservations ? 'Actualisation...' : 'Actualiser'}
                </Button>
              </div>

              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <Card className="border border-dashed border-stone-300 bg-stone-50">
                    <CardContent className="pt-10 pb-10 text-center flex flex-col items-center justify-center text-stone-500">
                      <CalendarDays className="h-10 w-10 text-stone-300 mb-3" />
                      <p className="text-base font-medium">Aucune réservation trouvée.</p>
                      <p className="text-sm">Les demandes apparaîtront ici.</p>
                    </CardContent>
                  </Card>
                ) : (
                  reservations.map((reservation) => (
                    <Card key={reservation.id} className="border-l-4 border-l-primary/70 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="flex flex-col justify-between gap-6 pt-6 lg:flex-row lg:items-center">
                        <div className="space-y-3 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-start gap-3 sm:gap-4">
                            <p className="font-playfair font-bold text-xl text-stone-800">{reservation.full_name}</p>
                            <Badge 
                              className={
                                reservation.status === 'confirmed' ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0" :
                                reservation.status === 'cancelled' ? "bg-red-100 text-red-800 hover:bg-red-200 border-0" :
                                "bg-amber-100 text-amber-800 hover:bg-amber-200 border-0"
                              }
                            >
                              {reservation.status === 'confirmed' ? "Confirmée" : reservation.status === 'cancelled' ? "Annulée" : "En attente"}
                            </Badge>
                            <Badge variant="outline" className="hidden sm:inline-flex border-stone-200 text-stone-500">{reservation.language.toUpperCase()}</Badge>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600 bg-stone-50/50 p-3 rounded-lg border border-stone-100">
                            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary shrink-0" /> <span className="font-medium">{reservation.reservation_date}</span></div>
                            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary shrink-0" /> <span className="font-medium">{reservation.start_time} - {reservation.end_time}</span></div>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary shrink-0" /> <span className="font-medium">{reservation.guests} personnes</span></div>
                            <div className="flex items-center gap-2 break-all"><FileText className="h-4 w-4 text-primary shrink-0" /> {reservation.email} <span className="text-stone-300 mx-1">|</span> {reservation.phone}</div>
                          </div>
                          
                          {reservation.notes && (
                            <div className="mt-3 text-sm bg-stone-100 p-3 rounded-lg flex gap-3 text-stone-700 border-l border-stone-200">
                              <FileText className="h-5 w-5 text-stone-400 shrink-0" />
                              <p className="italic">"{reservation.notes}"</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row lg:flex-col gap-2 shrink-0 border-t border-stone-100 lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l">
                          {reservation.status !== 'confirmed' && (
                          <Button size="sm" onClick={() => void handleReservationStatus(reservation.id, 'confirmed')} className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-white rounded-md h-10 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Confirmer
                          </Button>
                          )}
                          {reservation.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void handleReservationStatus(reservation.id, 'cancelled')}
                            className="w-full lg:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-10"
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Rejeter
                          </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AdminGate>
  )
}
