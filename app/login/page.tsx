"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { message } from 'antd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FaGoogle } from 'react-icons/fa';
import { db } from '@/utils/firebase';

function Login() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [ isLoading, setIsLoading ] = useState(true)

  // Sign in with Google
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      router.push('/');
      message.success('Signed in successfully');

      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', res.user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const docRef = await addDoc(userRef, {
          name: res.user.displayName,
          email: res.user.email,
          profileImg: res.user.photoURL,
        });
        console.log('Document written with ID:', docRef.id);
      } else {
        console.log('User already exists.');
      }
    } catch (err) {
      message.error('Error signing in');
      console.error(err);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      {isLoading ? 
        <>
          <div className="flex justify-center items-center h-screen w-full">
            <div
              className="p-8 rounded-lg flex flex-col justify-center items-center m-5 shadow-xl border border-[#242627]"
            >
              <h1 className="text-4xl font-medium mb-5">Moodboard</h1>
              <p className="mb-5 text-[#777777] text-center">Login to your account to view the posts</p>
              <button
                className="bg-[--foreground] transition-all duration-300 hover:shadow-xl rounded-lg px-4 py-2 text-[--background] font-medium flex justify-center items-center gap-1"
                onClick={handleLogin}
              >
                <FaGoogle />
                Sign in with Google
              </button>
            </div>
          </div>
        </>
       : 
       null}
    </>
  );
}

export default Login