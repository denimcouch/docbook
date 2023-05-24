import { StateCreator } from 'zustand'

export interface CellSlice {
  cells: number
  addCell: () => void
  updateCell: () => void
  deleteCell: () => void
  insertCellBefore: () => void
}

export const createCellSlice: StateCreator<CellSlice, [], [], CellSlice> = (
  set
) => ({
  cells: 0,
  addCell: () =>
    set((state) => ({
      cells: state.cells + 1
    })),
  updateCell: () => console.log('updating cell logic here'),
  deleteCell: () =>
    set((state) => ({
      cells: state.cells - 1
    })),
  insertCellBefore: () => console.log('insert cell before logic here')
})
