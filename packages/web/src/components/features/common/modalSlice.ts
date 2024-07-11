import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  title: string
  isOpen: boolean
  bodyType: string
  size: string
  extraObject: Record<string, any>
  bodyContent: JSX.Element | null
}

const initialState: ModalState = {
  title: '',
  isOpen: false,
  bodyType: '',
  size: '',
  extraObject: {},
  bodyContent: null
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title: string
        bodyType: string
        extraObject?: any
        size?: string
        bodyContent: JSX.Element
      }>
    ) => {
      const { title, bodyType, extraObject, size, bodyContent } = action.payload
      state.isOpen = true
      state.bodyType = bodyType
      state.title = title
      state.size = size || 'md'
      state.extraObject = extraObject
      state.bodyContent = bodyContent
    },
    closeModal: (state) => {
      state.isOpen = false
      state.bodyType = ''
      state.title = ''
      state.extraObject = {}
      state.bodyContent = null
    }
  }
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
