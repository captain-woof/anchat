import { getApp } from "@firebase/app"
import { getAuth } from "@firebase/auth"
import { collection, doc, getDocs, setDoc, deleteDoc } from "@firebase/firestore"
import { useCallback } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { getDB } from "../lib/firebase"
import { getUserIdsInRoom } from "../lib/firestore"

type UserRoomInteraction = {
    roomId: string
}

export const useUser = () => {
    const [user, userPending, userError] = useAuthState(getAuth(getApp()))

    // Functions to add/remove user to room

    const addUserToRoom = useCallback(async (roomId: string) => {
        if (!user) return
        try {
            const roomRef = doc(getDB(), `/rooms/${roomId}`)
            const usersInRoom = await getUserIdsInRoom({ roomId })
            if (!usersInRoom.includes(user.uid)) {
                return setDoc(roomRef, {
                    usersInRoom: usersInRoom.concat(user.uid)
                }, { merge: true, mergeFields: ['name', 'usersInRoom'] })
            }
        } catch (err) {
            throw err
        }
    }, [user])

    const removeUserFromRoom = useCallback(async (roomId: string) => {
        if (!user) return
        try {
            const roomRef = doc(getDB(), `/rooms/${roomId}`)
            const usersInRoom = await getUserIdsInRoom({ roomId })
            if (usersInRoom.includes(user.uid)) {
                usersInRoom.splice(usersInRoom.indexOf(user.uid), 1)
                if (!usersInRoom.length) { // If room is empty, delete it
                    return deleteDoc(roomRef)
                }
                return setDoc(roomRef, {
                    usersInRoom
                }, { merge: true, mergeFields: ['name', 'usersInRoom'] })
            }
        } catch (err) {
            throw err
        }
    }, [user])

    const removeUserFromAllRooms = useCallback(async () => {
        if (!user) return
        try {
            (await getDocs(collection(getDB(), 'rooms'))).docs.forEach(async (doc) => {
                if (doc.data().usersInRoom.includes(user.uid)) {
                    const prevUsers = doc.data().usersInRoom as string[]
                    prevUsers.splice(prevUsers.indexOf(user.uid), 1)
                    if (!prevUsers.length) { // If room is empty, delete it
                        await deleteDoc(doc.ref)
                    }
                    await setDoc(doc.ref, {
                        usersInRoom: prevUsers
                    }, { merge: true, mergeFields: ['name', 'usersInRoom'] })
                }
            })
            return
        } catch (err) {
            throw err
        }
    }, [user])

    return {
        user,
        userError,
        userPending,
        addUserToRoom,
        removeUserFromRoom,
        removeUserFromAllRooms
    }
}