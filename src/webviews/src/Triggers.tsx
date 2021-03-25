import React, { FunctionComponent } from 'react'
import CronChooser from './settings/CronChooser'
import Toggle from './settings/Toggle'
import useFlatConfigStore from './store'

type TriggersProps = {}
const Triggers: FunctionComponent<TriggersProps> = props => {
  const { state, update } = useFlatConfigStore()

  return (
    <div className="text-vscode-foreground">
      <header className="p-2 hover:bg-vscode-notebook-rowHoverBackground">
        <div className="text-2xl font-bold text-vscode-settings-headerForeground py-2">
          Triggers
        </div>
        <div className="text-vscode-foreground">
          These settings determine when your workflow is executed.
        </div>
      </header>

      <Toggle
        handleChange={e =>
          update(store => {
            store.state.triggerPush = e.target.checked
          })
        }
        title="Upon Push"
        label="The workflow will be executed when commits are pushed to any branch."
        checked={state.triggerPush}
      />
      <CronChooser
        value={state.triggerSchedule}
        handleScheduleChange={s => {
          update(store => {
            store.state.triggerSchedule = s
          })
        }}
      />
    </div>
  )
}

export default Triggers
