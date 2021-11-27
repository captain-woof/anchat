import { DocumentReference, DocumentData } from 'firebase/firestore'

export type User = {
    uid: string
    name: string
    displayPic: string
    roomCreated: DocumentReference<DocumentData> | null
}