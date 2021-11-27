import styles from './styles.module.css'
import { useParams } from 'react-router-dom'
import { useMessages } from '../../../hooks/messages'
import { useRoomSession } from '../../../hooks/rooms'
import Container from '../../atoms/container'
import SendMessageBox from './sendMessageBox'

export default function Room() {
    const { roomId } = useParams()
    const { messages } = useMessages(roomId as string)
    const { roomExists } = useRoomSession(roomId as string)

    return (
        <Container style={{ height: 'calc(100vh - var(--height-navbar))' }}>
            <SendMessageBox roomId={roomId as string} roomExists={roomExists}/>
        </Container>
    )
}