import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import { SidebarMenuObj } from './types'

// Import other icons similarly

const iconClasses = `h-6 w-6`

const patientRoutes: SidebarMenuObj[] = [
  // {
  //   path: '/patient/dashboard',
  //   icon: <Squares2X2Icon className={iconClasses} />,
  //   pageName: 'Dashboard',
  //   pageTitle: 'Dashboard'
  // },
  {
    path: '/patient/documents',
    icon: <InboxArrowDownIcon className={iconClasses} />,
    pageName: 'Documents',
    pageTitle: 'Documents'
  }
]

const doctorRoutes: SidebarMenuObj[] = [
  {
    path: '/doctor/dashboard',
    icon: <Squares2X2Icon className={iconClasses} />,
    pageName: 'Dashboard',
    pageTitle: 'Dashboard'
  },
  {
    path: '/doctor/documents',
    icon: <InboxArrowDownIcon className={iconClasses} />,
    pageName: 'Documents',
    pageTitle: 'Documents'
  }
]

export default { patientRoutes, doctorRoutes }
