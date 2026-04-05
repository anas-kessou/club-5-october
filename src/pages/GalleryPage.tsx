import { useEffect, useState } from 'react'
import { fetchGalleryImages } from '@/lib/api'
import type { GalleryImage } from '@/lib/types'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    void fetchGalleryImages().then(setImages).catch(() => setImages([]))
  }, [])

  return (
    <section className="section-container">
      <SectionTitle
        overline="Galerie"
        title="Découvrez l’ambiance Club 5 Octobre"
        subtitle="Grille dynamique avec aperçu plein écran. Les photos proviennent de Supabase Storage."
      />

      <div className="columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3">
        {images.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <button className="group relative block w-full overflow-hidden rounded-xl border bg-card text-left shadow-soft">
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? image.title}
                  loading="lazy"
                  className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <p className="font-medium">{image.title}</p>
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{image.title}</DialogTitle>
                <DialogDescription>{image.alt_text ?? 'Photo Club 5 Octobre'}</DialogDescription>
              </DialogHeader>
              <img src={image.image_url} alt={image.alt_text ?? image.title} className="max-h-[75vh] w-full rounded-md object-contain" />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  )
}
