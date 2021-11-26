import { Timestamp, addDoc, doc, getDoc } from 'firebase/firestore'
import { getDB, messagesRef, roomsRef } from './firebase'

// Function to get num of users in a room
type GetUsersInRoom = {
    roomId: string
}

export const getNumOfUsersInRoom = async ({ roomId }: GetUsersInRoom) => {
    try {
        const roomRef = doc(getDB(), `/rooms/${roomId}`)
        return (await getDoc(roomRef)).data()?.usersInRoom.length as number
    } catch (err) {
        throw 0
    }
}

export const getUserIdsInRoom = async ({ roomId }: GetUsersInRoom) => {
    try {
        const roomRef = doc(getDB(), `/rooms/${roomId}`)
        return (await getDoc(roomRef)).data()?.usersInRoom as string[]
    } catch (err) {
        return []
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
