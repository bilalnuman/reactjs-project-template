import SignupForm from '@/UI/authForms/SignupForm'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='bg-black text-white py-5 text-center'>
        <Link href='/widgets'>Widgets</Link>
      </div>
      <SignupForm/>
    </div>
  )
}

export default page