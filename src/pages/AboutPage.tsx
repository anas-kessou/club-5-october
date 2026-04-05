import { SectionTitle } from '@/components/common/SectionTitle'

export function AboutPage() {
  return (
    <section className="section-container">
      <SectionTitle
        overline="À propos"
        title="Club 5 Octobre, un lieu vivant au cœur de Mohammedia"
        subtitle="Entre café-restaurant de qualité et espace d’échange professionnel, nous cultivons l’accueil et la convivialité."
      />

      <div className="grid gap-6 text-muted-foreground md:grid-cols-2">
        <p>
          Situé au 4 Rue Brahim Roudani, Club 5 Octobre (Espace 5 Octobre) est une adresse de quartier moderne qui
          valorise la culture marocaine et les échanges humains.
        </p>
        <p>
          Notre ambition : offrir un cadre élégant et accessible pour se restaurer, travailler et organiser des
          rencontres. Nous travaillons avec des produits locaux et une équipe engagée.
        </p>
      </div>
    </section>
  )
}
