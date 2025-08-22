"use client"

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Home() {
  const { data: session } = useSession()
  const handleGuestMode = () => {
    alert('Continue as Guest');
  };

  return (
    <>
      <Head>
        <title>Manu Todo List</title>
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 transition-colors">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-10">
          Manu Todo List
        </h1>

        <div className="space-y-4 w-full max-w-xs">
          { !session ? (
            <>
              <Button
                onClick={() => signIn("google")}
                variant="default"
                className="w-full border pointer border-input bg-white text-black hover:bg-white transition-colors rounded-md py-2 text-sm"
              >
                Sign in with Google
              </Button>

              {/* <Button
                onClick={handleGuestMode}
                variant="link"
                className="w-full text-sm underline hover:bg-transparant pointer"
              >
                Guest Mode
              </Button> */}
            </>

          ) : (
            <>
              <p>Logged to {session.user?.email}</p>
              <Button variant="destructive" onClick={() => signOut()}>Logout</Button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
