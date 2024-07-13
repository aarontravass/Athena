'use client'
import ErrorText from '@/components/typography/error-text'
import SuccessText from '@/components/typography/success-text'
import { APP_NAME } from '@/helper/constants'
import { PatientsListData } from '@/lib/models'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const PatientDashboard = () => {
  const [patientsList, setPatientsList] = useState<PatientsListData[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const FETCH_ALL_PATIENTS = gql`
    query FetchAllPatients {
      fetchAllPatients {
        createdAt
        email
        id
        name
        updatedAt
      }
    }
  `

  const ADD_PATIENT = gql`
    mutation AddPatient($patientId: ID!) {
      addPatient(patientId: $patientId)
    }
  `

  const [addPatient, { data: addPatientData, loading: addPatientLoading, error: addPatientError }] = useMutation(
    ADD_PATIENT,
    {
      context: { appTokenName: APP_NAME + ':token' }
    }
  )

  const onAddingThePatient = async () => {
    setSuccessMessage('')
    setErrorMessage('')
    await addPatient({ variables: { patientId: selectedPatientId } })
      .then(async (result) => {
        console.log({ result })
        setSuccessMessage('Patient Added successfully!')
      })
      .catch((error) => {
        console.error({ error })
        setErrorMessage(error?.message)
      })
    setSuccessMessage('')
    setErrorMessage('')
  }

  const onPatientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
    setSelectedPatientId(event.target.value)
  }

  const { data: patientsListData, error: patientsListDataError } = useQuery(FETCH_ALL_PATIENTS, {
    context: { appTokenName: APP_NAME + ':token' }
  })

  useEffect(() => {
    const docsData = patientsListData?.fetchAllPatients
    if (docsData) {
      console.log({ docsData })
      setPatientsList(docsData)
    }
  }, [patientsListData])

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

      {selectedPatientId && (
        <div className="grid">
          <button
            disabled={addPatientLoading}
            className="btn px-6 btn-sm normal-case btn-primary max-w-md mt-4"
            onClick={onAddingThePatient}
          >
            Add patient to the doctor
          </button>
        </div>
      )}
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      {successMessage && <SuccessText>{successMessage}</SuccessText>}
    </>
  )
}

export default PatientDashboard
