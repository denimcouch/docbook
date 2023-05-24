import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createBundleSlice, BundleSlice } from './slices/bundlesSlice'
import { createCellSlice, CellSlice } from './slices/cellsSlice'

export const useBoundStore = create<BundleSlice & CellSlice>()(
  immer((...a) => ({
    ...createBundleSlice(...a),
    ...createCellSlice(...a)
  }))
)
