import React, { useEffect } from 'react'
import Jobs from './Jobs'
import useFlatConfigStore from './store'
import Triggers from './Triggers'
import { flatStateValidationSchema } from './validation'
import { VSCodeAPI } from './VSCodeAPI'

interface AppProps {}

function App({}: AppProps) {
  const { state, update, setErrors, errors } = useFlatConfigStore()

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
    console.log('state changed to', state)

    flatStateValidationSchema
      .validate(state, { abortEarly: false })
      .then(function () {
        console.log('valid!')
        setErrors([])
      })
      .catch(function (err) {
        setErrors(err.inner)
      })

    VSCodeAPI.postMessage(state)
  }, [state])

  return (
    <div className="p-6">
      <Triggers />
      <pre className="h-48 p-2 text-xs overflow-scroll">
        {/* @ts-ignore */}
        {JSON.stringify(errors, null, 2)}
      </pre>
      <Jobs />
    </div>
  )
}

export default App
