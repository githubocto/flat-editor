import {
  VSCodeBadge,
  VSCodeButton,
  VSCodeTag,
} from '@vscode/webview-ui-toolkit/react'
import React, { FunctionComponent } from 'react'
import type { FlatStep } from '../../types'

import { FilePicker } from './settings/FilePicker'
import { StepConfig } from './StepConfig'
import useFlatConfigStore from './store'

type StepProps = {
  step: FlatStep
  index: number
}

export const Step: FunctionComponent<StepProps> = props => {
  const { state, update, errors } = useFlatConfigStore()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    update(store => {
      store.state.jobs.scheduled.steps[props.index].name = newName
    })
  }
  const handlePostprocessChange = (newPath?: string) => {
    update(store => {
      ;(store.state.jobs.scheduled.steps[
        props.index
      ] as FlatStep).with.postprocess = newPath
    })
  }

  const handleRemoveStep = () => {
    update(store => {
      store.state.jobs.scheduled.steps.splice(props.index, 1)
    })
  }

  return (
    <div className="p-4 rounded border-solid border border-[color:var(--divider-background)]">
      <div className="flex items-center justify-between mb-4">
        <VSCodeTag>
          <span>#{props.index + 1 - 2}</span> Fetch data via{' '}
          {'with' in props.step && 'sql_queryfile' in props.step.with
            ? 'SQL'
            : 'HTTP'}
        </VSCodeTag>
        <VSCodeButton appearance="secondary" onClick={handleRemoveStep}>
          <span className="codicon codicon-x" slot="start" />
          Remove
        </VSCodeButton>
      </div>
      <div className="flex-1 w-full space-y-6">
        <StepConfig stepIndex={props.index} step={props.step} />
        <FilePicker
          title="Postprocessing file (optional)"
          label="The file containing the postprocessing script. This needs to be within the same repository."
          value={props.step.with.postprocess}
          accept=".js,.ts"
          onChange={newPath => {
            handlePostprocessChange(newPath || undefined)
          }}
          isClearable
        />
      </div>
    </div>
  )
}

export default Step
