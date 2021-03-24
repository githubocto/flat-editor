import create from 'zustand'
import type { FlatState } from '../../types'

type FlatStoreState = {
  state: FlatState
  setTriggerSchedule: (schedule: string) => void
}

export const useFlatConfigStore = create<FlatStoreState>((set, get) => ({
  state: {
    triggerDispatch: false,
    triggerPush: false,
    triggerSchedule: '',
    jobs: {},
  },
  setTriggerSchedule: schedule =>
    set(draft => ({
      state: {
        ...draft.state,
        triggerSchedule: schedule,
      },
    })),
}))

export default useFlatConfigStore
