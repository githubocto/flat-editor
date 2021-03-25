import React, { useEffect } from 'react'
import useFlatConfigStore from './store'
import Triggers from './Triggers'
import { VSCodeAPI } from './VSCodeAPI'

interface AppProps {}

function App({}: AppProps) {
  const update = useFlatConfigStore(state => state.update)
  const state = useFlatConfigStore(state => state.state)

  // useEffect(() => {
  //   // communicate to extension that state has changed
  //   VSCodeAPI.onMessage(message => console.log('app', message))
  // }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(store => {
      store.state.triggerSchedule = e.target.value
    })
  }

  useEffect(() => {
    console.log('State updated: ', state)
    VSCodeAPI.postMessage(state)
  }, [state])

  return (
    <div className="p-6">
      <Triggers />
    </div>
  )
}

export default App
