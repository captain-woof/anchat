import { useRooms } from '../../../hooks/rooms'
import { CenteredContainer } from '../../atoms/container'
import styles from './styles.module.css'
import { MdPeople as PeopleIcon, MdOutlinePeopleAlt as JoinRoomIcon } from 'react-icons/md'
import { GiEarthAmerica as GlobalIcon } from 'react-icons/gi'
import { BiMessageRoundedAdd as CreateRoomIcon } from 'react-icons/bi'
import { useCallback, useState } from 'react'
import RoomsDialog from './rooms_dialog'
import { useUser } from '../../../hooks/user'
import { usePageProgress } from '../../../hooks/page_progress'
import { useNavigate } from 'react-router-dom'

export default function Rooms() {
    const { rooms } = useRooms()
    const { createRoom, deleteRoom, roomCreated } = useUser()
    const { setProgress } = usePageProgress()
    const [createRoomDialogShow, setCreateRoomDialogShow] = useState<boolean>(false)
    const [joinRoomDialogShow, setJoinRoomDialogShow] = useState<boolean>(false)
    const [errorShow, setErrorShow] = useState<boolean>(false)
    const [text, setText] = useState<string>('')
    const navigate = useNavigate()

    /* Custom room functions */
    const handleCreateRoom = useCallback(async () => {
        setProgress(true)
        const roomCreatedRef = await createRoom(text)
        setCreateRoomDialogShow(false)
        setProgress(false)
        !!roomCreatedRef ? navigate(`/room/${roomCreatedRef?.id}`) : setErrorShow(true)
    }, [text, roomCreated])

    const handleJoinRoom = useCallback(() => {
        setCreateRoomDialogShow(false)
        navigate(`/room/${text}`)
    }, [text])

    const handleDeleteRoom = useCallback(async () => {
        setProgress(true)
        const deleteRes = await deleteRoom()
        if(typeof deleteRes === 'boolean' && !deleteRes) setErrorShow(true)
        setProgress(false)
    }, [roomCreated])

    return (
        <CenteredContainer style={{
            justifyContent: 'flex-start',
        }}>
            {/* Dialog boxes */}
            {/* Error dialog */}
            {errorShow &&
                <RoomsDialog isOpen={errorShow} setIsOpen={setErrorShow} inputTextRequired={false} title="Error" captionNeeded caption="Please try again." buttonText="Close" buttonClickFunc={() => { setErrorShow(false) }} />
            }

            {/* Create a room dialog */}
            {!!roomCreated
                ? <RoomsDialog isOpen={createRoomDialogShow} setIsOpen={setCreateRoomDialogShow} inputTextRequired={false} title="Previous room exists" captionNeeded caption="You must delete the previous room to continue." buttonText="Delete" buttonClickFunc={() => { handleDeleteRoom() }} />
                : <RoomsDialog isOpen={createRoomDialogShow} setIsOpen={setCreateRoomDialogShow} title="Name your room" inputText={text} inputTextPlaceholder="Enter room name" setInputText={setText} label="Name your room" buttonText="Create" buttonClickFunc={() => { handleCreateRoom() }} />
            }
            {/* Join a room dialog */}
            <RoomsDialog isOpen={joinRoomDialogShow} setIsOpen={setJoinRoomDialogShow} title="Enter room ID" inputText={text} inputTextPlaceholder="Enter room ID" setInputText={setText} label="Enter room ID" buttonText="Join" buttonClickFunc={() => { handleJoinRoom() }} />

            {/* Page content */}
            <h1 className={styles.title}>Rooms</h1>
            <div className={styles.button_container}>
                {/* GLOBAL ROOMS */}
                {rooms
                    .filter((room) => !room.shouldBeRemoved)
                    .sort((room1, room2) => room1.name < room2.name ? -1 : 1)
                    .map((globalRoom) => (
                        <button className={styles.global_room_button} key={globalRoom.id}>
                            <div className={styles.global_icon}>
                                <GlobalIcon />
                            </div>
                            <span className={styles.global_room_button_text}>
                                {globalRoom.name}
                            </span>
                            <span className={styles.global_room_button_people_num}>
                                <PeopleIcon /> {globalRoom.usersInRoom.length}
                            </span>
                        </button>
                    ))
                }
                {/* Create room button */}
                <button className={styles.custom_room_button} onClick={() => { setCreateRoomDialogShow(true) }}>
                    <CreateRoomIcon /> Create a room
                </button>

                {/* Join room button */}
                <button className={styles.custom_room_button} onClick={() => { setJoinRoomDialogShow(true) }}>
                    <JoinRoomIcon /> Join a room
                </button>
            </div>
        </CenteredContainer>
    )
}