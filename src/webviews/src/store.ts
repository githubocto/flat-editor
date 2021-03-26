import produce, { Draft } from 'immer'
import create, { State, StateCreator } from 'zustand'
import type { FlatState } from '../../types'

const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config(fn => set(produce<T>(fn)), get, api)

type FlatStoreState = {
  state: FlatState
  errors: object
  update: (fn: (draft: Draft<FlatStoreState>) => void) => void
  setErrors: (errors: object) => void
  // setTriggerSchedule: (schedule: string) => void
}

export const useFlatConfigStore = create<FlatStoreState>(
  immer(set => ({
    errors: {},
    state: {
      triggerDispatch: false,
      triggerPush: false,
      triggerSchedule: '0 * * * *',
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
  }))
)

export default useFlatConfigStore
