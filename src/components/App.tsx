import { getApp } from '@firebase/app'
import { getAuth, getRedirectResult } from '@firebase/auth'
import { doc, setDoc } from '@firebase/firestore'
import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUser } from '../hooks/user'
import { getDB } from '../lib/firebase'
import Navbar from './molecules/navbar'
import Loading from './pages/loading'
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
                }, { merge: true, mergeFields: ['uid', 'name', 'displayPic', 'roomCreated'] })
            }
        })()
    }, [])

    return (
        <BrowserRouter>
            <PageProgressProvider>
                <Navbar />
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={!user ? <LandingPage /> : <Rooms />} />
                        <Route path='/room/:roomId' element={<Room />} />
                    </Routes>
                </Suspense>
            </PageProgressProvider>
        </BrowserRouter>
    )
}

// Lazy comps
const LandingPage = lazy(() => import('./pages/landing'))
const Rooms = lazy(() => import('./pages/rooms'))
const Room = lazy(() => import('./pages/room'))