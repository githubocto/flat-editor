import React, { FunctionComponent, useState } from 'react'
import TextInput from './settings/TextInput'
import useFlatConfigStore from './store'

type JobProps = {
  name: string
  type: 'pull' | 'push' | 'transform'
}

const Job: FunctionComponent<JobProps> = props => {
  const { state, update } = useFlatConfigStore()
  const [name, setName] = useState(props.name)

  const validate = (newName: string) => {
    const jobNames = state.jobs.map(j => j.name)
    if (jobNames.includes(newName)) {
      // can't use this name
      return 'Jobs must have a unique name.'
    } else if (newName === '') {
      return 'Jobs must have a name.'
    } else {
      return undefined
    }
  }
  const [error, setError] = useState<string | undefined>(validate(props.name))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    const error = validate(newName)
    if (error) {
      setError(error)
    } else {
      update(store => {
        const job = store.state.jobs.find(j => j.name === props.name)
        if (job) {
          job.name = newName
        }
      })
      setError(undefined)
    }
    // const jobNames = state.jobs.map(j => j.name)
    // if (jobNames.includes(newName)) {
    //   // can't use this name
    //   setError('Jobs must have a unique name.')
    // } else if (newName === '') {
    //   setError('Jobs must have a name.')
    // } else {
    //   setError(undefined)
    //   update(store => {
    //     const job = store.state.jobs.find(j => j.name === props.name)
    //     if (job) {
    //       job.name = newName
    //     }
    //   })
    // }
  }
  return (
    <div>
      <div className="p-2 text-lg font-normal">{props.name}</div>
      <TextInput
        title="Job name"
        value={name}
        label="A descriptive name for this job."
        handleChange={handleChange}
        error={error}
      />
      {/* TODO: job deltion */}
    </div>
  )
}

export default Job
