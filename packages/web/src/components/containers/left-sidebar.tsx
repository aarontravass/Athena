'use client'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import routesObj from '@/helper/sidebar-routes'
import { setPageTitle } from '../features/common/headerSlice'
import mainLogo from '@/../public/images/login/logo.svg'
import Image from 'next/image'
import { APP_NAME_TITLE, USER_ROLE, USER_ROLES } from '@/helper/constants'
import { SidebarMenuObj } from '@/helper/types'
interface LeftSidebarProps {
  // userRole: string | null
}

function LeftSidebar(props: LeftSidebarProps) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const roleUrl = localStorage.getItem(USER_ROLE)
  let routes: SidebarMenuObj[] = []
  if (roleUrl == USER_ROLES.Patient.toLowerCase()) {
    routes = routesObj.patientRoutes
  } else {
    routes = routesObj.doctorRoutes
  }
  console.log({ roleUrl })
  // console.log('props.userRole', props.userRole)

  const close = () => {
    const leftSidebarDrawer = document.getElementById('left-sidebar-drawer')
    if (leftSidebarDrawer) leftSidebarDrawer.click()
  }

  useEffect(() => {
    console.log(pathname)
    let routeObj = routes.filter((r) => {
      return r.path == pathname
    })[0]
    if (routeObj) {
      dispatch(setPageTitle({ title: routeObj.pageTitle }))
    }
  }, [pathname])

  return (
    <div className="drawer-side z-30 overflow-hidden">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
        <button
          className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={close}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">
          <Link href="/welcome">
            <Image className="mask mask-squircle w-10" src={mainLogo} alt="DashWind Logo" />
            {APP_NAME_TITLE}
          </Link>
        </li>
        <div className="pb-20 no-scrollbar" style={{ height: '85vh' }}>
          {routes.map((route, k: number) => (
            <li className="" key={k}>
              <Link
                href={route.path}
                className={`${pathname == route.path ? 'font-semibold bg-base-200 ' : 'font-normal'}`}
              >
                {route.icon} {route.pageName}
                {pathname === route.path ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                    aria-hidden="true"
                  ></span>
                ) : null}
              </Link>
            </li>
          ))}
        </div>
      </ul>
      {/* Profile icon, opening menu on click */}
    </div>
  )
}

export default LeftSidebar
