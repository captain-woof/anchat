import { getApp } from "@firebase/app"
import { getAuth } from "@firebase/auth"
import { collection, doc, getDocs, setDoc, deleteDoc, DocumentReference, DocumentData, addDoc, Timestamp, query, where, getDoc } from "@firebase/firestore"
import { useCallback, useMemo } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { getDB, messagesRef, roomsRef } from "../lib/firebase"
import { getUserIdsInRoom } from "../lib/firestore"
import { useDocument } from 'react-firebase-hooks/firestore'

export const useUser = () => {
    const [user, userPending, userError] = useAuthState(getAuth(getApp()))

    // Get room created
    const [userDoc] = useDocument(doc(getDB(), `/users/${user?.uid}`))
    const roomCreated = useMemo(() => (userDoc?.data()?.roomCreated as DocumentReference<DocumentData>), [userDoc])

    // Function to add user to room
    const addUserToRoom = useCallback(async (roomId: string) => {
        if (!user) return null
        try {
            const roomRef = doc(getDB(), `/rooms/${roomId}`)
            const usersInRoom = await getUserIdsInRoom({ roomId })
            if (!usersInRoom.includes(user.uid)) {
                return setDoc(roomRef, {
                    usersInRoom: usersInRoom.concat(user.uid)
                }, { merge: true, mergeFields: ['usersInRoom'] })
            }
        } catch (err) {
            throw err
        }
    }, [user])

    // Function to delete user's room
    const deleteRoom = useCallback(async () => {
        try {
            if (user && roomCreated) {
                const shouldRoomBeRemoved = (await getDoc(roomCreated)).data()?.shouldBeRemoved
                if (!shouldRoomBeRemoved) return true

                // Delete all messages in room
                const messagesInRoom = await getDocs(query(
                    messagesRef,
                    where('room', '==', roomCreated)
                ))
                const deleteMessagesPromises: Promise<void>[] = []
                messagesInRoom.forEach((messageInRoom) => {
                    deleteMessagesPromises.push(deleteDoc(messageInRoom.ref))
                })

                // Delete room
                const deleteRoomPromise = deleteDoc(roomCreated)

                // Set room created to null
                let resetRoomCreatedPromise = null
                if (!!userDoc) {
                    resetRoomCreatedPromise = setDoc(userDoc.ref, { roomCreated: null }, {
                        merge: true,
                        mergeFields: ['roomCreated']
                    })
                }

                // Resolve all promises
                await Promise.all([...deleteMessagesPromises, deleteRoomPromise, resetRoomCreatedPromise])
            }
            return true
        } catch {
            return false
        }
    }, [user, userDoc, roomCreated])

    // Function to remove user from room
    const removeUserFromRoom = useCallback(async (roomId: string) => {
        if (!user) return null
        try {
            const roomRef = doc(getDB(), `/rooms/${roomId}`)
            const usersInRoom = await getUserIdsInRoom({ roomId })
            if (usersInRoom.includes(user.uid)) {
                usersInRoom.splice(usersInRoom.indexOf(user.uid), 1)
                return await setDoc(roomRef, {
                    usersInRoom
                }, { merge: true, mergeFields: ['usersInRoom'] })
            }
            return null
        } catch (err) {
            throw err
        }
    }, [user])

    // Function to remove user from all rooms
    const removeUserFromAllRooms = useCallback(async () => {
        if (!user) return null
        const removeUserFromRoomsPromises: Promise<any>[] = []
        try {
            (await getDocs(collection(getDB(), 'rooms'))).docs.forEach((roomDoc) => {
                if (roomDoc.data().usersInRoom.includes(user.uid)) {
                    const prevUsers = roomDoc.data().usersInRoom as string[]
                    prevUsers.splice(prevUsers.indexOf(user.uid), 1)
                    removeUserFromRoomsPromises.push(setDoc(roomDoc.ref, {
                        usersInRoom: prevUsers
                    }, { merge: true, mergeFields: ['usersInRoom'] }))
                }
            })
            return await Promise.all(removeUserFromRoomsPromises)
        } catch (err) {
            throw err
        }
    }, [user])

    // Function to send text
    const sendText = useCallback(async (body: string, roomId: string) => {
        if (!!user) {
            try {
                return await addDoc(messagesRef, {
                    body,
                    sender: userDoc?.ref,
                    timestamp: new Timestamp(Date.now() / 1000, 0),
                    room: doc(getDB(), `/rooms/${roomId}`)
                })
            } catch (err) {
                throw err
            }
        }
        return null
    }, [user])

    // Function to create a room
    const createRoom = useCallback(async (roomName: string) => {
        if (!!user && !roomCreated) {
            try {
                // Create room and get ref to it
                const roomCreatedRef = await addDoc(roomsRef, {
                    name: roomName,
                    usersInRoom: [],
                    shouldBeRemoved: true
                })

                // Add room ref to user
                userDoc && await setDoc(userDoc.ref, { roomCreated: roomCreatedRef }, { merge: true, mergeFields: ['roomCreated'] })

                return roomCreatedRef
            } catch (err) {
                throw err
            }
        }
        return null
    }, [user, userDoc, roomCreated])

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
        createRoom
    }
}