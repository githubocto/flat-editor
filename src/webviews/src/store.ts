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
  errors: ValidationError[]
  update: (fn: (draft: Draft<FlatStoreState>) => void) => void
  setErrors: (errors: ValidationError[]) => void
  // setTriggerSchedule: (schedule: string) => void
}

export const useFlatConfigStore = create<FlatStoreState>(
  immer(set => ({
    errors: [],
    state: {
      name: 'Flat',
      on: {
        workflow_dispatch: undefined,
        push: undefined,
        schedule: {
          cron: '0 * * * *',
        },
      },
      jobs: {},
      // triggerDispatch: false,
      // triggerPush: false,
      // triggerSchedule: '0 * * * *',
      // jobs: [],
    },
    update: fn => {
      set(fn)
    },
    setErrors: errors => {
      set(draft => {
        draft.errors = errors
      })
    },
  }))
)

export default useFlatConfigStore

// export const sanitizeFlatState = (state: FlatState) => {
//   let sanitizedState = { ...state }
//   sanitizedState.name = sanitizedState.name || ''
//   sanitizedState.on = sanitizedState.on || {}
//   sanitizedState.jobs = sanitizedState.jobs || {}
//   return sanitizedState
// }
