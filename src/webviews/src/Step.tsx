import React, { FunctionComponent } from 'react'
import { Clickable } from 'reakit/Clickable'
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
  const handlePostprocessChange = (newPath: string) => {
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
    <div className="flex mb-6">
      <div
        className="flex-none w-5 pt-2 text-right"
        style={{
          paddingTop: 13,
        }}
      >
        {props.index + 1 - 2}.
      </div>
      <div className="flex-1 w-full">
        <div className="p-2 flex items-center justify-between overflow-hidden">
          <div className="text-lg font-bold">
            Fetch data via{' '}
            {'with' in props.step && 'sql_format' in props.step.with
              ? 'SQL'
              : 'HTTP'}
          </div>
          <Clickable
            onClick={handleRemoveStep}
            as="div"
            className="flex-none cursor-pointer flex items-center"
          >
            <span
              className="codicon codicon-x pr-1"
              style={{ fontSize: '0.875rem' }}
            />
            <div className="font-medium underline">Remove</div>
          </Clickable>
        </div>

        <StepConfig stepIndex={props.index} step={props.step} />

        <FilePicker
          title="Postprocessing file"
          label="The file containing the postprocessing script. This needs to be within the same repository."
          value={props.step.with.postprocess}
          accept=".js,.ts"
          onChange={newPath => {
            handlePostprocessChange(newPath)
          }}
          isClearable
        />
      </div>
    </div>
  )
}

export default Step
