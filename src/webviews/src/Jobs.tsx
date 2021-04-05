import React, { FunctionComponent } from 'react'

import Header from './Header'
import { Job } from './Job'
import useFlatConfigStore from './store'

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
      sql_format: 'csv',
    },
  },
}

const Jobs: FunctionComponent<JobsProps> = props => {
  const { state, update } = useFlatConfigStore()

  const handleJobAdded = (type: 'http' | 'sql') => {
    update(store => {
      store.state.jobs.push({
        name: '',
        'runs-on': 'ubuntu-latest',
        steps: [
          {
            name: 'Check out repo',
            uses: 'actions/checkout@v2',
          },
          // @ts-ignore
          STEP_STUBS[type],
        ],
      })
    })
  }

  const jobs = state.jobs.map((j, i) => (
    <Job index={i} name={j.name} type="pull" key={i} />
  ))

  return (
    <div className="text-vscode-foreground">
      <Header
        title="Where to get data from"
        description="Flat can fetch data from HTTP endpoints or SQL queries."
        hasHoverState={false}
      >
        {jobs}

        <div className="font-bold pb-2">
          Add {state.jobs.length ? 'another' : 'a'} data source
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
