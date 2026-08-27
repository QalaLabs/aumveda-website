import { redirect } from 'next/navigation'

export default function CoachLoginPage() {
  redirect('/auth/login?portal=coach')
}
