import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "./config"

const areasRef = collection(db, "deliveryAreas")

export async function getAllDeliveryAreas() {
  const q = query(areasRef, orderBy("name"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function addDeliveryArea(area) {
  return addDoc(areasRef, area)
}

export async function updateDeliveryArea(id, updates) {
  const ref = doc(db, "deliveryAreas", id)
  return updateDoc(ref, updates)
}

export async function deleteDeliveryArea(id) {
  const ref = doc(db, "deliveryAreas", id)
  return deleteDoc(ref)
}
