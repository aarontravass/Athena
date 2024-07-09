'use client'
import { useLogin, usePrivy } from '@privy-io/react-auth'
import Head from 'next/head'
import { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'
import { PRIVY_APP_NAME } from './contants'
import Image from 'next/image'
import loginSideImage from '@/../public/loginSideImage.png'
import mainLogo from '@/../public/mainLogo.png'

const REGISTER_PATIENT_USER = gql`
  mutation RegisterUser {
    registerUser {
      email
      id
      name
    }
  }
`

const LoginPage = (): JSX.Element => {
  const [isPatient, setIsPatient] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { ready, getAccessToken } = usePrivy()
  const disableLogin = !ready

  const [registerUser, { data, loading, error }] = useMutation(REGISTER_PATIENT_USER, {
    context: { appTokenName: PRIVY_APP_NAME }
  })

  const handleRegister = async () => {
    try {
      await registerUser()
        .then()
        .catch((error) => {
          console.error({ error })
          setErrorMessage(error?.message)
        })
    } catch (e) {
      console.error(e)
    }
  }

  const changeRole = () => {
    setIsPatient(!isPatient)
  }

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
      console.log({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount })
      const accessToken = await getAccessToken()
      if (accessToken) localStorage.setItem('privyAuthToken', accessToken)
      handleRegister()
      setIsLoading(false)
    },
    onError: (error) => {
      setIsLoading(false)
      console.error(error)
    }
  })

  const submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (loading) return
    setIsLoading(true)
    login()
  }

  return (
    <>
      <Head>
        <title>Login · MedDrive</title>
      </Head>
      <div className="min-h-screen bg-base-200 flex items-center">
        <div className="card mx-auto w-full max-w-5xl shadow-xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div>
              <div className="hero min-h-full rounded-l-xl bg-base-200">
                <div className="hero-content py-12">
                  <div className="max-w-md">
                    <h1 className="text-3xl text-center font-bold ">
                      <Image src={mainLogo} className="w-12 inline-block mr-2 mask mask-circle" alt="dashwind-logo" />
                      MedDrive
                    </h1>

                    <div className="text-center mt-12">
                      <Image src={loginSideImage} alt="Dashwind Admin Template" className="w-48 inline-block" />
                    </div>

                    <h1 className="text-2xl mt-8 font-bold">{isPatient ? 'Patient' : 'Health Care Provider'}</h1>

                    {isPatient && (
                      <>
                        <p className="py-2 mt-4">
                          ✓ <span className="font-semibold">Securely access</span> your medical records
                        </p>
                      </>
                    )}

                    {!isPatient && (
                      <>
                        <p className="py-2 mt-4">
                          ✓ <span className="font-semibold">Decentrailized</span> storage medical records for all your
                          patinets
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="py-24 px-10">
              <form onSubmit={(e) => submitForm(e)}>
                <div className="mb-4">
                  <p className="text-left text-lg   md:mt-0 mt-6 mb-12  font-semibold">
                    Login - {isPatient ? 'Patient' : 'Health Care Provider'}
                  </p>
                </div>

                <div className="mt-8">
                  {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                  <button type="submit" className={`btn mt-2 w-full btn-primary`} disabled={disableLogin}>
                    {isLoading && <span className="loading loading-spinner"></span>}Login
                  </button>
                  <p className="text-center text-lg mt-5 font-semibold">
                    Not a {isPatient ? 'Patient' : 'Health Care Provider'}{' '}
                    <button
                      type="button"
                      className={`btn btn-primary`}
                      onClick={() => changeRole()}
                      disabled={disableLogin}
                    >
                      Change
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
