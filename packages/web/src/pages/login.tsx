'use client'
import { usePrivy } from '@privy-io/react-auth'
import Head from 'next/head'
import { useState } from 'react'

const LoginPage = (): JSX.Element => {
  const [isPatient, setIsPatient] = useState<boolean>(true)
  const { ready, authenticated, login } = usePrivy()
  const disableLogin = !ready

  const submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    login()
  }
  const changeRole = () => {
    setIsPatient(!isPatient)
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
                      <img
                        src="/mainLogo.png"
                        className="w-12 inline-block mr-2 mask mask-circle"
                        alt="dashwind-logo"
                      />
                      MedDrive
                    </h1>

                    <div className="text-center mt-12">
                      <img src="./loginSideIMage.png" alt="Dashwind Admin Template" className="w-48 inline-block"></img>
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
                  <button type="submit" className={`btn mt-2 w-full btn-primary`} disabled={disableLogin}>
                    Login
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
