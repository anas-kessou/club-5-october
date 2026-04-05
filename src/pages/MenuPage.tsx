import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { fetchMenuItems } from '@/lib/api'
import { menuCategories } from '@/lib/content'
import type { MenuCategory, MenuItem } from '@/lib/types'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all')

  useEffect(() => {
    void fetchMenuItems().then(setMenuItems).catch(() => setMenuItems([]))
  }, [])

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory
      const searchMatch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      return categoryMatch && searchMatch
    })
  }, [activeCategory, menuItems, search])

  return (
    <section className="section-container">
      <SectionTitle
        overline="Notre menu"
        title="Saveurs marocaines et pauses café premium"
        subtitle="Filtrez par catégorie ou recherchez un plat. Les données sont synchronisées avec Supabase."
      />

      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={activeCategory === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory('all')}>
            Tous
          </Button>
          {menuCategories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <Badge variant="secondary">{item.price_mad} MAD</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
