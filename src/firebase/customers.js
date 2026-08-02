import { collection, doc, getDocs, setDoc, getDoc, increment, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const customersRef = collection(db, "customers")

export async function getAllCustomers() {
  const snapshot = await getDocs(customersRef)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

// Called after an order is placed to keep a running customer record,
// keyed by phone number since customers don't log in.
export async function upsertCustomerFromOrder(order) {
  const customerId = order.phone.replace(/\s+/g, "")
  const ref = doc(db, "customers", customerId)
  const existing = await getDoc(ref)

  if (existing.exists()) {
    await setDoc(
      ref,
      {
        name: order.customerName,
        phone: order.phone,
        totalOrders: increment(1),
        totalSpend: increment(order.total),
        lastOrderDate: serverTimestamp(),
      },
      { merge: true }
    )
  } else {
    await setDoc(ref, {
      name: order.customerName,
      phone: order.phone,
      totalOrders: 1,
      totalSpend: order.total,
      lastOrderDate: serverTimestamp(),
    })
  }
}
