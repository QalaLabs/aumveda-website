'use client'

import { useSession } from 'next-auth/react'

export interface PortalAuthState {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function usePortalAuth(): PortalAuthState {
  const { data: session, status } = useSession()

  return {
    userId: session?.user?.id ?? null,
    email: session?.user?.email ?? null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  }
}
