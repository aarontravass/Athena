'use client'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, MODAL_BODY_TYPES } from '@/helper/constants'
import { openModal } from '@/components/features/common/modalSlice'
import TitleCard from '@/components/cards/title-card'
import { gql, useMutation, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'
import { DocumentsListData, PatientsListData } from '@/lib/models'

function Documents() {
  const dispatch = useAppDispatch()
  const [patientsList, setPatientsList] = useState<PatientsListData[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientsListData>()
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  let currentFileUploadData: File | null = null

  const FETCH_PATIENTS = gql`
    query FetchPatients {
      fetchPatients {
        createdAt
        email
        id
        name
        updatedAt
        patientFiles {
          createdAt
          fileName
          id
          ipfsCid
          updatedAt
        }
      }
    }
  `

  const GENERATE_PRE_SIGNED_UPLOAD_URL = gql`
    mutation GeneratePreSignedUploadUrl($userId: ID!) {
      generatePreSignedUploadUrl(userId: $userId)
    }
  `
  const [
    generatePreSignedUploadUrlGql,
    {
      data: generatePreSignedUploadUrlData,
      loading: generatePreSignedUploadUrlLoading,
      error: generatePreSignedUploadUrlError
    }
  ] = useMutation(GENERATE_PRE_SIGNED_UPLOAD_URL, {
    context: { appTokenName: APP_NAME }
  })

  const { data: patientsListData, error: patientsListDataError } = useQuery(FETCH_PATIENTS, {
    context: { appTokenName: APP_NAME }
  })

  useEffect(() => {
    const docsData = patientsListData?.fetchPatients
    if (docsData) {
      console.log({ docsData })
      setPatientsList(docsData)
    }
  }, [patientsListData])

  useEffect(() => {
    if (selectedPatientId) {
      const filteredPatient = patientsList.filter((ele) => {
        return selectedPatientId == ele.id
      })
      console.log({ filteredPatient })
      if (filteredPatient[0]) {
        setSelectedPatient(filteredPatient[0])
      } else {
        setSelectedPatientId('')
      }
    }
  }, [selectedPatientId])

  const onPatientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
    setSelectedPatientId(event.target.value)
  }

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileData = event?.target?.files
    console.log({ fileData })
    if (fileData && fileData?.length > 0) {
      currentFileUploadData = fileData[0]
      console.log('AS', fileData[0])
      console.log('AS', typeof fileData[0])
      console.log('AS', { currentFileUploadData })
    }
  }

  const uploadFileModal = () => {
    console.log('Hello OOOO')
    dispatch(() => {
      dispatch(
        openModal({
          title: 'Upload A File',
          bodyType: MODAL_BODY_TYPES.DEFAULT,
          bodyContent: (
            <>
              <form onSubmit={uploadFileDocument} encType="multipart/form-data">
                <div className="grid">
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full"
                    onChange={onFileInputChange}
                  />
                </div>
                <div className="grid mt-7">
                  <button type="submit" disabled={uploadLoading} className="btn px-6 btn-sm normal-case btn-primary">
                    Upload File
                  </button>
                  {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                </div>
              </form>
            </>
          )
        })
      )
    })
  }

  const uploadFileDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadLoading(true)
    console.log('uploadFileDocument Hello world')
    console.log({ currentFileUploadData, selectedPatientId })
    if (!currentFileUploadData) return
    // try {
    await generatePreSignedUploadUrlGql({
      variables: { userId: selectedPatientId }
    })
      .then(async (res) => {
        const uploadUrlApi = res?.data?.generatePreSignedUploadUrl
        if (uploadUrlApi) {
          let formData = new FormData()
          currentFileUploadData?.arrayBuffer().then(async (arrayBufferData) => {
            const blobData = new Blob([arrayBufferData], { type: currentFileUploadData?.type })
            formData.append('file', blobData, currentFileUploadData?.name)

            await fetch(uploadUrlApi, {
              body: formData,
              method: 'POST'
            })
              .then((uploadRes) => {
                console.log({ uploadRes })
              })
              .catch((uploadError) => {
                console.log({ uploadError })
              })
          })
        } else {
          setErrorMessage('Upload URL is not valid')
        }
        console.log({ res, generatePreSignedUploadUrlData })
      })
      .catch((error) => {
        console.error({ error })
        setErrorMessage(error?.message)
      })
  }

  return (
    <>
      <div className="form-control w-full mt-4">
        <label className="label">
          <p>Select a patient to add to your list</p>
        </label>
        {patientsList.length > 0 && (
          <select onChange={onPatientChange} defaultValue="" className="select select-bordered w-full max-w-md">
            <option disabled value="">
              Select an email address
            </option>
            {patientsList.map((pat: PatientsListData, k: number) => (
              <option key={k} value={pat.id}>
                {pat.email}
              </option>
            ))}
          </select>
        )}
      </div>
      {selectedPatient && (
        <TitleCard
          title="Medical Documents"
          topMargin="mt-2"
          TopSideButtons={
            <div className="inline-block float-right">
              <button className="btn px-6 btn-sm normal-case btn-primary" onClick={uploadFileModal}>
                Upload
              </button>
            </div>
          }
        >
          {!selectedPatient?.patientFiles?.length && <ErrorText styleClass="mt-8">{'No Documents Found'}</ErrorText>}
          {selectedPatient?.patientFiles.length > 0 && (
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.patientFiles.map((doc: DocumentsListData, k: number) => (
                    <tr key={k}>
                      <td>{doc.fileName}</td>
                      <td>{doc.createdAt}</td>
                      <td>{doc.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TitleCard>
      )}
      {patientsListDataError?.message && <ErrorText styleClass="mt-8">{patientsListDataError.message}</ErrorText>}
    </>
  )
}

export default Documents
