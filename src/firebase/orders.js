import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, orderBy, serverTimestamp, writeBatch, increment,
} from "firebase/firestore"
import { db } from "./config"
import { upsertCustomerFromOrder } from "./customers"
import { getNextInvoiceNumber } from "./counters"

const ordersRef = collection(db, "orders")

export async function createOrder(order) {
  const invoiceNumber = await getNextInvoiceNumber()

  const docRef = await addDoc(ordersRef, {
    ...order,
    invoiceNumber,
    orderStatus: "pending",
    paymentStatus: "unpaid",
    orderDate: serverTimestamp(),
  })

  // NOTE: stock is intentionally NOT deducted here. It's only deducted
  // once the order status is changed to "delivered" — see
  // updateOrderStatus below.

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

export async function getOrderById(id) {
  const ref = doc(db, "orders", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

async function adjustStock(items, direction) {
  // direction: -1 to deduct, +1 to restore
  const batch = writeBatch(db)
  ;(items || []).forEach((item) => {
    const productRef = doc(db, "products", item.productId)
    batch.update(productRef, { stock: increment(direction * item.quantity) })
  })
  await batch.commit()
}

// Rule: stock is deducted the moment an order first becomes "delivered",
// and restored if it's ever moved OUT of "delivered".
export async function updateOrderStatus(order, newStatus) {
  const ref = doc(db, "orders", order.id)
  await updateDoc(ref, { orderStatus: newStatus })

  const wasDelivered = order.orderStatus === "delivered"
  const isNowDelivered = newStatus === "delivered"

  try {
    if (!wasDelivered && isNowDelivered) {
      await adjustStock(order.items, -1)
    } else if (wasDelivered && !isNowDelivered) {
      await adjustStock(order.items, 1)
    }
  } catch {
    // order status still updated even if the stock adjustment fails
  }
}

export async function updatePaymentStatus(id, paymentStatus) {
  const ref = doc(db, "orders", id)
  return updateDoc(ref, { paymentStatus })
}

// Returns some quantity of one or more items from an order.
// returnItems: [{ productId, name, price, quantity }] — quantity is how
// many of that item are being returned right now (not the original
// order quantity).
//
// This restocks the returned quantity and records it on the order so
// Dashboard revenue/profit calculations can exclude returned items.
export async function processReturn(order, returnItems) {
  const itemsToReturn = returnItems.filter((i) => i.quantity > 0)
  if (itemsToReturn.length === 0) return

  const batch = writeBatch(db)

  itemsToReturn.forEach((item) => {
    const productRef = doc(db, "products", item.productId)
    batch.update(productRef, { stock: increment(item.quantity) })
  })

  const orderRef = doc(db, "orders", order.id)
  const existingReturns = order.returnedItems || []
  const newReturnEntries = itemsToReturn.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }))
  const additionalReturnedAmount = itemsToReturn.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  batch.update(orderRef, {
    returnedItems: [...existingReturns, ...newReturnEntries],
    returnedAmount: increment(additionalReturnedAmount),
  })

  await batch.commit()
}
