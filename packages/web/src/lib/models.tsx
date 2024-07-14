export interface PatientsListData {
  createdAt: string
  email: string
  id: string
  name: string
  updatedAt: string
  patientFiles: DocumentsListData[]
}

export interface DocumentsListData {
  createdAt: string
  fileName: string
  id: string
  ipfsCid: string
  updatedAt: string
}
