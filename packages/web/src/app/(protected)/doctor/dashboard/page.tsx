'use client'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

const PatientDashboard = () => {
  const { ready, authenticated, user } = usePrivy()
  console.log(user)
  const router = useRouter()

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return <></>
  }

  if (ready && !authenticated) {
    // Replace this code with however you'd like to handle an unauthenticated user
    // As an example, you might redirect them to a login page
    router.push('/login')
  }

  if (ready && authenticated) {
    // Replace this code with however you'd like to handle an authenticated user
    return (
      <>
        <div className="form-control w-full mt-4">
          <label className="label">
            <p>Select a patient to add to your list</p>
          </label>
          <select className="select select-bordered w-full max-w-md">
            <option disabled selected>
              Select an email address
            </option>
            <option>Han Solo</option>
            <option>Greedo</option>
          </select>
          <input
            // type={type || 'text'}
            // value={value}
            // placeholder={placeholder || ''}
            // onChange={(e) => updateInputValue(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <p>User {user?.email?.address} is logged in.</p>)
      </>
    )
  }
}

export default PatientDashboard
