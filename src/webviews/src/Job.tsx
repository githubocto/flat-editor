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
  if (!job || (job && job.steps.length < 2)) return null

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    update(store => {
      store.state.jobs[props.index].name = newName
    })
  }
  const handlePostprocessingChange = (newPath: string) => {
    update(store => {
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
    <div>
      <div className="p-2 flex items-center justify-between">
        <p className="text-lg">
          {props.name ? (
            props.name
          ) : (
            <span className="opacity-50 italic">Job Name</span>
          )}
        </p>
        <Clickable
          onClick={handleRemoveJob}
          as="div"
          className="font-medium underline cursor-pointer"
        >
          Remove Job
        </Clickable>
      </div>
      <Input
        title="Job name"
        value={props.name}
        label="A descriptive name for this job."
        handleChange={handleNameChange}
        error={nameError}
      />
      <StepConfig jobIndex={props.index} step={job.steps[1]} />

      <FilePicker
        title="Postprocessing file"
        label="The file containing the postprocessing script."
        value={(job.steps[1] as FlatStep).with.postprocessing}
        accept=".js,.ts"
        onChange={newPath => {
          handlePostprocessingChange(newPath)
        }}
      />
    </div>
  )
}

export default Job
