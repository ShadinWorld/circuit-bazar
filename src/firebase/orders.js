import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const ordersRef = collection(db, "orders")

export async function createOrder(order) {
  return addDoc(ordersRef, {
    ...order,
    orderStatus: "pending",
    paymentStatus: "unpaid",
    orderDate: serverTimestamp(),
  })
}

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("orderDate", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}
