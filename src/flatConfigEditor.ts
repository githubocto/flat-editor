import * as vscode from 'vscode'
import { parse, stringify } from 'yaml'
import { debounce } from 'ts-debounce'

import { Octokit } from '@octokit/rest'
import { VSCodeGit } from './git'
import { getNonce, getSession } from './lib'
import type { FlatState } from './types'

const sodium = require('tweetsodium')

export class FlatConfigEditor implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new FlatConfigEditor(context)
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      FlatConfigEditor.viewType,
      provider
    )
    return providerRegistration
  }

  private static readonly viewType = 'flat.config'

  constructor(private readonly context: vscode.ExtensionContext) {}

  // Called when our custom editor is opened.
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    const updateWebview = async (document: vscode.TextDocument) => {
      if (vscode.window.activeTextEditor) {
        webviewPanel.webview.html = await this.getHtmlForWebview(
          webviewPanel.webview
        )
      } else {
        const rawFlatYaml = document.getText()
        const parsedConfig = parse(rawFlatYaml)

        webviewPanel.webview.postMessage({
          command: 'updateState',
          config: parsedConfig,
        })
      }
    }

    const changeDocumentSubscription = vscode.workspace.onDidSaveTextDocument(
      e => {
        if (e.uri.toString() === document.uri.toString()) {
          updateWebview(e)
        }
      }
    )

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose()
    })

    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    }

    webviewPanel.webview.html = await this.getHtmlForWebview(
      webviewPanel.webview
    )

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(async e => {
      switch (e.type) {
        case 'openEditor':
          this.showEditor(e.data)
          break
        case 'updateText':
          this.updateTextDocument(document, e.data)
          break
        case 'storeSecret':
          this.storeSecret(webviewPanel, e.data)
          break
        case 'previewFile':
          const workspaceRootUri = vscode.workspace.workspaceFolders?.[0].uri
          if (!workspaceRootUri) {
            return
          }
          const uri = vscode.Uri.joinPath(workspaceRootUri, e.data)
          const doc = await vscode.workspace.openTextDocument(uri)
          vscode.window.showTextDocument(doc)
          break
        default:
          break
      }
    })
  }

  /**
   * Get the static html used for the editor webviews.
   */
  private async getHtmlForWebview(webview: vscode.Webview): Promise<string> {
    // Local path to script and css for the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'out/webviews/index.js')
    )

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'out/webviews/index.css')
    )

    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        'node_modules',
        'vscode-codicons',
        'dist',
        'codicon.css'
      )
    )
    const codiconsFontUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        'node_modules',
        'vscode-codicons',
        'dist',
        'codicon.ttf'
      )
    )

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce()

    const workspaceRootUri = vscode.workspace.workspaceFolders?.[0].uri
    if (!workspaceRootUri) {
      throw new Error('No workspace open')
    }

    const flatFileUri = vscode.Uri.joinPath(
      workspaceRootUri,
      '.github/workflows',
      'flat.yml'
    )
    const document = await vscode.workspace.openTextDocument(flatFileUri)
    const rawFlatYaml = document.getText()
    const parsedConfig = parse(rawFlatYaml)
    const stringifiedConfig = encodeURIComponent(JSON.stringify(parsedConfig))

    const dirName = workspaceRootUri.path.substring(
      workspaceRootUri.path.lastIndexOf('/') + 1
    )

    return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} 'self' data:; style-src ${webview.cspSource} ${codiconsUri}; script-src 'nonce-${nonce}'; font-src ${codiconsFontUri};">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">


				<link href="${styleVSCodeUri}" rel="stylesheet" />
        <link href="${codiconsUri}" rel="stylesheet" />
        <script nonce="${nonce}">
          window.acquireVsCodeApi = acquireVsCodeApi;
        </script>

				<title>Flat Editor</title>
			</head>
			<body>
				<div data-workspace="${dirName}" data-config="${stringifiedConfig}" id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
  }

  private saveDocument(document: vscode.TextDocument) {
    if (document.isDirty) {
      document.save()
    }
  }

  debouncedSave = debounce(this.saveDocument, 300)

  /**
   * Write out the yaml to a given document.
   */
  private async updateTextDocument(document: vscode.TextDocument, data: any) {
    // todo
    const edit = new vscode.WorkspaceEdit()
    const currentText = document.getText()
    const newText = this.serializeWorkflow(data)
    if (currentText === newText) return

    // Replaces the entire document every time
    // TODO, maybe: more specific edits
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      newText
    )
    await vscode.workspace.applyEdit(edit)
    this.debouncedSave(document)
  }

  private serializeWorkflow(data: FlatState): string {
    // const doc: FlatYamlDoc = {
    //   name: 'Flat',
    //   on: {
    //     workflow_dispatch: null,
    //   },
    //   jobs: {},
    // }
    // if (data.triggerPush) {
    //   doc.on.push = null
    // }
    // if (data.triggerSchedule) {
    //   doc.on.schedule = [
    //     {
    //       cron: data.triggerSchedule,
    //     },
    //   ]
    // }

    // data.jobs.forEach(j => {
    //   doc.jobs[j.name] = {
    //     'runs-on': 'ubuntu-latest',
    //     steps: [
    //       {
    //         name: 'Checkout repo',
    //         uses: 'actions/checkout@v2',
    //       },
    //       ...j.job.steps,
    //     ],
    //   }
    // })
    const serialized = stringify(data)
    return serialized
  }

  private async storeSecret(
    webviewPanel: vscode.WebviewPanel,
    data: SecretData
  ) {
    const { fieldName, value } = data

    let session = await getSession({
      createIfNone: true,
    })

    // if (!session) {
    //   session = await getSession({
    //     createIfNone: true,
    //   })
    // }

    if (!session) return

    const gitClient = new VSCodeGit()
    await gitClient.activateExtension()

    // Next, let's grab the repo name.
    const { name, owner } = gitClient.repoDetails

    const octokit = new Octokit({
      auth: session.accessToken,
    })
    // Go time! Let's create a secret for the encrypted conn string.
    const keyRes = await octokit.actions.getRepoPublicKey({
      owner,
      repo: name,
    })
    const key = keyRes.data.key
    // Convert the message and key to Uint8Array's (Buffer implements that interface)
    const messageBytes = Buffer.from(value)
    const keyBytes = Buffer.from(key, 'base64')
    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(messageBytes, keyBytes)
    // Base64 the encrypted secret
    const encrypted = Buffer.from(encryptedBytes).toString('base64')
    const keyId = keyRes.data.key_id
    try {
      await octokit.actions.createOrUpdateRepoSecret({
        owner: owner,
        repo: name,
        secret_name: fieldName,
        encrypted_value: encrypted,
        key_id: keyId,
      })

      await webviewPanel.webview.postMessage({
        command: 'storeSecretResponse',
        fieldName,
        status: 'success',
      })
    } catch (e) {
      await vscode.window.showErrorMessage(
        "Oh no! We weren't able to create a secret for your connection string."
      )
      await webviewPanel.webview.postMessage({
        command: 'storeSecretResponse',
        fieldName,
        status: 'error',
      })
    }
  }

  public showEditor = ({
    isPreview = false,
    onSide = false,
  }: ShowEditorOptions): void => {
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
}

interface ShowEditorOptions {
  isPreview?: boolean
  onSide?: boolean
}
interface SecretData {
  fieldName: string
  value: string
}
