import React, { FunctionComponent } from 'react'
import TextInput from './settings/TextInput'
import useFlatConfigStore from './store'

type JobProps = {
  name: string
  index: number
  type: 'pull' | 'push' | 'transform'
}

const Job: FunctionComponent<JobProps> = props => {
  const { state, update } = useFlatConfigStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    update(store => {
      store.state.jobs[props.index].name = newName
    })
  }

  return (
    <div>
      <div className="p-2 text-lg font-normal">{props.name}</div>
      <TextInput
        title="Job name"
        value={props.name}
        label="A descriptive name for this job."
        handleChange={handleChange}
        error={''}
      />
    </div>
  )
}

export default Job
