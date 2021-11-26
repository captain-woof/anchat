import { getApp } from '@firebase/app'
import { getAuth, getRedirectResult } from '@firebase/auth'
import { doc, setDoc } from '@firebase/firestore'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUser } from '../hooks/user'
import { getDB } from '../lib/firebase'
import Navbar from './molecules/navbar'
import LandingPage from './pages/landing'
import Room from './pages/room'
import Rooms from './pages/rooms'
import PageProgressProvider from './providers/page_progress'

export default function App() {
    const { user } = useUser()

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
                })
            }
        })()
    }, [])

    return (
        <BrowserRouter>
            <PageProgressProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={!user ? <LandingPage /> : <Rooms />} />
                    <Route path='/room/:roomId' element={<Room />} />
                </Routes>
            </PageProgressProvider>
        </BrowserRouter>
    )
}