import { MapPin, Phone, Mail } from 'lucide-react'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Card, CardContent } from '@/components/ui/card'

export function ContactPage() {
  return (
    <section className="section-container">
      <SectionTitle
        overline="Contact"
        title="On vous accueille avec plaisir"
        subtitle="Écrivez-nous ou passez nous voir pour organiser votre prochain moment au Club 5 Octobre."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-primary" /> Adresse
            </p>
            <p className="mt-2 text-muted-foreground">4 Rue Brahim Roudani, Mohammedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <Phone className="h-4 w-4 text-primary" /> Téléphone
            </p>
            <p className="mt-2 text-muted-foreground">+212 6 00 00 00 00</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4 text-primary" /> Email
            </p>
            <p className="mt-2 text-muted-foreground">contact@club5octobre.ma</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
