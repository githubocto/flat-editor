import React, { useEffect } from 'react'
import flatten from 'lodash-es/flatten'
import uniq from 'lodash-es/uniq'
import Jobs from './Jobs'
import useFlatConfigStore from './store'
import Triggers from './Triggers'
import { flatStateValidationSchema } from './validation'
import { VSCodeAPI } from './VSCodeAPI'
import { FlatStep, PullSqlConfig } from '../../types'
import { ErrorState } from './error-state'
import {
  VSCodeButton,
  VSCodeDivider,
  VSCodeLink,
} from '@vscode/webview-ui-toolkit/react'

interface AppProps {}

function App({}: AppProps) {
  const { state, setErrors, isStubData, gitRepo } = useFlatConfigStore()

  if (!gitRepo) {
    return <ErrorState />
  }

  const showErrorState = state.jobs.scheduled.steps
    .filter(step => step.uses.includes('githubocto/flat'))
    .some(step => {
      return !Boolean((step as FlatStep)?.with?.downloaded_filename)
    })

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
            if (!(step as FlatStep).with) return []
            if ((step as FlatStep).with.postprocess !== undefined) {
              files.push((step as FlatStep).with.postprocess)
            }
            if (((step as FlatStep).with as PullSqlConfig).sql_queryfile) {
              files.push(
                ((step as FlatStep).with as PullSqlConfig).sql_queryfile
              )
            }
            return files
          })
        ),
      ])
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

  const actionsUrl = gitRepo && `https://github.com/${gitRepo}/actions`

  return (
    <div className="p-8 space-y-6">
      <header>
        <div className="mb-2">
          <h1 className="text-[26px] leading-[30px] font-medium my-0">
            Flat Editor
          </h1>
        </div>
        <div className="mb-4">
          <p className="text-[13px] my-0">
            This is a gui for setting up a Flat Action, which will pull external
            data and update it using GitHub Actions.
          </p>
        </div>
        <VSCodeButton onClick={handleOpenRaw}>View the raw YAML</VSCodeButton>
      </header>
      <VSCodeDivider />
      <Triggers />
      <Jobs />
      <VSCodeDivider />
      <div>
        {showErrorState ? (
          <div className="text-[color:var(--vscode-errorForeground)] flex items-center">
            <span className="codicon codicon-warning" />
            <p className="ml-1 my-0">
              Make sure all of your steps have a{' '}
              <span className="font-bold">downloaded_filename</span> specified!
            </p>
          </div>
        ) : (
          <p className="my-0 flex items-center">
            Commit, push, and check out your new Action on
            <VSCodeLink className="mx-1" href={actionsUrl}>
              on GitHub
            </VSCodeLink>
            It should run automatically, once pushed.
          </p>
        )}
      </div>
    </div>
  )
}

export default App
