import React, { useEffect } from 'react'
import omit from 'lodash-es/omit'
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

  return (
    <div className="p-6">
      <Triggers />
      <Jobs />
    </div>
  )
}

export default App
