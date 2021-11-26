import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUser } from '../hooks/user'
import Navbar from './molecules/navbar'
import LandingPage from './pages/landing'
import Room from './pages/room'
import Rooms from './pages/rooms'
import PageProgressProvider from './providers/page_progress'

export default function App() {
    const { user } = useUser()

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