import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { stringify } from 'yaml'

import { FlatConfigEditor } from './flatConfigEditor'

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "helloworld-sample" is now active!'
  )

  const disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World!')
    }
  )

  context.subscriptions.push(disposable)

  const editor = FlatConfigEditor.register(context)
  context.subscriptions.push(editor)

  const showEditor = ({ isPreview = false, onSide = false }) => () => {
    const workspaceRootUri = vscode.workspace.workspaceFolders?.[0].uri
    if (!workspaceRootUri) return
    const flatFileUri = vscode.Uri.joinPath(
      workspaceRootUri,
      '.github/workflows',
      'flat.yml'
    )

    vscode.commands.executeCommand(
      'vscode.openWith',
      flatFileUri,
      isPreview ? 'flat.config' : 'default',
      onSide ? { viewColumn: vscode.ViewColumn.Beside, preview: false } : {}
    )
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.showPreview',
      showEditor({ isPreview: true, onSide: false })
    )
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.showRaw',
      showEditor({ isPreview: false, onSide: false })
    )
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.showPreviewToSide',
      showEditor({ isPreview: true, onSide: true })
    )
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.showRawToSide',
      showEditor({ isPreview: false, onSide: true })
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.initializeFlatYml', async () => {
      let rootPath: vscode.WorkspaceFolder
      const folders = vscode.workspace.workspaceFolders

      if (!folders) {
        return
      }
      rootPath = folders[0]

      const workflowsDir = path.join(rootPath.uri.path, '.github/workflows')
      const flatYmlPath = path.join(workflowsDir, 'flat.yml')

      if (fs.existsSync(flatYmlPath)) {
        vscode.window.showInformationMessage(
          'flat.yml already exists! Opening it for you...'
        )
        showEditor({ isPreview: true })()
        return
      }

      fs.mkdirSync(workflowsDir, { recursive: true })

      const flatStub = {
        name: 'data',
        on: {},
        jobs: {},
      }

      fs.writeFileSync(path.join(workflowsDir, 'flat.yml'), stringify(flatStub))
      showEditor({ isPreview: true })()
    })
  )
}
