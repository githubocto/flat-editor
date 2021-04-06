import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { useFlatConfigStore } from './store'
import './vscode.css'
import { VSCodeAPI } from './VSCodeAPI'

// TODO: Type the incoming config data
let config: any = {}
let workspace = ''

const root = document.getElementById('root')

function transformConfig(config: any) {
  if (!config)
    config = {
      on: {
        workflow_dispatch: {},
      },
    }
  if (!config.on) config.on = {}
  if (!config.jobs) config.jobs = {}

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

  return config
}

if (root) {
  config = JSON.parse(
    decodeURIComponent(root.getAttribute('data-config') || '')
  )

  workspace = root.getAttribute('data-workspace') || ''

  config = transformConfig(config)
}

useFlatConfigStore.setState({
  // @ts-ignore
  state: config,
  workspace,
})

VSCodeAPI.postMessage({
  type: 'refreshFiles',
})

window.addEventListener('message', e => {
  // @ts-ignore
  const message = e.data
  if (message.command === 'updateState') {
    useFlatConfigStore.setState({
      state: transformConfig(message.config),
    })
  } else if (message.command === 'updateFiles') {
    useFlatConfigStore.setState({
      files: message.files,
    })
  }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
