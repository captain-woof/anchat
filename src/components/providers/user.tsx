import { getApp } from "@firebase/app"
import { getAuth, User } from "@firebase/auth"
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "@firebase/firestore"
import { createContext, ReactNode, useCallback, useMemo } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useDocument } from "react-firebase-hooks/firestore"
import { UserInRoom } from "../../../types/user"
import { getDB, messagesRef, roomsRef } from "../../lib/firebase"

interface IUserContext {
    user?: User | null | undefined
    userPending?: boolean
    userError?: Error
    userDoc?: DocumentSnapshot<DocumentData> | undefined
    roomCreated?: DocumentReference<DocumentData>
    addUserToRoom?: (roomId: string) => Promise<void | null>
    removeUserFromRoom?: (roomId: string) => Promise<void | null>
    removeUserFromAllRooms?: () => Promise<any[] | null>
    deleteRoom?: () => Promise<boolean>
    sendText?: (body: string, roomId: string) => Promise<DocumentReference<DocumentData> | null>
    createRoom?: (roomName: string) => Promise<DocumentReference<DocumentData> | null>
}

export const UserContext = createContext<IUserContext>({})

export default function UserProvider({ children }: { children: ReactNode }) {
    const [user, userPending, userError] = useAuthState(getAuth(getApp()))
    // Get room created
    const [userDoc] = useDocument(doc(getDB(), `/users/${user?.uid}`))
    const roomCreated = useMemo(() => (userDoc?.data()?.roomCreated as DocumentReference<DocumentData>), [userDoc])

    // Function to add user to room
    const addUserToRoom = useCallback(async (roomId: string) => {
        if (!user) return null
        try {
            const roomRef = doc(getDB(), `/rooms/${roomId}`)
            return setDoc(roomRef, {
                usersInRoom: {
                    [user.uid]: {
                        name: user.displayName || 'Unknown',
                        displayPic: user.photoURL || '',
                        uid: user.uid,
                        presentInRoom: true
                    } as UserInRoom
                }
            }, { merge: true, mergeFields: ['usersInRoom', `usersInRoom['${user.uid}']`] })
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
                    where('roomId', '==', roomCreated.id)
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
            return setDoc(roomRef, {
                usersInRoom: {
                    [user.uid]: {
                        name: user.displayName || 'Unknown',
                        displayPic: user.photoURL || '',
                        uid: user.uid,
                        presentInRoom: false
                    } as UserInRoom
                }
            }, { merge: true, mergeFields: ['usersInRoom', `usersInRoom['${user.uid}']`] })
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
                const usersInRoom = roomDoc.data().usersInRoom
                delete usersInRoom[user.uid]
                removeUserFromRoomsPromises.push(updateDoc(roomDoc.ref, { usersInRoom }))
            })
            return Promise.all(removeUserFromRoomsPromises)
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
                    senderUid: user.uid,
                    timestamp: new Timestamp(Date.now() / 1000, 0),
                    roomId
                })
            } catch (err) {
                throw err
            }
        }
        return null
    }, [user, userDoc])

    // Function to create a room
    const createRoom = useCallback(async (roomName: string) => {
        if (!!user && !roomCreated) {
            try {
                // Create room and get ref to it
                const roomCreatedRef = await addDoc(roomsRef, {
                    name: roomName,
                    usersInRoom: {},
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

    return (
        <UserContext.Provider value={{
            user,
            userPending,
            userError,
            userDoc,
            roomCreated,
            addUserToRoom,
            removeUserFromRoom,
            removeUserFromAllRooms,
            deleteRoom,
            sendText,
            createRoom
        }}>
            {children}
        </UserContext.Provider>
    )
}
