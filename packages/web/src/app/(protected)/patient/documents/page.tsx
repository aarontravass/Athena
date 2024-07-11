'use client'
import { useEffect, useState } from 'react'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, MODAL_BODY_TYPES } from '@/helper/constants'
import { openModal } from '@/components/features/common/modalSlice'
import TitleCard from '@/components/cards/title-card'
import { gql, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'

interface DocumentsData {
  createdAt: string
  fileName: string
  id: string
  ipfsCid: string
  updatedAt: string
}

function Documents() {
  const dispatch = useAppDispatch()
  const [documentsData, setDocumentsData] = useState<DocumentsData[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string>('')

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

  const FETCH_PATIENT_FILE_BLOB = gql`
    query FetchPatientFileBlob($fileId: ID!) {
      fetchPatientFileBlob(fileId: $fileId)
    }
  `

  const { data: patientFilesData, error: patientFilesError } = useQuery(FETCH_PATIENT_FILES, {
    context: { appTokenName: APP_NAME }
  })

  const { data: patientFilesBlobData, error: patientFilesBlobError } = useQuery(FETCH_PATIENT_FILE_BLOB, {
    variables: { fileId: selectedFileId },
    context: { appTokenName: APP_NAME },
    skip: !selectedFileId
  })

  useEffect(() => {
    dispatch(() => {
      const docsData = patientFilesData?.fetchPatientFiles
      if (docsData) {
        console.log({ docsData })
        setDocumentsData(docsData)
      }
    })
  }, [patientFilesData])

  const modalButton = () => {
    console.log('Hhllo')
  }

  useEffect(() => {
    dispatch(() => {
      console.log({ patientFilesBlobData })
      if (patientFilesBlobData) {
        dispatch(
          openModal({
            title: 'Confirmation',
            bodyType: MODAL_BODY_TYPES.DEFAULT,
            bodyContent: (
              <>
                {/* {patientFilesBlobData?.fetchPatientFileBlob && (
                  <FileViewer
                    file={{
                      data: pdfData,
                      mimeType: 'application/pdf',
                      name: 'sample.pdf' // for download
                    }}
                  />
                )} */}
                <button className="btn px-6 btn-sm normal-case btn-primary" onClick={modalButton}>
                  Hello World
                </button>
              </>
            ),
            extraObject: {
              fileData: patientFilesBlobData?.fetchPatientFileBlob
            }
          })
        )
      }
    })
  }, [patientFilesBlobData])

  const openCurrentDocument = (index: number) => {
    console.log(documentsData[index])
    console.log(documentsData[index].id)
    setSelectedFileId(documentsData[index].id)
    console.log({ selectedFileId })
  }

  return (
    <>
      <TitleCard title="Medical Documents" topMargin="mt-2">
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
      {patientFilesError?.message && <ErrorText styleClass="mt-8">{patientFilesError.message}</ErrorText>}
      {patientFilesBlobError?.message && <ErrorText styleClass="mt-8">{patientFilesBlobError.message}</ErrorText>}
    </>
  )
}

export default Documents
