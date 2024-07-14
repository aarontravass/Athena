'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth'
import Header from '@/components/containers/header'
import LeftSidebar from '@/components/containers/left-sidebar'
import ModalLayout from '@/components/containers/modal-layout'

interface LayoutProps {
  children: React.ReactNode
  params: { workspaceSlug: string }
}

export default function ProtectedLayout({ children, params }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const mainContentRef = useRef(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

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

      {/* Modal layout container */}
      <ModalLayout />
    </>
  )
}
