import { useRoom } from "../../../hooks/rooms"
import styles from './styles.module.css'
import { MdPeople as PeopleIcon } from 'react-icons/md'

interface IRoomDetails {
    roomId: string
    setInviteDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
    roomExists: boolean
}

export default function RoomDetails({ roomId, setInviteDialogVisible, roomExists }: IRoomDetails) {
    const { room: { name, numOfActiveUsers } } = useRoom(roomId)

    return (
        <div className={styles.room_details_container} onClick={() => { setInviteDialogVisible(true) }}>
            <div className={styles.room_name}>{roomExists ? name : "Room does not exist!"}</div>
            <div className={styles.room_active_users_num}>
                <PeopleIcon />
                {numOfActiveUsers}
            </div>
        </div>
    )
}