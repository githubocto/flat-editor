import React from 'react'

import type { Step, FlatStep, PullHttpConfig, PullSqlConfig } from '../../types'
import { Input } from './settings/Input'
import { FilePicker } from './settings/FilePicker'
import SecretInput from './settings/SecretInput'
import FieldWithDescription from './settings/FieldWithDescription'
import useFlatConfigStore from './store'

interface StepConfigProps {
  step: Step
  jobIndex: number
}

export function StepConfig(props: StepConfigProps) {
  const { update, workspace } = useFlatConfigStore()

  const handleHttpUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(store => {
      const step = store.state.jobs[props.jobIndex].steps[1] as FlatStep
      ;(step.with as PullHttpConfig).http_url = e.target.value
    })
  }
  const handleSqlValueChange = (stepName: string, newValue: string) => {
    update(store => {
      const step = store.state.jobs[props.jobIndex].steps[1] as FlatStep
      // @ts-ignore
      ;(step.with as PullSqlConfig)[stepName] = newValue
    })
  }

  if ('with' in props.step && 'http_url' in props.step.with) {
    return (
      <div>
        <Input
          value={props.step.with.http_url}
          title="Endpoint url"
          label="Which endpoint should we pull data from? This needs to be a stable, unchanging URL."
          handleChange={handleHttpUrlChange}
        />
      </div>
    )
  } else if ('with' in props.step && 'sql_format' in props.step.with) {
    return (
      <div>
        <Input
          value={props.step.with.outfile_basename}
          title="Result filename"
          label="The filename where you want the results to be saved. This file doesn't need to exist yet."
          handleChange={e =>
            handleSqlValueChange('outfile_basename', e.target.value)
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
        <FieldWithDescription title="Data format">
          <div className="flex flex-col space-y-2">
            <div>What format would you like the result to be in?</div>

            <div className="flex flex-wrap items-center space-x-4" role="group">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="sql_format"
                  checked={props.step.with.sql_format === 'csv'}
                  onChange={() => handleSqlValueChange('sql_format', 'csv')}
                  value="csv"
                />
                <span>CSV</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="sql_format"
                  checked={props.step.with.sql_format === 'json'}
                  onChange={() => handleSqlValueChange('sql_format', 'json')}
                  value="json"
                />
                <span>JSON</span>
              </label>
            </div>
          </div>
        </FieldWithDescription>
      </div>
    )
  } else {
    return null
  }
}
