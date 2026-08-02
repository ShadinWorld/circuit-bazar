import { doc, runTransaction } from "firebase/firestore"
import { db } from "./config"

const counterRef = doc(db, "counters", "invoices")

// Atomically increments and returns the next invoice number.
// Starts at 1 the first time it's ever called.
export async function getNextInvoiceNumber() {
  const next = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef)
    const current = snap.exists() ? snap.data().value : 0
    const updated = current + 1
    transaction.set(counterRef, { value: updated }, { merge: true })
    return updated
  })
  return String(next).padStart(4, "0")
}
