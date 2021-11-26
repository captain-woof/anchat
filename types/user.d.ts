import { DocumentReference, DocumentData } from 'firebase/firestore'

export type User = {
    uid: number
    name: string
    displayPic: string
    roomCreated: DocumentReference<DocumentData> | null
}