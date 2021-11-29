/* eslint-disable react-hooks/exhaustive-deps */
import { doc, query } from "@firebase/firestore"
import { useEffect, useMemo } from "react"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"
import { Room } from "../types/room"
import { UserInRoom } from "../types/user"
import { getDB, roomsRef } from "../lib/firebase"
import { useUser } from "./user"

// Used to see rooms
export const useRooms = () => {
    const [rooms, pending, error] = useCollection(query(roomsRef))
    return {
        rooms: rooms?.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            ref: doc.ref
        } as Room)) || [],
        pending,
        error
    }
}

// Used to see a specific room
export const useRoom = (roomId: string) => {
    const [room, roomPending, roomError] = useDocument(doc(getDB(), `/rooms/${roomId}`))
    const numOfActiveUsers = useMemo(() => {
        if (!!(room?.data()?.usersInRoom)) {
            return Object.entries(room?.data()?.usersInRoom as { [key: string]: UserInRoom })
                .filter(([, userInRoom]) => (userInRoom.presentInRoom))
                .length
        } else {
            return 0
        }
    }, [room])
    return {
        room: {
            ...room?.data(),
            numOfActiveUsers
        } as Room,
        roomPending,
        roomError,
        roomExists: room ? room.exists() : false
    }
}

// Used to add/remove user in room
export const useRoomSession = (roomId: string) => {
    const { user, addUserToRoom, removeUserFromRoom } = useUser()
    const { roomExists } = useRoom(roomId)

    // Handles user add/remove from room upon visibility change
    useEffect(() => {
        async function handleVisibilityChange(): Promise<any> {
            if (document.visibilityState == 'hidden') {
                !!removeUserFromRoom && await removeUserFromRoom(roomId)
            } else {
                !!addUserToRoom && await addUserToRoom(roomId)
            }
        }
        if (!!user && roomExists) {
            console.log('starting room session')
            addUserToRoom && addUserToRoom(roomId)
            document.addEventListener('visibilitychange', handleVisibilityChange)
            return () => { document.removeEventListener('visibilitychange', handleVisibilityChange) }
        }
    }, [user, roomExists])
}