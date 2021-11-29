import '../styles/index.css'
import type { AppProps } from 'next/app'
import PageProgressProvider from '../components/providers/page_progress'
import UserProvider from '../components/providers/user'
import Navbar from '../components/molecules/navbar'
import { useEffect } from 'react'
import { getAuth, getRedirectResult } from '@firebase/auth'
import { getApp } from '@firebase/app'
import { doc, setDoc } from '@firebase/firestore'
import { getDB } from '../lib/firebase'

function MyApp({ Component, pageProps }: AppProps) {
    // If user arrives from login redirection, enter user data to database
    useEffect(() => {
        (async () => {
            const result = await getRedirectResult(getAuth(getApp()));
            if (!!result) { // Store user info in firestore
                const { user: { photoURL, displayName, uid } } = result
                await setDoc(doc(getDB(), `/users/${uid}`), {
                    uid,
                    name: displayName,
                    displayPic: photoURL
                }, { merge: true, mergeFields: ['uid', 'name', 'displayPic', 'roomCreated'] })
            }
        })()
    }, [])


  return (
    <PageProgressProvider>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
      </UserProvider>
    </PageProgressProvider>
  )
}

export default MyApp
