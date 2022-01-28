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
import { VSCodeButton, VSCodeDivider } from '@vscode/webview-ui-toolkit/react'

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
    <div className="p-4">
      <header>
        <div className="mb-2">
          <h1 className="text-[26px] leading-[30px] font-medium my-0">
            Flat Editor
          </h1>
        </div>
        <div className="mb-4">
          <p className="text-[13px] font-medium my-0">
            This is a gui for setting up a Flat Action, which will pull external
            data and update it using GitHub Actions.
          </p>
        </div>
        <VSCodeButton onClick={handleOpenRaw}>View the raw YAML</VSCodeButton>
      </header>
      <div className="my-4">
        <VSCodeDivider />
      </div>
      <div className="space-y-6">
        <Triggers />
        <Jobs />
      </div>

      {showErrorState ? (
        <div className="border-2 border-vscode-editorOverviewRuler-warningForeground bg-vscode-settings-dropdownBackground text-sm p-4 flex items-center">
          <span className="codicon codicon-warning mr-1 text-vscode-editorOverviewRuler-warningForeground" />
          <p>
            Make sure all of your steps have a{' '}
            <strong>downloaded_filename</strong> specified!
          </p>
        </div>
      ) : (
        <div className="pt-4 pl-4 pb-6">
          <p className="text-lg font-bold pb-1">
            You're all set!{' '}
            <span
              className="codicon codicon-rocket pl-1"
              style={{ fontSize: '0.875rem' }}
            />
          </p>
          <p>
            Commit, push, and check out your new Action{' '}
            {actionsUrl ? (
              <span>
                <a className="underline" href={actionsUrl}>
                  on GitHub
                </a>
                .
              </span>
            ) : (
              'on GitHub.  '
            )}{' '}
            It should run automatically, once pushed.
          </p>
        </div>
      )}
    </div>
  )
}

export default App
