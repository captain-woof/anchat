import { DocumentReference, DocumentData } from 'firebase/firestore'

export type Room = {
    name: string,
    usersInRoom: string[],
    shouldBeRemoved: boolean,
    id?: string,
    ref?: DocumentReference<DocumentData>
}