import { useContext } from "react"
import { UserContext } from "../components/providers/user"

export const useUser = () => {
    const { user, userError, userPending, addUserToRoom, removeUserFromAllRooms, removeUserFromRoom, deleteRoom, roomCreated, sendText, createRoom, userDoc } = useContext(UserContext)

    return {
        user,
        userError,
        userPending,
        addUserToRoom,
        removeUserFromRoom,
        removeUserFromAllRooms,
        deleteRoom,
        roomCreated,
        sendText,
        createRoom,
        userDoc
    }
}