import React from 'react'
import Header from './Header'
import CronChooser from './settings/CronChooser'
import useFlatConfigStore from './store'

type TriggersProps = {}
export function Triggers(props: TriggersProps) {
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
    <div>
      <div className="mb-2">
        <h2 className="my-0 text-[26px] leading-[30px] font-normal">
          When to update the data
        </h2>
      </div>
      <CronChooser value={cron} onChange={handleScheduleChange} />
    </div>
  )
}

export default Triggers
