import produce, { Draft } from 'immer'
import create, { State, StateCreator } from 'zustand'
import type { FlatState } from '../../types'

const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config(fn => set(produce<T>(fn)), get, api)

type FlatStoreState = {
  state: FlatState
  update: (fn: (draft: Draft<FlatStoreState>) => void) => void
  // setTriggerSchedule: (schedule: string) => void
}

export const useFlatConfigStore = create<FlatStoreState>(
  immer(set => ({
    state: {
      triggerDispatch: false,
      triggerPush: false,
      triggerSchedule: '',
      jobs: {},
    },
    update: fn => {
      set(fn)
    },
  }))
)

export default useFlatConfigStore
