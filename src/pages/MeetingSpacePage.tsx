import { CheckCircle2, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  'Capacité flexible de 8 à 20 personnes',
  'Wi-Fi haut débit inclus',
  'Ambiance calme idéale pour enseignants et groupes',
  'Service café & restauration sur place',
]

export function MeetingSpacePage() {
  return (
    <section className="section-container">
      <SectionTitle
        overline="Espace Rencontres"
        title="Un espace pensé pour vos réunions, ateliers et cours"
        subtitle="Parfait pour les enseignants, associations, freelances et équipes en petit groupe."
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <div className="h-64 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center md:h-80" />
          <CardContent className="space-y-3 pt-6">
            <p className="text-muted-foreground">
              Notre salle est équipée pour des rencontres productives : mobilier confortable, lumière naturelle,
              ambiance acoustique douce et service attentif.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-fm6e-mint px-4 py-2 text-sm font-medium text-fm6e-dark">
              <Wifi className="h-4 w-4" /> Wi-Fi stable et rapide
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-sm">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 w-full">
              <Link to="/reservation">Réserver maintenant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
