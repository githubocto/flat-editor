import React, { FunctionComponent } from 'react'

import Header from './Header'
import { Step } from './Step'
import useFlatConfigStore from './store'
import type { FlatDownloadStep } from './../../types'
import size from 'lodash-es/size'

interface JobsProps {}

const STEP_STUBS = {
  http: {
    name: 'Fetch data',
    uses: 'githubocto/flat@v1',
    with: {
      http_url: '',
    },
  },
  sql: {
    name: 'Fetch data',
    uses: 'githubocto/flat@v1',
    with: {
      sql_connstring: '',
      sql_queryfile: '',
    },
  },
}

const Jobs: FunctionComponent<JobsProps> = props => {
  const { state, update } = useFlatConfigStore()

  const handleJobAdded = (type: 'http' | 'sql') => {
    update(store => {
      const step = STEP_STUBS[type] as FlatDownloadStep
      store.state.jobs.scheduled.steps.splice(
        size(store.state.jobs.scheduled.steps) - 1,
        0,
        step
      )
    })
  }

  const steps = state.jobs.scheduled.steps
    .slice(2)
    .filter(step => {
      if ('type' in step && step.type === 'commit') {
        return false
      }

      return true
    })
    .map((step, i) => {
      return <Step index={i + 2} step={step as FlatDownloadStep} key={i} />
    })

  return (
    <div className="text-vscode-foreground">
      <Header
        title="Where to get data from"
        description="Flat can fetch data from HTTP endpoints or SQL queries."
        hasHoverState={false}
      >
        {steps}

        <div className="font-bold pb-2">
          Add {state.jobs.scheduled.steps.length ? 'another' : 'a'} data source
        </div>
        <div className="flex">
          <button
            className="text-extensionButton-prominentForeground p-2"
            style={{ marginRight: 1 }}
            onClick={() => handleJobAdded('http')}
          >
            <span
              className="codicon codicon-add pr-1"
              style={{ fontSize: '0.875rem' }}
            />{' '}
            HTTP
          </button>
          <button
            className="text-extensionButton-prominentForeground p-2"
            onClick={() => handleJobAdded('sql')}
          >
            <span
              className="codicon codicon-add pr-1"
              style={{ fontSize: '0.875rem' }}
            />{' '}
            SQL
          </button>
        </div>
      </Header>
    </div>
  )
}

export default Jobs
