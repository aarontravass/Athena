'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HeaderState {
  pageTitle: string
}

const initialState: HeaderState = {
  pageTitle: 'Home'
}

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<{ title: string }>) => {
      state.pageTitle = action.payload.title
    }
  }
})

export const { setPageTitle } = headerSlice.actions

export default headerSlice.reducer
