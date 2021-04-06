import React, { FunctionComponent } from 'react'
import { Clickable } from 'reakit/Clickable'
import type { FlatStep } from '../../types'

import { Input } from './settings/Input'
import { FilePicker } from './settings/FilePicker'
import { StepConfig } from './StepConfig'
import useFlatConfigStore from './store'

type JobProps = {
  name: string
  index: number
  type: 'pull' | 'push' | 'transform'
}

export const Job: FunctionComponent<JobProps> = props => {
  const { state, update, errors } = useFlatConfigStore()
  const job = state.jobs[props.index]

  // Return early if no job, or if we've lost the secondary step
  if (!job || !job.steps || job.steps.length < 2) return null

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    update(store => {
      store.state.jobs[props.index].name = newName
    })
  }
  const handlePostprocessingChange = (newPath: string) => {
    update(store => {
      if (!store.state.jobs[props.index].steps)
        store.state.jobs[props.index].steps = []
      ;(store.state.jobs[props.index]
        .steps[1] as FlatStep).with.postprocessing = newPath
    })
  }

  const handleRemoveJob = () => {
    update(store => {
      store.state.jobs.splice(props.index, 1)
    })
  }

  const nameError = errors.find(
    error => error.path === `jobs[${props.index}].name`
  )?.message

  return (
    <div className="flex mb-6">
      <div
        className="flex-none w-5 pt-2 text-right"
        style={{
          paddingTop: 13,
        }}
      >
        {props.index + 1}.
      </div>
      <div className="flex-1 w-full">
        <div className="p-2 flex items-center justify-between overflow-hidden">
          <p className="flex-1 text-lg font-bold setting-item-cat-label-container pl-2 overflow-ellipsis overflow-hidden">
            {props.name ? (
              props.name
            ) : (
              <span className="opacity-50 italic">Name</span>
            )}
          </p>
          <Clickable
            onClick={handleRemoveJob}
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
        <Input
          title="Job name"
          value={props.name}
          label="A descriptive name for this data source. This is used to identify the job in the GitHub Action."
          handleChange={handleNameChange}
          error={nameError}
        />
        <StepConfig jobIndex={props.index} step={job.steps[1]} />

        <FilePicker
          title="Postprocessing file"
          label="The file containing the postprocessing script. This needs to be within the same repository."
          value={(job.steps[1] as FlatStep).with.postprocessing}
          accept=".js,.ts"
          onChange={newPath => {
            handlePostprocessingChange(newPath)
          }}
        />
      </div>
    </div>
  )
}

export default Job
