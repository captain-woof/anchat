import { useParams } from 'react-router-dom'

export default function Room() {
    const { roomId } = useParams()

    return (
        <h1>RoomID: {roomId}</h1>
    )
}