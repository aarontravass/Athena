export const APP_NAME_TITLE = 'Athena'
export const APP_NAME = 'athena'
export const USER_ROLE = 'userRole'
export const PRIVY_APP_NAME = 'privyAuth'
export const API_URL = 'http://localhost:3000/graphql'
export enum USER_ROLES {
  Patient = 'Patient',
  Doctor = 'Doctor'
}

export const MODAL_BODY_TYPES: { [key: string]: string } = Object.freeze({
  DEFAULT: 'DEFAULT',
  LEAD_ADD_NEW: 'LEAD_ADD_NEW',
  UPLOAD_FILE: 'UPLOAD_FILE',
  FILE_VIEWER: 'FILE_VIEWER'
})

export const RIGHT_DRAWER_TYPES: { [key: string]: string } = Object.freeze({
  DEFAULT: 'DEFAULT',
  NOTIFICATION: 'NOTIFICATION'
})

export const CONFIRMATION_MODAL_CLOSE_TYPES: { [key: string]: string } = Object.freeze({
  DEFAULT: 'DEFAULT'
})
