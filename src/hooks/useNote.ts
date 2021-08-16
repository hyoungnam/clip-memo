import { useReducer } from 'react'
import { nanoid } from 'nanoid'
import { NANO_SIZE } from 'libs/constants'
import { INote } from 'libs/types'

export const NOTE_ACTION = Object.freeze({
  CREATE: 'CREATE',
  CREATE_QUICK: 'CREATE_QUICK',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DRAG: 'DRAG',
  RESIZE: 'RESIZE',
})

export const useNote = (initialNote = []) => {
  const [notes, dispatch] = useReducer(reducer, initialNote)
  return [notes, dispatch] as const
}

const reducer = (notes: INote[], action: any) => {
  switch (action.type) {
    case 'CREATE':
      return createNote(notes, action.payload)
    case 'CREATE_QUICK':
      return createQuickNote(notes)
    case 'UPDATE':
      return updateNote(notes, action.payload)
    case 'DELETE':
      return deleteNote(notes, action.payload)
    case 'DRAG':
      return dragNote(notes, action.payload)
    case 'RESIZE':
      return resizeNote(notes, action.payload)
    default:
      return notes
  }
}

const createNote = (notes: INote[], payload: { clientX: number; clientY: number }) => {
  return [
    ...notes,
    {
      id: nanoid(NANO_SIZE),
      content: '',
      width: 20,
      height: 20,
      clientXY: { x: payload.clientX - 10, y: payload.clientY - 10 },
    },
  ]
}
const createQuickNote = (notes: INote[]) => {
  return [
    ...notes,
    {
      id: nanoid(NANO_SIZE),
      content: '',
      width: 144,
      height: 144,
      clientXY: { x: 32, y: 32 },
    },
  ]
}

const updateNote = (notes: INote[], payload: { id: string; value: string }) => {
  return notes.map((note) => (note.id === payload.id ? { ...note, content: payload.value } : note))
}
const deleteNote = (notes: INote[], payload: { id: string }) => {
  return notes.filter((note) => note.id !== payload.id)
}

const dragNote = (notes: INote[], payload: { id: string; left: number; top: number }) => {
  return notes.map((note) =>
    note.id === payload.id ? { ...note, clientXY: { x: payload.left, y: payload.top } } : note
  )
}

const resizeNote = (notes: INote[], payload: { id: string; width: number; height: number }) => {
  return notes.map((note) =>
    note.id === payload.id ? { ...note, width: payload.width, height: payload.height } : note
  )
}
