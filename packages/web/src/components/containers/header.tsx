'use client'
import React, { useEffect } from 'react'
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useAuth } from '@/providers/auth'
import PowerIcon from '@heroicons/react/16/solid/PowerIcon'

interface HeaderProps {
  contentRef: React.RefObject<HTMLElement>
}

function Header({ contentRef }: HeaderProps): JSX.Element {
  const { pageTitle } = useAppSelector((state) => state.header)
  const dispatch = useAppDispatch()
  const { authLogout } = useAuth()

  useEffect(() => {
    if (contentRef.current) {
      ;(contentRef.current as HTMLDivElement).scroll({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [pageTitle])

  const logoutUser = async () => {
    console.log('here')
    await authLogout()
  }

  return (
    <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
      {/* Menu toggle for mobile view or small screen */}
      <div className="flex-1">
        <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
          <Bars3Icon className="h-5 inline-block w-5" />
        </label>
        <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
      </div>

      <div className="flex-none">
        <button className="btn btn-ghost mr-4 ml-2 btn-circle" onClick={() => logoutUser()}>
          <div className="indicator">
            <PowerIcon className="h-6 w-6" />
          </div>
        </button>
      </div>
    </div>
  )
}

export default Header
