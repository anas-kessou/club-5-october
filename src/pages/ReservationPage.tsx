import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { checkReservationAvailability, createReservation } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import { reservationSchema, type ReservationFormValues } from '@/lib/validation'
import { SectionTitle } from '@/components/common/SectionTitle'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { language, setLanguage } = useLanguage()

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      reservation_date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '10:00',
      end_time: '12:00',
      guests: 8,
      notes: '',
      language: 'fr',
    },
  })

  useEffect(() => {
    if (!selectedDate) return
    form.setValue('reservation_date', format(selectedDate, 'yyyy-MM-dd'))
  }, [form, selectedDate])

  useEffect(() => {
    form.setValue('language', language)
  }, [form, language])

  const onSubmit = form.handleSubmit(async (values) => {
    const isAvailable = await checkReservationAvailability(values.reservation_date, values.start_time, values.end_time)

    if (!isAvailable) {
      toast.error('Créneau indisponible. Veuillez choisir une autre heure.')
      return
    }

    await createReservation(values)
    toast.success('Réservation envoyée ! Une confirmation vous sera communiquée rapidement.')
    form.reset({ ...values, notes: '' })
  })

  return (
    <section className="section-container">
      <SectionTitle
        overline="Réservation"
        title="Réservez l’Espace Rencontres"
        subtitle="Formulaire dédié à la salle de réunion (8 à 20 personnes). Vérification de disponibilité en temps réel."
      />

      <div className="mb-6 flex gap-2">
        <Button type="button" size="sm" variant={language === 'fr' ? 'default' : 'outline'} onClick={() => setLanguage('fr')}>
          Français
        </Button>
        <Button type="button" size="sm" variant={language === 'ar' ? 'default' : 'outline'} onClick={() => setLanguage('ar')}>
          العربية
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 text-lg font-semibold">Choisissez la date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: new Date() }}
              locale={fr}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input id="full_name" {...form.register('full_name')} />
                  <p className="text-xs text-destructive">{form.formState.errors.full_name?.message}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" {...form.register('phone')} />
                  <p className="text-xs text-destructive">{form.formState.errors.phone?.message}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register('email')} />
                <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Début</Label>
                  <select id="start_time" className="h-10 w-full rounded-md border border-input px-3" {...form.register('start_time')}>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Fin</Label>
                  <select id="end_time" className="h-10 w-full rounded-md border border-input px-3" {...form.register('end_time')}>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-destructive">{form.formState.errors.end_time?.message}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Nombre de participants (8-20)</Label>
                <Input id="guests" type="number" min={8} max={20} {...form.register('guests', { valueAsNumber: true })} />
                <p className="text-xs text-destructive">{form.formState.errors.guests?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea id="notes" rows={4} {...form.register('notes')} />
              </div>

              <Button className="w-full" type="submit">
                Envoyer la réservation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
