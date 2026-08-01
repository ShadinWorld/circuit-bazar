import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./config"

const productsRef = collection(db, "products")

export async function getAllProducts() {
  const q = query(productsRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function getProductById(id) {
  const ref = doc(db, "products", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function addProduct(product) {
  return addDoc(productsRef, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProduct(id, updates) {
  const ref = doc(db, "products", id)
  return updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id) {
  const ref = doc(db, "products", id)
  return deleteDoc(ref)
}
