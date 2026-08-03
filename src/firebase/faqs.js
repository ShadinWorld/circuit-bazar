import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./config"

const faqsRef = collection(db, "faqs")

export async function getAllFaqs() {
  const q = query(faqsRef, orderBy("order", "asc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function addFaq(faq) {
  return addDoc(faqsRef, {
    ...faq,
    createdAt: serverTimestamp(),
  })
}

export async function updateFaq(id, updates) {
  const ref = doc(db, "faqs", id)
  return updateDoc(ref, updates)
}

export async function deleteFaq(id) {
  const ref = doc(db, "faqs", id)
  return deleteDoc(ref)
}
