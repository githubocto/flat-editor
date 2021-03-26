import React, { FunctionComponent } from 'react'
import Header from './Header'
import Job from './Job'
import useFlatConfigStore from './store'

type JobsProps = {}

const Jobs: FunctionComponent<JobsProps> = props => {
  const { state, update } = useFlatConfigStore()

  const handleJobAdded = () => {
    update(store => {
      store.state.jobs.push({
        name: '',
        job: {
          steps: [],
        },
      })
    })
  }

  // TODO: figure out which kind each job, maybe at deserialization time instead thought?
  const jobs = state.jobs.map((j, i) => (
    <Job name={j.name} type="pull" key={i} />
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
