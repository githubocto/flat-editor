import React, { FunctionComponent } from 'react'
import Header from './Header'
import CronChooser from './settings/CronChooser'
import { Input } from './settings/Input'
import useFlatConfigStore from './store'

type TriggersProps = {}
const Triggers: FunctionComponent<TriggersProps> = props => {
  const { state, update } = useFlatConfigStore()

  const branches = (state.on.push?.branches || []).join(',')
  const cron = state.on?.schedule?.[0]?.cron || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(store => {
      if (!store.state.on.push) {
        store.state.on.push = { branches: [] }
      }
      if (!store.state.on.push.branches) {
        store.state.on.push.branches = []
      }
      store.state.on.push.branches = e.target.value
        .split(',')
        .map(d => d.trim())
    })
  }

  const handleScheduleChange = (schedule: string) => {
    update(store => {
      if (schedule) {
        if (!store.state.on.schedule || !store.state.on.schedule.length) {
          store.state.on.schedule = [{ cron: '' }]
        }
        store.state.on.schedule[0].cron = schedule
      } else {
        store.state.on.schedule = []
      }
    })
  }

  return (
    <div className="text-vscode-foreground pb-4">
      <Header
        title="When to update the data"
        description="Configure when to update the data."
      />

      <Input
        title="On push"
        value={branches}
        label="A comma-separated list of git branch names that trigger the data to update on push."
        handleChange={handleChange}
      />

      <CronChooser value={cron} onChange={handleScheduleChange} />
    </div>
  )
}

export default Triggers
