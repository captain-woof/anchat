import { useParams, useNavigate } from 'react-router-dom'
import { useRoom, useRoomSession } from '../../../hooks/rooms'
import Container from '../../atoms/container'
import SendMessageBox from './sendMessageBox'
import MessagesScrollView from './messagesScrollview'
import RoomDetails from './roomDetails'
import InviteDialog from './inviteDialog'
import { useEffect, useState } from 'react'
import { useUser } from '../../../hooks/user'

export default function Room() {
    const { user, userPending } = useUser()
    const { roomId } = useParams()
    useRoomSession(roomId as string)
    const [inviteDialogVisible, setInviteDialogVisible] = useState<boolean>(true)
    const navigate = useNavigate()
    const { roomExists } = useRoom(roomId as string)

    /* Redirect to login page if unauthenticated */
    useEffect(() => {
        if (!user && !userPending) {
            navigate('/login', { state: `/room/${roomId}` })
        }
    }, [user, userPending])

    return (
        <Container style={{
            height: 'calc(100vh - var(--height-navbar))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <InviteDialog roomId={roomId as string} roomExists={roomExists} inviteDialogVisible={inviteDialogVisible} setInviteDialogVisible={setInviteDialogVisible} />
            <RoomDetails roomId={roomId as string} setInviteDialogVisible={setInviteDialogVisible} roomExists={roomExists} />
            <MessagesScrollView roomId={roomId as string} roomExists={roomExists} />
            <SendMessageBox roomId={roomId as string} roomExists={roomExists} />
        </Container>
    )
}