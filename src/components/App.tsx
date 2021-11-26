import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUser } from '../hooks/user'
import Navbar from './molecules/navbar'
import LandingPage from './pages/landing'
import Room from './pages/room'
import Rooms from './pages/rooms'

export default function App() {
    const { user } = useUser()

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={!user ? <LandingPage /> : <Rooms />} />
                <Route path='/room/:roomId' element={<Room />} />
            </Routes>
        </BrowserRouter>
    )
}