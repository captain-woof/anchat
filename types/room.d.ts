import { DocumentReference, DocumentData } from 'firebase/firestore'
import { User } from '../types/user'

export type Room = {
    name: string,
    usersInRoom: { [key: string]: User },
    shouldBeRemoved: boolean,
    id?: string,
    ref?: DocumentReference<DocumentData>
}