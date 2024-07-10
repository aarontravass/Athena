'use client'
import { useEffect, useState } from 'react'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, MODAL_BODY_TYPES } from '@/helper/constants'
import { openModal } from '@/components/features/common/modalSlice'
import TitleCard from '@/components/cards/title-card'
import { gql, useQuery } from '@apollo/client'

interface DocumentsData {
  createdAt: string
  fileName: string
  id: string
  ipfsCid: string
  updatedAt: string
}
const TopSideButtons = () => {
  const dispatch = useAppDispatch()

  const openAddNewLeadModal = () => {
    dispatch(openModal({ title: 'Add New Lead', bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }))
  }

  return (
    <div className="inline-block float-right">
      <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewLeadModal}>
        Upload
      </button>
    </div>
  )
}
function Documents() {
  const dispatch = useAppDispatch()
  const [documentsData, setDocumentsData] = useState<DocumentsData[]>([])
  //   const { leads } = useAppSelector((state) => state.leads)

  const FETCH_PATIENT_FILES = gql`
    query FetchPatientFiles {
      fetchPatientFiles {
        createdAt
        fileName
        id
        ipfsCid
        updatedAt
      }
    }
  `

  const { data, error } = useQuery(FETCH_PATIENT_FILES, {
    context: { appTokenName: APP_NAME }
  })

  useEffect(() => {
    dispatch(() => {
      const docsData = data?.fetchPatientFiles
      if (docsData) {
        console.log({ docsData })

        setDocumentsData(docsData)
      }
    })
  }, [data, dispatch])

  const getDummyStatus = (index: number) => {
    if (index % 5 === 0) return <div className="badge">Not Interested</div>
    else if (index % 5 === 1) return <div className="badge badge-primary">In Progress</div>
    else if (index % 5 === 2) return <div className="badge badge-secondary">Sold</div>
    else if (index % 5 === 3) return <div className="badge badge-accent">Need Followup</div>
    else return <div className="badge badge-ghost">Open</div>
  }

  const openCurrentDocument = (index: number) => {
    dispatch(
      openModal({
        title: 'Confirmation',
        bodyType: MODAL_BODY_TYPES.DEFAULT,
        extraObject: {
          ...documentsData[index]
        }
      })
    )
    console.log(documentsData[index])
  }

  return (
    <>
      <TitleCard title="Medical Documents" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {documentsData.map((doc: DocumentsData, k: number) => (
                <tr key={k}>
                  <td>{doc.fileName}</td>
                  <td>{doc.createdAt}</td>
                  <td>{doc.updatedAt}</td>
                  <td>
                    <button className="btn btn-square btn-ghost" onClick={() => openCurrentDocument(k)}>
                      <EyeIcon className="w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  )
}

export default Documents
