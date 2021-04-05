import React, { useEffect } from 'react'
import omit from 'lodash-es/omit'
import Jobs from './Jobs'
import useFlatConfigStore from './store'
import Triggers from './Triggers'
import { flatStateValidationSchema } from './validation'
import { VSCodeAPI } from './VSCodeAPI'

interface AppProps {}

function App({}: AppProps) {
  const { state, setErrors } = useFlatConfigStore()

  useEffect(() => {
    flatStateValidationSchema
      .validate(state, { abortEarly: false })
      .then(function () {
        setErrors([])
      })
      .catch(function (err) {
        setErrors(err.inner)
      })

    // Convert jobs ARRAY to jobs OBJECT
    const transformedJobs = state.jobs.reduce((acc, next) => {
      // @ts-ignore
      acc[next.name] = {
        ...omit(next, 'name'),
      }
      return acc
    }, {})

    const transformedState = {
      ...state,
      jobs: transformedJobs,
    }

    VSCodeAPI.postMessage({
      type: 'updateText',
      data: transformedState,
    })
  }, [state])

  const handleOpenRaw = () => {
    VSCodeAPI.postMessage({
      type: 'openEditor',
      data: { isPreview: false, onSide: false },
    })
  }

  return (
    <div className="p-4">
      <div className="mb-2 p-4">
        <h1 className="text-2xl font-bold text-vscode-settings-headerForeground py-2">
          Flat Editor
        </h1>
        <p className="mb-2">
          This is a gui for setting up a Flat Action, which will pull external
          data and update it using GitHub Actions.
        </p>
        <button onClick={handleOpenRaw}>View the raw YAML</button>
      </div>
      <Triggers />
      <Jobs />
    </div>
  )
}

export default App
