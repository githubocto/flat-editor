import React, { FunctionComponent } from 'react'

import Header from './Header'
import { Step } from './Step'
import useFlatConfigStore from './store'
import type { FlatDownloadStep } from './../../types'

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
      // @ts-ignore
      store.state.jobs.scheduled.steps.splice(
        store.state.jobs.scheduled.steps.length - 1,
        0,
        step
      )
    })
  }

  const steps = state.jobs.scheduled.steps
    .slice(2, state.jobs.scheduled.steps.length - 1)
    .map((j, i) => <Step index={i + 2} step={j as FlatDownloadStep} key={i} />)

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
