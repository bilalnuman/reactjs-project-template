import SignInForm from '@/UI/authForms/SignInForm'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='text-white py-5 text-center bg-indigo-300'>
        <Link href='/widgets'>Widgets</Link>
      </div>
      <SignInForm/>
    </div>
  )
}

export default page