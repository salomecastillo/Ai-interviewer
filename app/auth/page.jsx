"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { useRouter } from 'next/navigation'

function Login() {
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/dashboard');
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  /** use to sign in with google  */
  const signInWithGoogle=async()=>{
    const {error}=await supabase.auth.signInWithOAuth({
      provider:'google'
    })

    if(error)
    {
      console.error('Error:', error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center
    h-screen'>
      <div className='border rounded-2xl p-8'>
      {/*logo */}
        <Image src={'/react-logo.png'} alt='logo' 
        width={100} 
        height={100}
        />
        <div className='flex items-center flex-col'>
          <Image src={'/banner1.png'} alt ='login'
          width={600}
          height={400}
          className='w-[800px] h-[533px] rounded-2xl'
          />
          <h2 className='text-2xl font-bold text-center mt-5'> Welcome to Interviewed </h2>
          <p className ='text-gray-500 text-center'> Sign In With Google Authentication</p>
        
          <Button className='mt-7 w-full'
            onClick={signInWithGoogle}> Login with Google </Button>
        </div>

      </div>
    </div>
  )
}

export default Login