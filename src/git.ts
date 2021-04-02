import * as vscode from 'vscode'
import { GitAPI } from './types'

const GitUrlParse = require('git-url-parse')

interface GitExtension {
  getAPI(version: number): GitAPI
}

export class VSCodeGit {
  extension: vscode.Extension<GitExtension>

  constructor() {
    const gitExtension = vscode.extensions.getExtension('vscode.git')

    if (!gitExtension) {
      throw new Error('Git extension not found')
    }

    this.extension = gitExtension
  }

  async activateExtension() {
    await this.extension.activate()
  }

  get rawGit() {
    // Unsure about this magic number, but it works.
    return this.extension.exports.getAPI(1)
  }

  waitForRepo(times: number): Promise<{ name: string; owner: string }> {
    let count = 0
    const timeToStop = count === times

    return new Promise((resolve, reject) => {
      const checkRepoExists = setInterval(() => {
        try {
          const remotes = this.repository._repository.remotes
          if (remotes.length > 0) {
            const remote = remotes[0]
            const parsed = GitUrlParse(remote.pushUrl)
            resolve({ name: parsed.name, owner: parsed.owner })
          } else {
            if (timeToStop) {
              reject(new Error("Couldn't get repo details"))
            }
            count++
          }
        } catch (e) {
          reject(new Error("Couldn't get repo details"))
        } finally {
          clearInterval(checkRepoExists)
        }
      }, 1000)
    })
  }

  get repoDetails() {
    const remotes = this.repository._repository.remotes
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
    return this.rawGit.repositories[0]
  }

  get workingTreeChanges() {
    if (!this.repository) {
      throw new Error("No repository found. Are you sure you're in a repo?")
    }

    return this.repository.state.workingTreeChanges
  }

  add(resources: vscode.Uri[]) {
    if (!this.repository) {
      throw new Error("No repository found. Are you sure you're in a repo?")
    }

    this.repository._repository.add(resources)
  }

  commit(message: string) {
    if (!this.repository) {
      throw new Error("No repository found. Are you sure you're in a repo?")
    }

    this.repository._repository.commit(message)
  }
}
