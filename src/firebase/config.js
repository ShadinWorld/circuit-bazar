import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCL4XZpDMOpb3sCdRgFytztcC1_EjHkXxc",
  authDomain: "circuit-bazar.firebaseapp.com",
  projectId: "circuit-bazar",
  storageBucket: "circuit-bazar.firebasestorage.app",
  messagingSenderId: "590294869312",
  appId: "1:590294869312:web:42254ed6c499aa5cb846a5",
  measurementId: "G-9GZT5HJRE2",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
