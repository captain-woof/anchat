import { initializeApp, getApp, getApps } from "firebase/app";
import { GoogleAuthProvider, signInWithRedirect, getAuth, signOut } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'

// Initialize config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string
}
if (getApps().length === 0) {
    initializeApp(firebaseConfig)
}

//// Auth functions
const googleProvider = new GoogleAuthProvider()

// Login
export const handleLogin = async () => {
    const auth = getAuth(getApp())
    await signInWithRedirect(auth, googleProvider)
}
// Logout
export const handleLogout = async () => {
    await signOut(getAuth(getApp()))
}

//// Firestore
export const getDB = () => (getFirestore(getApp()))

export const roomsRef = collection((getDB()), 'rooms')

export const messagesRef = collection((getDB()), 'messages')

