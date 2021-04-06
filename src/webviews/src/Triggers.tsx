import React, { FunctionComponent } from 'react'
import Header from './Header'
import CronChooser from './settings/CronChooser'
import { Input } from './settings/Input'
import useFlatConfigStore from './store'

type TriggersProps = {}
const Triggers: FunctionComponent<TriggersProps> = props => {
  const { state, update } = useFlatConfigStore()

  const cron = state.on?.schedule?.[0]?.cron || ''

  const handleScheduleChange = (schedule: string) => {
    update(store => {
      // not likely, but handling borked state
      if (Array.isArray(store.state.on)) {
        store.state.on = { schedule: [{ cron: '' }] }
      }
      if (!store.state.on?.schedule || !store.state.on?.schedule.length) {
        store.state.on.schedule = [{ cron: '' }]
      }
      store.state.on.schedule[0].cron = schedule
    })
  }

  return (
    <div className="text-vscode-foreground pb-4">
      <Header title="When to update the data" description="" />

      <CronChooser value={cron} onChange={handleScheduleChange} />
    </div>
  )
}

export default Triggers
