import React, { FunctionComponent } from 'react'

import Header from './Header'
import { Step } from './Step'
import useFlatConfigStore from './store'
import type { FlatStep } from './../../types'
import { VSCodeButton, VSCodeDivider } from '@vscode/webview-ui-toolkit/react'

interface JobsProps {}

const STEP_STUBS = {
  http: {
    name: 'Fetch data',
    uses: 'githubocto/flat@v3',
    with: {
      http_url: '',
    },
  },
  sql: {
    name: 'Fetch data',
    uses: 'githubocto/flat@v3',
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
      // @ts-ignore
      store.state.jobs.scheduled.steps.push(STEP_STUBS[type])
    })
  }

  const steps = state.jobs.scheduled.steps
    .slice(2)
    .map((j, i) => <Step index={i + 2} step={j as FlatStep} key={i} />)

  return (
    <div>
      <header>
        <div className="mb-2">
          <h2 className="my-0 text-[20px] leading-[30px] font-normal">
            Where to get data from
          </h2>
        </div>
        <p className="text-[13px] my-0">
          Flat can fetch data from HTTP endpoints or SQL queries.
        </p>
      </header>
      <section className="mt-4">
        <div className="space-y-6">{steps}</div>
      </section>
      <footer className="mt-4">
        <div className="font-bold pb-2">
          Add {state.jobs.scheduled.steps.length ? 'another' : 'a'} data source
        </div>
        <div className="flex items-center space-x-2">
          <VSCodeButton onClick={() => handleJobAdded('http')}>
            <span className="codicon codicon-add" slot="start" /> HTTP
          </VSCodeButton>
          <VSCodeButton onClick={() => handleJobAdded('sql')}>
            <span className="codicon codicon-add pr-1" slot="start" />
            SQL
          </VSCodeButton>
        </div>
      </footer>
    </div>
  )
}

export default Jobs
