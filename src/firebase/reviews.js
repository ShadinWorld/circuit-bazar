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

// Turns a flat list of reviews into { [productId]: { average, count } },
// used to show a rating summary on product cards without a per-product
// query for every card.
export function buildRatingMap(reviews) {
  const map = {}
  reviews.forEach((r) => {
    if (!map[r.productId]) map[r.productId] = { total: 0, count: 0 }
    map[r.productId].total += r.rating
    map[r.productId].count += 1
  })
  Object.keys(map).forEach((productId) => {
    const { total, count } = map[productId]
    map[productId] = { average: total / count, count }
  })
  return map
}
