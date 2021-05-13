import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { useFlatConfigStore } from './store'
import './vscode.css'
import { VSCodeAPI } from './VSCodeAPI'

// TODO: Type the incoming config data
let config: any = {}
let workspace = ''
let gitRepo = ''

const root = document.getElementById('root')

function transformConfig(config: any) {
  if (!config)
    config = {
      on: {
        workflow_dispatch: {},
        push: {
          paths: ['.github/workflows/flat.yml'],
        },
      },
    }
  if (!config.on) config.on = {}
  if (!config.on.push) config.on.push = {}
  if (!config.on.push.paths) config.on.push.paths = []
  if (!config.jobs) config.jobs = {}
  if (!config.jobs.scheduled)
    config.jobs.scheduled = {
      'runs-on': 'ubuntu-latest',
      steps: [
        {
          name: 'Setup deno',
          uses: 'denoland/setup-deno@main',
          with: {
            'deno-version': 'v1.x'
          }
        },
        {
          name: 'Check out repo',
          uses: 'actions/checkout@v2',
        },
      ],
    }

  return config
}

config = transformConfig(config)

if (root) {
  workspace = root.getAttribute('data-workspace') || ''
  gitRepo = root.getAttribute('data-gitrepo') || ''
}

useFlatConfigStore.setState({
  // @ts-ignore
  state: config,
  workspace,
  gitRepo,
  isStubData: true,
})

VSCodeAPI.postMessage({
  type: 'refreshFiles',
})

VSCodeAPI.postMessage({
  type: 'refreshState',
})

window.addEventListener('message', e => {
  // @ts-ignore
  const message = e.data
  if (message.command === 'updateState') {
    useFlatConfigStore.setState({
      state: transformConfig(message.config),
      isStubData: false,
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
