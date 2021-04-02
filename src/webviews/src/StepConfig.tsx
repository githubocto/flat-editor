import React from 'react'
import { Clickable } from 'reakit/Clickable'

import type { Step, FlatStep, PullHttpConfig, PullSqlConfig } from '../../types'
import { Input } from './settings/Input'
import SecretInput from './settings/SecretInput'
import FieldWithDescription from './settings/FieldWithDescription'
import useFlatConfigStore from './store'
import { VSCodeAPI } from './VSCodeAPI'

interface StepConfigProps {
  step: Step
  jobIndex: number
}

export function StepConfig(props: StepConfigProps) {
  const { update, workspace } = useFlatConfigStore()
  const [file, setFile] = React.useState<any>()
  const filePickerRef = React.useRef<HTMLInputElement | null>(null)

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

  const handleOpenFilePicker = () => {
    if (filePickerRef.current) {
      filePickerRef.current.click()
    }
  }

  const handleSqlFilePreview = (path: string) => {
    VSCodeAPI.postMessage({
      type: 'previewFile',
      data: path,
    })
  }

  if ('with' in props.step && 'http_url' in props.step.with) {
    return (
      <div>
        <Input
          value={props.step.with.http_url}
          title="Where is the data?"
          label="This needs to be a stable, unchanging URL"
          handleChange={handleHttpUrlChange}
        />
      </div>
    )
  } else if ('with' in props.step && 'sql_format' in props.step.with) {
    return (
      <div>
        <Input
          value={props.step.with.outfile_basename}
          title="Result location"
          label="The filename where you want the results to be saved. This file doesn't need to exist yet."
          handleChange={e =>
            handleSqlValueChange('outfile_basename', e.target.value)
          }
        />
        <FieldWithDescription title="Query File">
          <div className="space-y-2">
            {props.step.with.sql_queryfile && (
              <div className="flex items-center space-x-1">
                <Clickable
                  as="div"
                  className="underline appearance-none cursor-pointer"
                  onClick={() => {
                    // @ts-ignore
                    handleSqlFilePreview(props.step.with.sql_queryfile)
                  }}
                >
                  {props.step.with.sql_queryfile}
                </Clickable>
              </div>
            )}
            <button onClick={handleOpenFilePicker}>
              Choose a {props.step.with.sql_queryfile ? 'different ' : ''}query
              file
            </button>
          </div>
          <input
            accept=".sql"
            className="sr-only"
            type="file"
            ref={filePickerRef}
            onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                const [file] = e.target.files
                // @ts-ignore
                const relativePath = file.path.split(workspace)[1]
                // @ts-ignore
                handleSqlValueChange('sql_queryfile', relativePath)
              }
            }}
          />
        </FieldWithDescription>
        <SecretInput
          stepId={props.jobIndex.toString()}
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
