import React, { FunctionComponent } from 'react'

type JobProps = {
  name: string
}

const Job: FunctionComponent<JobProps> = props => {
  return (
    <div>
      <div className="text-xl font-normal">{props.name}</div>
    </div>
  )
}

export default Job
