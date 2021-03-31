import React, { useEffect } from 'react'
import Jobs from './Jobs'
import useFlatConfigStore from './store'
import Triggers from './Triggers'
import { flatStateValidationSchema } from './validation'
import { VSCodeAPI } from './VSCodeAPI'

interface AppProps {}

function App({}: AppProps) {
  const { state, update, setErrors } = useFlatConfigStore()

  useEffect(() => {
    flatStateValidationSchema
      .validate(state, { abortEarly: false })
      .then(function () {
        setErrors([])
      })
      .catch(function (err) {
        setErrors(err.inner)
      })

    VSCodeAPI.postMessage({
      type: 'updateText',
      data: state,
    })
  }, [state])

  return (
    <div className="p-6">
      <Triggers />
      <Jobs />
    </div>
  )
}

export default App
