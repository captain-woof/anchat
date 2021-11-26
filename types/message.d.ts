import { DocumentReference, DocumentData } from 'firebase/firestore'

export type Message = {
    body: string,
    id?: string,
    room: DocumentReference<DocumentData>,
    sender: DocumentReference<DocumentData>,
    timestamp: number
}