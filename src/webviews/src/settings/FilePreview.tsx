import React, { FunctionComponent } from 'react'
import { VSCodeAPI } from '../VSCodeAPI'

type FilePreviewProps = {
  file: string
}

export const FilePreview: FunctionComponent<FilePreviewProps> = props => {
  const { file } = props
  const fileRef = React.useRef('')
  const [fileContent, setFileContent] = React.useState(undefined)

  React.useEffect(() => {
    setFileContent(undefined)
    fileRef.current = file
    VSCodeAPI.postMessage({
      type: 'getFileContents',
      data: file,
    })
  }, [file])

  React.useEffect(() => {
    window.addEventListener('message', e => {
      const message = e.data
      if (message.command !== 'returnFileContents') return
      if (message.file !== fileRef.current) return
      setFileContent(message.contents)
    })
  }, [])

  return (
    <code className="block bg-vscode-notebook-rowHoverBackground p-2 px-3 text-xs max-h-24 overflow-auto whitespace-pre-wrap">
      {fileContent}
    </code>
  )
}
