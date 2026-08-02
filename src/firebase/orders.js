import { collection, doc, addDoc, updateDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "./config"
import { upsertCustomerFromOrder } from "./customers"

const ordersRef = collection(db, "orders")

export async function createOrder(order) {
  const docRef = await addDoc(ordersRef, {
    ...order,
    orderStatus: "pending",
    paymentStatus: "unpaid",
    orderDate: serverTimestamp(),
  })

  // Best-effort customer tracking — order still succeeds even if this fails
  try {
    await upsertCustomerFromOrder(order)
  } catch {
    // ignore — customer record is a nice-to-have, not critical
  }

  return docRef
}

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("orderDate", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function updateOrderStatus(id, orderStatus) {
  const ref = doc(db, "orders", id)
  return updateDoc(ref, { orderStatus })
}

export async function updatePaymentStatus(id, paymentStatus) {
  const ref = doc(db, "orders", id)
  return updateDoc(ref, { paymentStatus })
}
