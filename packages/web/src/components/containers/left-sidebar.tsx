'use client'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import Link from 'next/link'
import SidebarSubmenu from './sidebar-submenu'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import BookmarkSquareIcon from '@heroicons/react/24/outline/BookmarkSquareIcon'
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/outline/ArrowUpOnSquareIcon'
import auth from '@/lib/auth'
import routesObj from '@/helper/sidebar-routes'
import { setPageTitle } from '../features/common/headerSlice'
import { getUserInfo } from '../features/common/userSlice'
import mainLogo from '@/../public/images/login/logo.svg'
import Image from 'next/image'
import { useAuth } from '@/providers/auth'
import { APP_NAME_TITLE, USER_ROLE, USER_ROLES } from '@/helper/constants'
import { SidebarMenuObj } from '@/helper/types'

const roleUrl = localStorage.getItem(USER_ROLE)
let routes: SidebarMenuObj[] = []
if (roleUrl == USER_ROLES.Patient.toLowerCase()) {
  routes = routesObj.patientRoutes
} else {
  routes = routesObj.doctorRoutes
}
console.log({ roleUrl })
interface LeftSidebarProps {}

function LeftSidebar(props: LeftSidebarProps) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { authLogout } = useAuth()

  const close = () => {
    const leftSidebarDrawer = document.getElementById('left-sidebar-drawer')
    if (leftSidebarDrawer) leftSidebarDrawer.click()
  }
  const user = useAppSelector((state) => state.user)

  useEffect(() => {
    console.log(pathname)
    let routeObj = routes.filter((r) => {
      return r.path == pathname
    })[0]
    if (routeObj) {
      dispatch(setPageTitle({ title: routeObj.pageTitle }))
    } else {
      const secondSlashIndex = pathname.indexOf('/', pathname.indexOf('/', pathname.indexOf('/') + 1) + 1)
      if (secondSlashIndex !== -1) {
        const substringBeforeSecondSlash = pathname.substring(0, secondSlashIndex)
        let submenuRouteObj = routes.filter((r) => {
          return r.path == substringBeforeSecondSlash
        })[0]
        // if (submenuRouteObj.submenu) {
        //   let submenuObj = submenuRouteObj.submenu.filter((r) => {
        //     return r.path == pathname
        //   })[0]
        //   console.log('herere', submenuObj)
        //   dispatch(setPageTitle({ title: submenuObj.pageTitle }))
        // }
      }
    }
  }, [pathname])

  useEffect(() => {
    dispatch(getUserInfo())
  }, [])

  const logoutUser = async () => {
    console.log('here')
    await authLogout()
  }

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
        <div className="overflow-y-scroll pb-20 no-scrollbar" style={{ height: '85vh' }}>
          {routes.map((route, k: number) => (
            <li className="" key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
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
              )}
            </li>
          ))}
        </div>
      </ul>
      {/* Profile icon, opening menu on click */}
      <div className="dropdown bottom-0 absolute dropdown-top w-80 ">
        <div tabIndex={0} role="button" className="btn w-full bg-base-100 text-left justify-start ">
          <div className="avatar">
            <div className="w-6 rounded-full">
              <img src={user.avatar} />
            </div>
          </div>
          {user.name}
          <ChevronUpIcon className="w-4 " />
        </div>
        <ul tabIndex={0} className="dropdown-content visible w-52 px-4 z-[1]  menu  shadow bg-base-200 rounded-box ">
          <li className="">
            <Link href={'/settings/billing'}>
              <BookmarkSquareIcon className="w-4 " />
              Bill History
            </Link>
          </li>
          <div className="divider py-2 m-0"></div>
          <li onClick={() => logoutUser()}>
            <a className=" ">
              <ArrowUpOnSquareIcon className="w-4 " />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LeftSidebar
