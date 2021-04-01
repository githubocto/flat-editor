import React, { FunctionComponent } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import Header from './Header'
import { Job } from './Job'
import useFlatConfigStore from './store'

interface JobsProps {}

const STEP_STUBS = {
  http: {
    name: 'Fetch data',
    uses: 'githubocto/flat@main',
    with: {
      outfile_basename: '',
      http_url: '',
    },
  },
  sql: {
    name: 'Fetch data',
    uses: 'githubocto/flat@main',
    with: {
      outfile_basename: '',
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
        runs_on: 'ubuntu-latest',
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
        title="Jobs"
        description="Jobs consist of one or more steps. Mutliple jobs are executed in parallel."
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <span className="codicon codicon-add pr-2" /> Add a job
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            align="start"
            sideOffset={10}
            className="w-full min-w-[100px] bg-vscode-extensionButton-prominentBackground z-10"
          >
            <DropdownMenu.Item
              className="text-extensionButton-prominentForeground p-2"
              onSelect={() => handleJobAdded('http')}
            >
              HTTP
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="text-extensionButton-prominentForeground p-2"
              onSelect={() => handleJobAdded('sql')}
            >
              SQL
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Header>
      <div className="p-4 border border-vscode-contrastBorder">{jobs}</div>
    </div>
  )
}

export default Jobs
