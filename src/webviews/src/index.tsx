import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { useFlatConfigStore } from './store'
import './vscode.css'

// TODO: Type the incoming config data
let config: any = {}
let workspace = ''

const root = document.getElementById('root')

if (root) {
  config = JSON.parse(
    decodeURIComponent(root.getAttribute('data-config') || '')
  )

  workspace = root.getAttribute('data-workspace') || ''

  // TODO: We need to translate the jobs OBJECT to a jobs ARRAY
  const jobNames = config.hasOwnProperty('jobs') ? Object.keys(config.jobs) : []

  if (jobNames.length) {
    console.log('we are transforming the incoming data')

    config.jobs = jobNames.map(jobName => {
      return {
        name: jobName,
        ...config.jobs[jobName],
      }
    })
  } else {
    config.jobs = []
  }
}

useFlatConfigStore.setState({
  // @ts-ignore
  state: config,
  workspace,
})

ReactDOM.render(
  <React.StrictMode>
    {workspace}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
