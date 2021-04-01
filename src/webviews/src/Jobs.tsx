import React, { FunctionComponent } from 'react'
import Header from './Header'
import { Job } from './Job'
import useFlatConfigStore from './store'

type JobsProps = {}

const Jobs: FunctionComponent<JobsProps> = props => {
  const { state, update } = useFlatConfigStore()

  const handleJobAdded = () => {
    update(store => {
      console.log(store.state)
      store.state.jobs.push({
        name: '',
        runs_on: 'ubuntu-latest',
        steps: [{ name: 'Check out repo', uses: 'actions/checkout@v2' }],
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
        <button onClick={handleJobAdded}>
          <span className="codicon codicon-add pr-2" /> Add a job
        </button>
      </Header>
      <div className="p-4 border border-vscode-contrastBorder">{jobs}</div>
    </div>
  )
}

export default Jobs
