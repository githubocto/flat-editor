import * as vscode from 'vscode'
import { stringify } from 'yaml'
import { getNonce } from './lib'
import type { FlatState, FlatYamlDoc } from './types'

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
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    }
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview)

    // function updateWebview() {
    //   const data = parse(document.getText())
    //   webviewPanel.webview.postMessage({
    //     type: 'update',
    //     text: JSON.stringify(data, null, 2),
    //   })
    // }

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    // const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
    //   e => {
    //     if (e.document.uri.toString() === document.uri.toString()) {
    //       updateWebview()
    //     }
    //   }
    // )

    // // Make sure we get rid of the listener when our editor is closed.
    // webviewPanel.onDidDispose(() => {
    //   changeDocumentSubscription.dispose()
    // })

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(e => {
      this.updateTextDocument(document, e)
    })

    // updateWebview()
  }

  /**
   * Get the static html used for the editor webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
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

				<title>Cat Scratch</title>
			</head>
			<body>
				<div id="root"></div>			
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
  }

  /**
   * Write out the yaml to a given document.
   */
  private updateTextDocument(document: vscode.TextDocument, data: any) {
    // todo
    const edit = new vscode.WorkspaceEdit()

    console.log(data)

    // Replaces the entire document every time
    // TODO, maybe: more specific edits
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      this.serializeWorkflow(data)
    )

    return vscode.workspace.applyEdit(edit)
  }

  private serializeWorkflow(data: FlatState): string {
    const doc: FlatYamlDoc = {
      name: 'Flat',
      on: {
        workflow_dispatch: null,
      },
      jobs: {},
    }
    if (data.triggerPush) {
      doc.on.push = null
    }
    if (data.triggerSchedule) {
      doc.on.schedule = [
        {
          cron: data.triggerSchedule,
        },
      ]
    }

    data.jobs.forEach(j => {
      doc.jobs[j.name] = {
        'runs-on': 'ubuntu-latest',
        steps: [
          {
            name: 'Checkout repo',
            uses: 'actions/checkout@v2',
          },
          ...j.job.steps,
        ],
      }
    })
    const serialized = stringify(doc)
    console.log('Doc is: ', serialized)
    return serialized
  }
}
