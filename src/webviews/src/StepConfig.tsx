import React from 'react'

import type { Step, FlatStep, PullHttpConfig, PullSqlConfig } from '../../types'
import { Input } from './settings/Input'
import { FilePicker } from './settings/FilePicker'
import { HttpEndpointPreview } from './settings/HttpEndpointPreview'
import SecretInput from './settings/SecretInput'
import useFlatConfigStore from './store'
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'

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
      <>
        <div>
          <VSCodeTextField
            value={props.step.with.downloaded_filename || ''}
            placeholder="data.json"
            required
            className="w-full"
            onInput={
              // @ts-ignore
              e => {
                handleHttpValueChange(
                  'downloaded_filename',
                  e.target.value || undefined
                )
              }
            }
          >
            Downloaded Filename (required)
          </VSCodeTextField>
          <p className="text-[12px] mt-1 mb-0 font-medium">
            The filename where you want the results to be saved. This file
            doesn't need to exist yet.
          </p>
        </div>
        <div>
          <VSCodeTextField
            className="w-full"
            onInput={
              // @ts-ignore
              e => {
                handleHttpValueChange('http_url', e.target.value)
              }
            }
            value={props.step.with.http_url}
          >
            Endpoint url (required)
          </VSCodeTextField>
          <p className="text-[12px] mt-1 mb-0 font-medium">
            Which endpoint should we pull data from? This needs to be a stable,
            unchanging URL.
          </p>
          <div className="mt-2">
            <HttpEndpointPreview url={props.step.with.http_url} />
          </div>
        </div>
      </>
    )
  } else if ('with' in props.step && 'sql_queryfile' in props.step.with) {
    return (
      <>
        <div>
          <VSCodeTextField
            className="w-full"
            value={props.step.with.downloaded_filename || ''}
            placeholder="data.json"
            onInput={
              // @ts-ignore
              e => handleSqlValueChange('downloaded_filename', e.target.value)
            }
          >
            Downloaded filename (required)
          </VSCodeTextField>
          <p className="text-[12px] mt-1 mb-0 font-medium">
            The filename (with a csv or json extension) where you want the
            results to be saved. This file doesn't need to exist yet.
          </p>
        </div>
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
          title="Connection string (required)"
          label="We'll encode and store this as a Github Secret, then use it to connect to your database."
          value={props.step.with.sql_connstring}
          handleChange={newValue =>
            handleSqlValueChange('sql_connstring', newValue)
          }
        />
      </>
    )
  } else {
    return null
  }
}
