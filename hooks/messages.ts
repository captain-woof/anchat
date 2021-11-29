/* eslint-disable react-hooks/exhaustive-deps */
import { messagesRef } from '../lib/firebase'
import { query, where, limit, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Message } from '../types/message'
import { useCallback, useEffect, useState } from 'react'

const structureMessages = (messagesFromFirestore: QuerySnapshot<DocumentData> | undefined) => (!!messagesFromFirestore
    ? messagesFromFirestore.docs
        .reverse()
        .map((messageFromFirestore) => ({
            ...messageFromFirestore.data(),
            timestamp: messageFromFirestore.data().timestamp.toMillis(),
            id: messageFromFirestore.id
        } as Message))
    : []
)

// Used to see messages
export const useMessages = (roomId: string, initialMsgsToLoadNum: number = 100, loadNumMsgsWhilePaginating: number = 25) => {
    const [messagesNumToLoad, setMessagesNumToLoad] = useState<number>(initialMsgsToLoadNum)
    const [messagesFromFirestore, pending, error] = useCollection(query(messagesRef, where('roomId', '==', roomId), limit(messagesNumToLoad), orderBy('timestamp', 'desc')))
    const [messages, setMessages] = useState<Message[]>([])

    // Function to prepend/append messages to state
    useEffect(() => {
        const newMessages = structureMessages(messagesFromFirestore)

        if (!messages.length) { // For first time
            setMessages(newMessages)
        }

        // If first elements of both the 'messages state' and 'new messages' match,
        // then new data must have come towards the end.
        // Likewise, if the last elements match, new data must have come at the beginning
        else if (!!newMessages.length) {
            if (messages[messages.length - 1].id === newMessages[newMessages.length - 1].id) {
                setMessages(prevMessages => newMessages
                    .slice(0, newMessages.length - prevMessages.length)
                    .concat(prevMessages)
                )
            } else {
                setMessages((prevMessages) => (
                    prevMessages.concat([newMessages[newMessages.length - 1]])
                ))
            }
        }
    }, [messagesFromFirestore])

    // Function to handle pagination
    const loadMoreMsgs = useCallback(() => {
        setMessagesNumToLoad(prevMsgsNum => prevMsgsNum + loadNumMsgsWhilePaginating)
    }, [setMessagesNumToLoad])

    return {
        messages,
        pending,
        error,
        loadMoreMsgs
    }
}
