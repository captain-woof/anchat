import { Timestamp, addDoc, doc, getDoc } from 'firebase/firestore'
import { getDB, messagesRef, roomsRef } from './firebase'

// Function to send message
type SendMsg = {
    body: string,
    uid: string,
    roomId: string
}

export const sendText = async ({ body, uid, roomId }: SendMsg) => {
    try {
        return await addDoc(messagesRef, {
            body,
            sender: doc(getDB(), `/users/${uid}`),
            timestamp: new Timestamp(Date.now() / 1000, 0),
            room: doc(getDB(), `/rooms/${roomId}`)
        })
    } catch (err) {
        throw err
    }
}

// Function to create a room

type CreateRoom = {
    roomName: string
}

export const createRoom = async ({ roomName }: CreateRoom) => {
    try {
        return await addDoc(roomsRef, {
            name: roomName,
            usersInRoom: [],
            shouldBeRemoved: true
        })
    } catch (err) {
        throw err
    }
}

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
