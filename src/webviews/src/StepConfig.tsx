import React from 'react'
import type { Step, FlatStep, PullHttpConfig } from '../../types'
import TextInput from './settings/TextInput'
import useFlatConfigStore from './store'

interface StepConfigProps {
  step: Step
  jobIndex: number
}

export function StepConfig(props: StepConfigProps) {
  const { update } = useFlatConfigStore()
  const handleHttpUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(store => {
      const step = store.state.jobs[props.jobIndex].steps[1] as FlatStep
      ;(step.with as PullHttpConfig).http_url = e.target.value
    })
  }

  if ('with' in props.step && 'http_url' in props.step.with) {
    return (
      <div>
        <TextInput
          value={props.step.with.http_url}
          title="Where is the data?"
          label="This needs to be a stable, unchanging URL"
          handleChange={handleHttpUrlChange}
        />
      </div>
    )
  } else if ('with' in props.step && 'sql_format' in props.step.with) {
    return <div>SQL</div>
  } else {
    return null
  }
}
