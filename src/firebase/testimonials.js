import { collection, doc, addDoc, getDocs, deleteDoc, serverTimestamp, runTransaction } from "firebase/firestore"
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

// Rate-limits testimonials to "one per delivered order" without ever
// storing the customer's phone number on the public testimonials
// collection. This tracks a per-phone submission COUNT in a separate,
// admin-only-readable collection, keyed by a sanitized phone number —
// and only lets someone submit again if their count is still below
// their total number of delivered orders.
//
// Uses a transaction so two rapid submissions from the same phone
// can't both slip through and exceed the allowed count.
export async function claimTestimonialSlot(phone, deliveredOrderCount) {
  const claimId = phone.replace(/\s+/g, "")
  const claimRef = doc(db, "testimonialClaims", claimId)

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(claimRef)
    const current = snap.exists() ? snap.data().count : 0

    if (current >= deliveredOrderCount) {
      throw new Error(
        "You've already left a review for each of your delivered orders. Thanks for your support!"
      )
    }

    transaction.set(claimRef, { count: current + 1 }, { merge: true })
  })
}
