import { Leaf, Recycle, UsersRound } from 'lucide-react'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SustainabilityPage() {
  return (
    <section className="section-container">
      <SectionTitle
        overline="Durabilité"
        title="Engagés avec la Fondation Mohammed VI pour la Protection de l’Environnement"
        subtitle="Une collaboration qui traduit notre volonté de bâtir un lieu responsable et exemplaire."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Recycle className="h-5 w-5 text-primary" /> Tri et réduction
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Réduction du plastique à usage unique, tri sélectif et sensibilisation du personnel.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-primary" /> Approvisionnement local
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Priorité aux fournisseurs régionaux pour soutenir l’économie locale et limiter l’empreinte carbone.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UsersRound className="h-5 w-5 text-primary" /> Sensibilisation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ateliers et rencontres sur les écogestes, avec un focus communauté et jeunesse.
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
