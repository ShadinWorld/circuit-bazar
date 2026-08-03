import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const reviewsRef = collection(db, "reviews")

export async function getReviewsForProduct(productId) {
  // Sorting by createdAt client-side (instead of orderBy in the query)
  // avoids needing a Firestore composite index for this filter+sort combo.
  const q = query(reviewsRef, where("productId", "==", productId))
  const snapshot = await getDocs(q)
  const reviews = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
  return reviews.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

export async function addReview(review) {
  return addDoc(reviewsRef, {
    ...review,
    createdAt: serverTimestamp(),
  })
}

// Fetches every review once, used to compute average ratings for the
// whole catalog (e.g. showing a star rating on product cards).
export async function getAllReviews() {
  const snapshot = await getDocs(reviewsRef)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}
