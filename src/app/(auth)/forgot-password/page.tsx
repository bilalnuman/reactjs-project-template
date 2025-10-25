import ForgotPasswordForm from '@/UI/authForms/ForgotPasswordForm'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='bg-black text-white py-5 text-center'>
        <Link href='/widgets'>Widgets</Link>
      </div>
      <ForgotPasswordForm/>
    </div>
  )
}

export default page