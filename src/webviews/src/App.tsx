import React, { useEffect } from 'react'
import useFlatConfigStore from './store'
import { VSCodeAPI } from './VSCodeAPI'

interface AppProps {}

function App({}: AppProps) {
  const { state, setTriggerSchedule } = useFlatConfigStore()

  // useEffect(() => {
  //   // communicate to extension that state has changed
  //   VSCodeAPI.onMessage(message => console.log('app', message))
  // }, [])

  useEffect(() => {
    console.log(state)
    VSCodeAPI.postMessage(state)
  }, [state])

  return (
    <div className="p-6">
      <div>
        Something:{' '}
        <input type="text" onChange={e => setTriggerSchedule(e.target.value)} />
      </div>
    </div>
  )
}

export default App
