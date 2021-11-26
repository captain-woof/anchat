import { getDB, messagesRef } from '../lib/firebase'
import { query, where, doc, limit, orderBy } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Message } from '../../types/message'

// Used to see messages
export const useMessages = (roomId: string, limitMsgs: number = 25) => {
    const roomRef = doc(getDB(), `/rooms/${roomId}`)
    const [messages, pending, error] = useCollection(query(messagesRef, where('room', '==', roomRef), limit(limitMsgs), orderBy('timestamp')))

    return {
        messages: messages
            ? messages.docs.map((message) => ({
                ...message.data(),
                timestamp: message.data().timestamp.toMillis(),
                id: message.id
            } as Message))
            : [],
        pending,
        error
    }
}