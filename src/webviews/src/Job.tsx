import React, { FunctionComponent } from 'react'
import { Clickable } from 'reakit/Clickable'
import TextInput from './settings/TextInput'
import useFlatConfigStore from './store'

type JobProps = {
  name: string
  index: number
  type: 'pull' | 'push' | 'transform'
}

export const Job: FunctionComponent<JobProps> = props => {
  const { state, update, errors } = useFlatConfigStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    update(store => {
      store.state.jobs[props.index].name = newName
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
      <TextInput
        title="Job name"
        value={props.name}
        label="A descriptive name for this job."
        handleChange={handleChange}
        error={nameError}
      />
    </div>
  )
}

export default Job
