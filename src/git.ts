import * as vscode from 'vscode'
import { API, GitExtension } from '../git'

const GitUrlParse = require('git-url-parse')

export class VSCodeGit {
  extension: GitExtension
  api: API

  constructor() {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports

    if (!gitExtension) {
      throw new Error('Git extension not found')
    }

    this.extension = gitExtension
    this.api = gitExtension.getAPI(1)
  }

  waitForRepo(): Promise<{ name: string; owner: string }> {
    let count = 0

    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        try {
          const remotes = this.repository.state.remotes
          if (remotes.length > 0) {
            const remote = remotes[0]
            const parsed = GitUrlParse(remote.pushUrl)
            resolve({ name: parsed.name, owner: parsed.owner })
          } else {
            if (count === 3) {
              clearInterval(interval)
              reject(new Error("Couldn't get repo details"))
            }
            count++
          }
        } catch (e) {
          reject(new Error("Couldn't get repo details"))
        }
      }, 1000)
    })
  }

  get repoDetails() {
    const remotes = this.repository.state.remotes
    if (remotes.length === 0) {
      throw new Error(
        "No remotes found. Are you sure you've created an upstream repo?"
      )
    }

    const remote = remotes[0]
    const parsed = GitUrlParse(remote.pushUrl)
    return {
      name: parsed.name,
      owner: parsed.owner,
    }
  }

  get repository() {
    return this.api.repositories[0]
  }

  get workingTreeChanges() {
    if (!this.repository) {
      throw new Error("No repository found. Are you sure you're in a repo?")
    }

    return this.repository.state.workingTreeChanges
  }
}
