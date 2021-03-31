import React, { FunctionComponent } from 'react'
import Header from './Header'
import CronChooser from './settings/CronChooser'
import TextInput from './settings/TextInput'
import useFlatConfigStore from './store'

type TriggersProps = {}
const Triggers: FunctionComponent<TriggersProps> = props => {
  const { state, update } = useFlatConfigStore()

  const branches = (state.on.push?.branches || []).join(',')
  const cron = state.on?.schedule?.cron || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(store => {
      if (!store.state.on.push) {
        store.state.on.push = { branches: [] }
      }
      if (!store.state.on.push.branches) {
        store.state.on.push.branches = []
      }
      store.state.on.push.branches = e.target.value.split(',')
    })
  }

  const handleScheduleChange = (schedule: string) => {
    update(store => {
      if (!store.state.on.schedule) {
        store.state.on.schedule = { cron: '' }
      }

      store.state.on.schedule.cron = schedule
    })
  }

  return (
    <div className="text-vscode-foreground pb-4">
      <Header
        title="Triggers"
        description="These settings determine when your workflow is executed."
      />

      <TextInput
        title="Branches that push"
        value={branches}
        label="A comma-separated list of git branch names that trigger the data to update on push."
        handleChange={handleChange}
      />

      <CronChooser value={cron} onChange={handleScheduleChange} />
    </div>
  )
}

export default Triggers
