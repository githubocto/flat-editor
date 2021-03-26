import { nanoid } from 'nanoid'
import React, { FunctionComponent } from 'react'
import Header from './Header'
import Job from './Job'
import useFlatConfigStore from './store'

type JobsProps = {}

const Jobs: FunctionComponent<JobsProps> = props => {
  const { state, update } = useFlatConfigStore()

  const handleJobAdded = () => {
    update(store => {
      // Generate default job names
      // Make sure they don't collide with existing jobs
      let k = nanoid(6)
      const jobNames = store.state.jobs.map(j => j.name)
      while (jobNames.includes(k)) {
        k = nanoid(6)
      }
      store.state.jobs.push({
        name: k,
        job: {
          steps: [],
        },
      })
    })
  }

  const jobs = state.jobs.map((j, i) => <Job name={j.name} key={i} />)
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
      <div>{jobs}</div>
    </div>
  )
}

export default Jobs
