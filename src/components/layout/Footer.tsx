import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t bg-fm6e-dark text-white">
      <div className="section-container grid gap-8 py-10 md:grid-cols-3 md:py-12">
        <div>
          <h3 className="font-display text-xl">Club 5 Octobre</h3>
          <p className="mt-2 text-sm text-emerald-100">
            Café-restaurant et espace rencontres partenaire de la Fondation Mohammed VI pour la Protection de
            l’Environnement.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Adresse</h4>
          <p className="mt-2 text-sm text-emerald-100">4 Rue Brahim Roudani, Mohammedia, Maroc</p>
        </div>

        <div>
          <h4 className="font-semibold">Liens rapides</h4>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-emerald-100">
            <Link to="/reservation" className="hover:text-white">
              Réservation
            </Link>
            <Link to="/galerie" className="hover:text-white">
              Galerie
            </Link>
            <Link to="/admin" className="hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
