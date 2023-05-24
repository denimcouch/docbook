import { StateCreator } from 'zustand'

export interface BundleSlice {
  bundles: number
  addBundle: () => void
}

export const createBundleSlice: StateCreator<
  BundleSlice,
  [],
  [],
  BundleSlice
> = (set) => ({
  bundles: 0,
  addBundle: () =>
    set((state) => ({
      bundles: state.bundles + 1
    }))
})
