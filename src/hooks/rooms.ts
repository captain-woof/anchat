import { doc, query } from "@firebase/firestore"
import { useEffect, useState } from "react"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"
import { Room } from "../../types/room"
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

// Used to add/remove user in room
export const useRoomSession = (roomId: string) => {
    const { user, addUserToRoom, removeUserFromRoom } = useUser()
    const [roomExists, setRoomExists] = useState<boolean>(false)
    const [roomDoc] = useDocument(doc(getDB(), `/rooms/${roomId}`))

    // Handles user add/remove from room upon visibility change
    useEffect(() => {
        async function handleVisibilityChange(): Promise<any> {
            if (document.visibilityState == 'hidden') {
                await removeUserFromRoom(roomId)
            } else {
                await addUserToRoom(roomId)
            }
        }
        if (!!user && roomExists) {
            addUserToRoom(roomId)
            document.addEventListener('visibilitychange', handleVisibilityChange)
            return () => { document.removeEventListener('visibilitychange', handleVisibilityChange) }
        }
    }, [user, roomExists])

    // Keeps track if room exists
    useEffect(() => {
        setRoomExists(!!roomDoc)
    }, [roomDoc])

    return {
        roomExists
    }
}