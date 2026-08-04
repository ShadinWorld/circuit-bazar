import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, orderBy, where, serverTimestamp, writeBatch, increment,
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
  // direction: -1 to deduct (and count as sold), +1 to restore (and undo
  // the sold count, e.g. if a "delivered" order is moved back to another
  // status by mistake).
  const batch = writeBatch(db)
  ;(items || []).forEach((item) => {
    const productRef = doc(db, "products", item.productId)
    batch.update(productRef, {
      stock: increment(direction * item.quantity),
      soldCount: increment(direction === -1 ? item.quantity : -item.quantity),
    })
  })
  await batch.commit()
}

// Used by the "verified purchase" review check: does this phone number
// have a delivered order that included this product?
//
// IMPORTANT: the orderStatus == "delivered" filter must be part of the
// QUERY itself, not just checked client-side afterwards. Firestore
// rejects a list query entirely (permission-denied) if it could
// possibly return a document the rule wouldn't allow — the current
// rule only lets a non-admin read orders where orderStatus ==
// "delivered", so a query on phone alone (which could also match a
// pending/confirmed order) gets denied outright, even if every actual
// match happens to be delivered. Including the filter here is what
// makes Firestore able to verify the query is safe to run.
export async function hasDeliveredPurchase(phone, productId) {
  const q = query(
    ordersRef,
    where("phone", "==", phone),
    where("orderStatus", "==", "delivered")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.some((docSnap) => {
    const order = docSnap.data()
    return (order.items || []).some((item) => item.productId === productId)
  })
}

// Used by the testimonial "verified customer" check: does this phone
// number have ANY delivered order at all (not tied to one specific
// product — used for overall shop testimonials, unlike
// hasDeliveredPurchase above which checks a specific product).
export async function hasAnyDeliveredOrder(phone) {
  const q = query(
    ordersRef,
    where("phone", "==", phone),
    where("orderStatus", "==", "delivered")
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
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
