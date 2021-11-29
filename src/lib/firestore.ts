import { doc, getDoc } from 'firebase/firestore'
import { UserInRoom } from '../../types/user'
import { getDB } from './firebase'

// Function to get num of users in a room
type GetUsersInRoom = {
    roomId: string
}

export const getNumOfUsersInRoom = async ({ roomId }: GetUsersInRoom) => {
    try {
        const roomRef = doc(getDB(), `/rooms/${roomId}`)
        const usersInRoom = (await getDoc(roomRef)).data()?.usersInRoom as { [key: string]: UserInRoom }

        return Object.entries(usersInRoom)
            .filter(([, userInRoom]) => (userInRoom.presentInRoom))
            .length
    } catch (err) {
        return 0
    }
}

export const getUsersInRoom = async ({ roomId }: GetUsersInRoom) => {
    try {
        const roomRef = doc(getDB(), `/rooms/${roomId}`)
        return (await getDoc(roomRef)).data()?.usersInRoom as { [key: string]: UserInRoom }
    } catch (err) {
        return {}
    }
}

// Function to know if room is removable

type IsRoomRemovable = {
    roomId: string
}

export const isRoomRemovable = async ({ roomId }: IsRoomRemovable) => {
    try {
        const roomRef = doc(getDB(), `/rooms/${roomId}`)
        return (await getDoc(roomRef)).data()?.shouldBeRemoved as boolean
    } catch (err) {
        throw true
    }
}
