import { DocumentReference, DocumentData } from 'firebase/firestore'


export type Room = {
    name: string,
    usersInRoom: string[],
    id?: string,
    ref?: DocumentReference<DocumentData>
}