'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  title: string
  isOpen: boolean
  bodyContent: JSX.Element | null
  response: JSX.Element | null
}

const initialState: ModalState = {
  title: '',
  isOpen: false,
  bodyContent: null,
  response: null
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title?: string
        bodyContent?: JSX.Element
        response?: JSX.Element
      }>
    ) => {
      const { title, bodyContent } = action.payload
      state.isOpen = true
      if (title) state.title = title
      if (bodyContent) state.bodyContent = bodyContent
    },
    updateModal: (
      state,
      action: PayloadAction<{
        title?: string
        bodyContent?: JSX.Element
        response?: JSX.Element
      }>
    ) => {
      const { title, bodyContent, response } = action.payload
      state.isOpen = true
      if (title) state.title = title
      if (bodyContent) state.bodyContent = bodyContent
      if (response) state.response = response
      state.response = null
    },
    closeModal: (state) => {
      state.isOpen = false
      state.title = ''
      state.bodyContent = null
      state.response = null
    }
  }
})

export const { openModal, closeModal, updateModal } = modalSlice.actions

export default modalSlice.reducer
