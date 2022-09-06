// @ts-ignore
import * as vscode from 'vscode'

export type PullBaseConfig = {
  downloaded_filename?: string
  postprocess?: string
}
export type PullHttpConfig = {
  http_url: string
} & PullBaseConfig

export type PullSqlConfig = {
  sql_connstring: string
  sql_queryfile: string
} & PullBaseConfig

export type PullConfig = PullHttpConfig | PullSqlConfig

export type PushConfig = {} // TODO: once we have a push action

export type PullStep = {
  name: string
  uses: 'githubocto/flat-pull@v1'
  with: PullConfig
}

export type PushStep = {
  name: string
  uses: 'githubocto/flat-push@v1'
  with: PushConfig
}

export type CheckoutStep = {
  name: string
  uses: 'actions/checkout@v2'
}

export type FlatStep = {
  name: 'Fetch data'
  uses: 'githubocto/flat@main'
  with: PullConfig
}

export type DenoStep = {
  name: 'Setup deno'
  uses: 'denoland/setup-deno@main'
  with: {
    'deno-version': 'v1.10.x'
  }
}

export type Step = CheckoutStep | FlatStep | DenoStep

export type FlatJob = {
  'runs-on': string
  steps: Step[]
}

interface OnFlatState {
  workflow_dispatch?: any
  push?: {
    paths: string[]
  }
  schedule: {
    cron: string
  }[]
}
export type FlatState = {
  name: string
  on: OnFlatState
  jobs: {
    scheduled: {
      steps: Step[]
    }
  }
}

export type FlatYamlStep = {
  name: string
  uses: string
  with?: {
    [k: string]: string
  }
}

export type FlatYamlJob = {
  'runs-on': 'ubuntu-latest'
  steps: [
    {
      name: 'Setup deno'
      uses: 'denoland/setup-deno@main'
      with: {
        'deno-version': 'v1.10.x'
      }
    },
    {
      name: 'Checkout repo'
      uses: 'actions/checkout@v2'
    },
    ...Array<FlatYamlStep>
  ]
}

export type FlatYamlDoc = {
  name: 'Flat'
  on: {
    push?: {
      paths: ['.github/workflows/flat.yml']
    }
    workflow_dispatch: null
    schedule?: [
      {
        cron: string
      }
    ]
  }
  jobs: {
    scheduled: FlatYamlJob
  }
}
