import * as vscode from 'vscode'
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

  context.subscriptions.push(FlatConfigEditor.register(context))

  const showPreviewDisposable = vscode.commands.registerCommand(
    'extension.showPreview',
    async () => {
      const workspaceRootUri = vscode.workspace.workspaceFolders?.[0].uri
      if (!workspaceRootUri) return
      const flatFileUri = vscode.Uri.joinPath(workspaceRootUri, 'flat.yml')

      const document = await vscode.workspace.openTextDocument(flatFileUri)
      await vscode.window.showTextDocument(document, {
        preview: false,
        viewColumn: 2,
      })
    }
  )

  context.subscriptions.push(showPreviewDisposable)
}
