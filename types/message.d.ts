import { DocumentReference, DocumentData } from 'firebase/firestore'

export type Message = {
    body: string,
    id?: string,
    ref?: DocumentReference<DocumentData>,
    room: DocumentReference<DocumentData>,
    uid: string,
    timestamp: number
}