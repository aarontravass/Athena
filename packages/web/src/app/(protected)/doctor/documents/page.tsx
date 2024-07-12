'use client'
import { FormEventHandler, useEffect, useState } from 'react'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, MODAL_BODY_TYPES } from '@/helper/constants'
import { openModal } from '@/components/features/common/modalSlice'
import TitleCard from '@/components/cards/title-card'
import { gql, useMutation, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'
import { showNotification } from '@/components/features/common/headerSlice'

interface PatientsListData {
  createdAt: string
  email: string
  id: string
  name: string
  updatedAt: string
  patientFiles: DocumentsListData[]
}

interface DocumentsListData {
  createdAt: string
  fileName: string
  id: string
  ipfsCid: string
  updatedAt: string
}

// const TopSideButtons = () => {
// const dispatch = useAppDispatch()
// const UPLOAD_FILE = gql`
//   mutation UploadFile($file: File!, $userId: ID!) {
//     uploadFile(file: $file, userId: $userId) {
//       user {
//         patientFiles {
//           createdAt
//           fileName
//           id
//           ipfsCid
//           updatedAt
//         }
//       }
//     }
//   }
// `

// let currentFileUploadData: File | null = null
// // const [currentFileUploadData, setCurrentFileUploadData] = useState<File | null>()
// const [uploadRequest, { data: fileUploadData, error: fileUploadError }] = useMutation(UPLOAD_FILE)
// let errorMessage = ''
// const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   const fileData = event?.target?.files
//   console.log({ fileData })
//   if (fileData && fileData?.length > 0) {
//     currentFileUploadData = fileData[0]
//     // setCurrentFileUploadData(fileData[0])
//     console.log('AS', fileData[0])
//     console.log('AS', typeof fileData[0])
//     console.log('AS', { currentFileUploadData })
//   }
// }

// const uploadFileModal = () => {
//   console.log('Hello OOOO')
//   dispatch(() => {
//     dispatch(
//       openModal({
//         title: 'Upload A File',
//         bodyType: MODAL_BODY_TYPES.DEFAULT,
//         bodyContent: (
//           <>
//             <div className="grid">
//               <input
//                 type="file"
//                 className="file-input file-input-bordered file-input-primary w-full"
//                 onChange={onFileInputChange}
//               />
//             </div>
//             <div className="grid mt-7">
//               <button className="btn px-6 btn-sm normal-case btn-primary" onClick={uploadFileDocument}>
//                 Upload File
//               </button>
//               {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
//             </div>
//           </>
//         )
//       })
//     )
//   })
// }

// const uploadFileDocument = async () => {
//   console.log('uploadFileDocument Hello world')
//   console.log({ currentFileUploadData })
//   if (!currentFileUploadData) return
//   // try {
//   await uploadRequest({
//     variables: { file:currentFileUploadData,userId }
//     // refetchQueries: [{ query: GET_FILES_QUERY }]
//   })
//     .then((res) => {
//       console.log({ res, fileUploadData })
//     })
//     .catch((error) => {
//       console.error({ error })
//     })
//   // } catch (err) {
//   //   console.error(err)
//   // }
// }

// return (
//   <div className="inline-block float-right">
//     <button className="btn px-6 btn-sm normal-case btn-primary" onClick={uploadFileModal}>
//       Upload
//     </button>
//   </div>
// )
// }

function Documents() {
  const dispatch = useAppDispatch()
  const [patientsList, setPatientsList] = useState<PatientsListData[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientsListData>()
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  // const [currentFileUploadData, setCurrentFileUploadData] = useState<File | null>()
  let currentFileUploadData: File | null = null
  // let errorMessage = ''

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

  const UPLOAD_FILE = gql`
    mutation UploadFile($file: File!, $userId: ID!) {
      uploadFile(file: $file, userId: $userId) {
        user {
          patientFiles {
            createdAt
            fileName
            id
            ipfsCid
            updatedAt
          }
        }
      }
    }
  `
  const [uploadRequest, { data: fileUploadData, loading: fileUploadLoading, error: fileUploadError }] =
    useMutation(UPLOAD_FILE)

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
      // setCurrentFileUploadData(fileData[0])
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
                  <button
                    type="submit"
                    disabled={fileUploadLoading}
                    className="btn px-6 btn-sm normal-case btn-primary"
                  >
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
    console.log('uploadFileDocument Hello world')
    console.log({ currentFileUploadData })
    if (!currentFileUploadData) return
    // try {
    await uploadRequest({
      variables: { file: currentFileUploadData, userId: selectedPatientId }
      // refetchQueries: [{ query: GET_FILES_QUERY }]
    })
      .then((res) => {
        console.log({ res, fileUploadData })
      })
      .catch((error) => {
        console.error({ error })
        setErrorMessage(error?.message)
      })
    // } catch (err) {
    //   console.error(err)
    // }
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
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {selectedPatient.patientFiles.map((doc: DocumentsListData, k: number) => (
                  <tr key={k}>
                    <td>{doc.fileName}</td>
                    <td>{doc.createdAt}</td>
                    <td>{doc.updatedAt}</td>
                    {/* <td>
                      <button className="btn btn-square btn-ghost" onClick={() => openCurrentDocument(k)}>
                        <EyeIcon className="w-5" />
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}
      {patientsListDataError?.message && <ErrorText styleClass="mt-8">{patientsListDataError.message}</ErrorText>}
    </>
  )
}

export default Documents
