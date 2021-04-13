import React, { useEffect } from 'react'
import flatten from 'lodash-es/flatten'
import uniq from 'lodash-es/uniq'
import last from 'lodash-es/last'
import isEqual from 'lodash-es/isEqual'
import size from 'lodash-es/size'

import Jobs from './Jobs'
import useFlatConfigStore from './store'
import Triggers from './Triggers'
import { flatStateValidationSchema } from './validation'
import { VSCodeAPI } from './VSCodeAPI'
import { FlatCommitStep, FlatDownloadStep, PullSqlConfig } from '../../types'

interface AppProps {}

const stubLastStep: FlatCommitStep = {
  name: 'Commit data',
  type: 'commit',
  uses: 'githubocto/flat@main',
}

function App({}: AppProps) {
  const { state, setErrors, isStubData } = useFlatConfigStore()

  useEffect(() => {
    flatStateValidationSchema
      .validate(state, { abortEarly: false })
      .then(function () {
        setErrors([])
      })
      .catch(function (err) {
        setErrors(err.inner)
      })

    if (isStubData) return

    // Add push paths for all postprocessing files to "state"
    let cloned = { ...state }

    if (cloned.on.push) {
      // @ts-ignore
      cloned.on.push.paths = uniq([
        '.github/workflows/flat.yml',
        ...flatten(
          state.jobs.scheduled.steps.map(step => {
            let files = []
            if (!(step as FlatDownloadStep).with) return []
            if ((step as FlatDownloadStep).with.postprocess !== undefined) {
              files.push((step as FlatDownloadStep).with.postprocess)
            }
            if (
              ((step as FlatDownloadStep).with as PullSqlConfig).sql_queryfile
            ) {
              files.push(
                ((step as FlatDownloadStep).with as PullSqlConfig).sql_queryfile
              )
            }
            return files
          })
        ),
      ])
    }

    const lastStep = last(cloned.jobs.scheduled.steps)

    // Primitive check to see if the commit step is the last step in the workflow.
    if (
      !isEqual(lastStep, stubLastStep) &&
      size(cloned.jobs.scheduled.steps) > 3
    ) {
      const indexOfCommitStep = cloned.jobs.scheduled.steps.findIndex(step =>
        isEqual(step, stubLastStep)
      )

      if (indexOfCommitStep >= 0) {
        cloned.jobs.scheduled.steps.splice(indexOfCommitStep, 1)
        cloned.jobs.scheduled.steps.push(stubLastStep)
      }
    }

    VSCodeAPI.postMessage({
      type: 'updateText',
      data: cloned,
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
