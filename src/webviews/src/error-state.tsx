import React, { useState } from 'react'
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'

import { VSCodeAPI } from './VSCodeAPI'

export function ErrorState() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRetry = () => {
    setIsRefreshing(true)
    VSCodeAPI.postMessage({
      type: 'refreshGitDetails',
    })
  }

  return (
    <div className="p-4">
      <p>
        Please ensure you're working out of a Git repository with a valid
        upstream remote set.
      </p>
      <div className="mt-2">
        <VSCodeButton disabled={isRefreshing} onClick={handleRetry}>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </VSCodeButton>
      </div>
    </div>
  )
}
