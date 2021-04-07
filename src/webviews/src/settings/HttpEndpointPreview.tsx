import React, { FunctionComponent } from 'react'
import { VSCodeAPI } from '../VSCodeAPI'
import { debounce } from 'ts-debounce'

type HttpEndpointPreviewProps = {
  url: string
}

export const HttpEndpointPreview: FunctionComponent<HttpEndpointPreviewProps> = props => {
  const { url } = props
  const urlRef = React.useRef('')
  const [fileContent, setFileContent] = React.useState(undefined)

  const fetchData = async () => {
    VSCodeAPI.postMessage({
      type: 'getUrlContents',
      data: urlRef.current,
    })
  }
  const debounceFetchData = React.useCallback(debounce(fetchData, 600), [])

  React.useEffect(() => {
    urlRef.current = url
    setFileContent(undefined)
    debounceFetchData()
  }, [url])

  React.useEffect(() => {
    window.addEventListener('message', e => {
      const message = e.data
      if (message.command !== 'returnUrlContents') return
      if (message.url !== urlRef.current) return
      setFileContent(message.contents)
    })
  }, [])

  if (!fileContent) return null

  return (
    <pre className="block bg-vscode-notebook-rowHoverBackground p-2 px-3 text-xs max-h-24 overflow-auto whitespace-normal w-full">
      <code>{(fileContent || '').slice(0, 100000)}</code>
    </pre>
  )
}
