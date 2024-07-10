// app/[workspaceId]/layout.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import Header from '@/containers/header'
import LeftSidebar from '@/containers/left-sidebar'
import RightSidebar from '@/containers/right-sidebar'
import ModalLayout from '@/containers/modal-layout'
import { useAuth } from '@/providers/auth'
// import './css/dashboardModule.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: LayoutProps) {
  // const { isAuthenticated, isLoading } = useAuth()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const mainContentRef = useRef(null)

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.replace('/login')
  //   }
  // }, [isAuthenticated, isLoading, router])

  // if (isLoading) {
  //   return <div>Loading...</div>
  // }

  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          <Header contentRef={mainContentRef} />
          <main className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6  bg-base-200" ref={mainContentRef}>
            {children}
            <div className="h-16"></div>
          </main>
        </div>
        <LeftSidebar />
      </div>

      {/* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar />

      {/* Notification layout container */}
      <ToastContainer />

      {/* Modal layout container */}
      <ModalLayout />
    </>
  )
}
