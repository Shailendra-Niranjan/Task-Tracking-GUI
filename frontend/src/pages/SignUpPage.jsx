import React from 'react'
import NavBar from '../components/NavBar'
import SignUpForm from '../components/SignUpForm'
import NavBarForAuth from '../components/NavBarForAuth'

function SignUpPage() {
  return (
     <>
     <NavBarForAuth/>
     <SignUpForm/>
     </>
  )
}

export default SignUpPage