'use client'
import { useEffect, useState } from 'react'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, APP_NAME_TITLE } from '@/helper/constants'
import { openModal, updateModal } from '@/components/features/common/modalSlice'
import TitleCard from '@/components/cards/title-card'
import { gql, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

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
      fetchPatientFileBlob(fileId: $fileId) {
        base64
        fileName
      }
    }
  `

  const { data: patientFilesData, error: patientFilesError } = useQuery(FETCH_PATIENT_FILES, {
    context: { appTokenName: APP_NAME + ':token' }
  })

  const { data: patientFilesBlobData, error: patientFilesBlobError } = useQuery(FETCH_PATIENT_FILE_BLOB, {
    variables: { fileId: selectedFileId },
    context: { appTokenName: APP_NAME + ':token' },
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

  useEffect(() => {
    dispatch(() => {
      console.log({ patientFilesBlobData })
      if (patientFilesBlobData) {
        dispatch(
          openModal({
            title: 'Image Viewer',
            bodyContent: (
              <>
                {patientFilesBlobData?.fetchPatientFileBlob && (
                  <Image
                    className="m-auto"
                    alt="fileImage"
                    width={700}
                    height={700}
                    src={`data:image/*;base64,${patientFilesBlobData?.fetchPatientFileBlob?.base64}`}
                  ></Image>
                )}
              </>
            )
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

  const updateUploadModal = (responseData: JSX.Element) => {
    console.log({ responseData })
    dispatch(
      updateModal({
        response: responseData
      })
    )
  }
  return (
    <>
      <Head>
        <title>{APP_NAME_TITLE} | Patient - Documents</title>
      </Head>
      {!documentsData?.length && <ErrorText styleClass="mt-8">{'No Documents Found'}</ErrorText>}
      {documentsData?.length > 0 && (
        <TitleCard title="Medical Documents" topMargin="mt-2">
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Open</th>
                  <th>Tokens</th>
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
                    <td>
                      <button className="btn btn-square btn-ghost">
                        <Link href={'./documents/' + doc.id}>
                          <EyeIcon className="w-5" />
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}
      {patientFilesError?.message && <ErrorText styleClass="mt-8">{patientFilesError.message}</ErrorText>}
      {patientFilesBlobError?.message && <ErrorText styleClass="mt-8">{patientFilesBlobError.message}</ErrorText>}
    </>
  )
}

export default Documents
