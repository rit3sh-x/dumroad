import { SignInView } from '@/modules/auth/ui/views/sign-in-view'
import { caller } from '@/trpc/server'
import { redirect } from 'next/navigation';
import React from 'react'

async function SignInPage() {
  const session = await caller.auth.session();

  if(session.user) {
    redirect("/");
  }
  return (
    <SignInView />
  )
}

export default SignInPage