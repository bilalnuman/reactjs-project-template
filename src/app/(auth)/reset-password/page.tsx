import ResetPasswordForm from '@/UI/authForms/ResetPasswordForm'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='bg-black text-white py-5 text-center'>
        <Link href='/widgets'>Widgets</Link>
      </div>
      <ResetPasswordForm/>
    </div>
  )
}

export default page