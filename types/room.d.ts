import { DocumentReference, DocumentData } from 'firebase/firestore'
import { UserInRoom } from '../types/user'

export type Room = {
    name: string,
    usersInRoom: { [key: string]: UserInRoom },
    shouldBeRemoved: boolean,
    id?: string,
    ref?: DocumentReference<DocumentData>,
    numOfActiveUsers?: number
}