import type * as React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar(props: CalendarProps) {
  return <DayPicker showOutsideDays className="rounded-md border bg-card p-3" {...props} />
}
