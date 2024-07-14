'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  title: string
  isOpen: boolean
  bodyContent: JSX.Element | null
}

const initialState: ModalState = {
  title: '',
  isOpen: false,
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
        bodyContent: JSX.Element
      }>
    ) => {
      const { title, bodyContent } = action.payload
      state.isOpen = true
      state.title = title
      state.bodyContent = bodyContent
    },
    closeModal: (state) => {
      state.isOpen = false
      state.title = ''
      state.bodyContent = null
    }
  }
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
