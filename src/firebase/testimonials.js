import { collection, doc, addDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const testimonialsRef = collection(db, "testimonials")

export async function getAllTestimonials() {
  const snapshot = await getDocs(testimonialsRef)
  const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
  return items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

export async function addTestimonial(testimonial) {
  return addDoc(testimonialsRef, {
    ...testimonial,
    createdAt: serverTimestamp(),
  })
}

export async function deleteTestimonial(id) {
  const ref = doc(db, "testimonials", id)
  return deleteDoc(ref)
}
