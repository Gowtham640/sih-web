'use client'
import LoginForm from '../../../components/LoginForm'

export default function CoachLogin() {
  return (
    <LoginForm
      type="coach"
      title="Coach Login"
      redirectPath="/coach/dashboard"
    />
  )
}
