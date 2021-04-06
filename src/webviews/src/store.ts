import produce, { Draft } from 'immer'
import create, { State, StateCreator } from 'zustand'
import type { FlatState } from '../../types'

const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config(fn => set(produce<T>(fn)), get, api)

interface ValidationError {
  path: string
  errors: string[]
  message: string
  type: string
}

type FlatStoreState = {
  state: FlatState
  workspace: string
  errors: ValidationError[]
  update: (fn: (draft: Draft<FlatStoreState>) => void) => void
  setErrors: (errors: ValidationError[]) => void
  files?: string[]
  isStubData: boolean
}

export const useFlatConfigStore = create<FlatStoreState>(
  immer(set => ({
    errors: [],
    workspace: '',
    isStubData: true,
    state: {
      name: 'Flat',
      on: {
        workflow_dispatch: undefined,
        push: undefined,
        schedule: [
          {
            cron: '0 * * * *',
          },
        ],
      },
      jobs: [],
    },
    update: fn => {
      set(fn)
    },
    setErrors: errors => {
      set(draft => {
        draft.errors = errors
      })
    },
    files: undefined,
  }))
)

export default useFlatConfigStore
