import { DocumentReference, DocumentData } from 'firebase/firestore'

export type Message = {
    body: string,
    id?: string,
    roomId: string,
    senderUid: string,
    timestamp: number
}