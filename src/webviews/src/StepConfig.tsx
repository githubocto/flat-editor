import React from 'react'

import type { Step, FlatStep, PullHttpConfig, PullSqlConfig } from '../../types'
import { Input } from './settings/Input'
import { FilePicker } from './settings/FilePicker'
import { HttpEndpointPreview } from './settings/HttpEndpointPreview'
import SecretInput from './settings/SecretInput'
import FieldWithDescription from './settings/FieldWithDescription'
import useFlatConfigStore from './store'

interface StepConfigProps {
  step: Step
  stepIndex: number
}

export function StepConfig(props: StepConfigProps) {
  const { update, workspace } = useFlatConfigStore()

  const handleHttpValueChange = (stepName: string, newValue?: string) => {
    update(store => {
      const step = store.state.jobs.scheduled.steps[props.stepIndex] as FlatStep
      // @ts-ignore
      ;(step.with as PullHttpConfig)[stepName] = newValue
    })
  }
  const handleSqlValueChange = (stepName: string, newValue: string) => {
    update(store => {
      const step = store.state.jobs.scheduled.steps[props.stepIndex] as FlatStep
      // @ts-ignore
      ;(step.with as PullSqlConfig)[stepName] = newValue
    })
  }

  if ('with' in props.step && 'http_url' in props.step.with) {
    return (
      <div>
        <Input
          value={props.step.with.downloaded_filename || ''}
          placeholder="data"
          title="Downloaded filename"
          label="The filename where you want the results to be saved. This file doesn't need to exist yet."
          handleChange={e =>
            handleHttpValueChange(
              'downloaded_filename',
              e.target.value || undefined
            )
          }
        />
        <Input
          value={props.step.with.http_url}
          title="Endpoint url"
          label="Which endpoint should we pull data from? This needs to be a stable, unchanging URL."
          handleChange={e => handleHttpValueChange('http_url', e.target.value)}
        >
          <HttpEndpointPreview url={props.step.with.http_url} />
        </Input>
      </div>
    )
  } else if ('with' in props.step && 'sql_queryfile' in props.step.with) {
    return (
      <div>
        <Input
          value={props.step.with.downloaded_filename || ''}
          placeholder="data"
          title="Downloaded filename"
          label="The filename (with a csv or json extension) where you want the results to be saved. This file doesn't need to exist yet."
          handleChange={e =>
            handleSqlValueChange('downloaded_filename', e.target.value)
          }
        />
        <FilePicker
          accept=".sql"
          title="File with SQL query"
          label="The file containing the query to run"
          value={props.step.with.sql_queryfile}
          onChange={newPath => {
            handleSqlValueChange('sql_queryfile', newPath)
          }}
        />
        <SecretInput
          title="Connection string"
          label="We'll encode and store this as a Github Secret, then use it to connect to your database."
          value={props.step.with.sql_connstring}
          handleChange={newValue =>
            handleSqlValueChange('sql_connstring', newValue)
          }
        />
      </div>
    )
  } else {
    return null
  }
}
