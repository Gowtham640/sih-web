'use client'
import LoginForm from '../../../components/LoginForm'

export default function AthleteLogin() {
  return (
    <LoginForm
      type="athlete"
      title="Athlete Login"
      redirectPath="/athlete/dashboard"
    />
  )
}
