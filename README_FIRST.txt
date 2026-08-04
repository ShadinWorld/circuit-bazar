CIRCUIT BAZAR — ROUND 5 (Stock privacy, Testimonials, Hover Zoom,
Better Ratings, Copyable Invoice, Best-Selling/Top-Rated Sort)
=====================================================================

1. CUSTOMERS NO LONGER SEE EXACT STOCK NUMBERS
   Product page now just shows "In stock" or "Out of stock" — no
   number. You still see the exact count everywhere in Admin
   (Products, Inventory, Dashboard) — nothing changed there.
   -> src/pages/ProductDetails.jsx

2. CHECKOUT SUBTITLE REMOVED
   The "Fill in your details — we'll save your order..." line under
   the Checkout heading is gone. The Cash-on-Delivery note right below
   it is untouched.
   -> src/pages/Checkout.jsx

3. OVERALL SHOP TESTIMONIALS (WITH PHOTO) — NEW
   New page at /testimonials where a customer can leave ONE overall
   review of their experience with Circuit Bazar (not tied to a single
   product) — name, star rating, comment, and an optional photo.
   Verified the same way as product reviews: they enter the phone
   number from their order, and it's checked against your delivered
   orders (phone is never stored or shown). A few of these also show
   on the Home page under "What Customers Say", with a link to see all.

   IMPORTANT — about the photo: there's no real image upload in this
   app (that needs Firebase Storage, which requires upgrading to the
   paid Blaze plan — you chose to skip that earlier for Storage, so I
   kept this consistent). Instead, customers PASTE A PHOTO LINK (e.g.
   upload to Google Photos/Imgur and share the link). This works fine
   and costs nothing, but it's less smooth than a real upload button.
   If you ever want true photo uploads, let me know and we can revisit
   turning on Firebase Storage.

   Since photos carry more spam/inappropriate-content risk than plain
   text, I added an admin moderation page: Admin -> Reviews (new
   sidebar item) — view and remove any submitted testimonial.
   -> src/firebase/testimonials.js (new)
   -> src/pages/Testimonials.jsx (new)
   -> src/admin/pages/AdminTestimonials.jsx (new)
   -> src/firebase/orders.js (adds hasAnyDeliveredOrder helper)
   -> src/App.jsx, src/admin/components/AdminLayout.jsx,
      src/components/layout/Footer.jsx, src/pages/Home.jsx (wiring)
   -> firestore.rules (adds testimonials collection, same validation
      approach as product reviews)

4. CLEARER RATING DISPLAY
   Stars are bolder/higher-contrast now, and everywhere a rating shows
   (product cards, product page, testimonials) it's in a small amber
   "pill" badge with the star, number, and review count together — much
   easier to spot at a glance than plain small text before.
   -> src/components/product/StarRating.jsx
   -> src/components/product/RatingSummary.jsx (new)
   -> src/pages/ProductDetails.jsx, src/components/product/ProductCard.jsx

5. HOVER ZOOM ON PRODUCT IMAGES
   Hovering over a product's image (on product cards in any grid, and
   the main image on the Product Details page) now smoothly zooms in
   slightly, and zooms back out when the mouse leaves. Pure CSS
   transition, no extra library needed.
   -> src/components/product/ProductCard.jsx
   -> src/pages/ProductDetails.jsx

6. INVOICE — ONE-CLICK COPY (Print/PDF removed)
   The Print/Save-as-PDF button on the invoice page is gone, replaced
   with a "Copy Invoice" button. Clicking it copies a nicely formatted,
   WhatsApp-ready text version (with emojis, item list, total) straight
   to the clipboard — so you can paste it directly into the customer's
   WhatsApp chat in one click. Button briefly shows "Copied!" for
   confirmation.
   -> src/admin/pages/Invoice.jsx

7. SORT BY BEST SELLING / HIGHEST RATED
   Products page sort dropdown now has 4 options: Newest, Best Selling,
   Highest Rated, Price Low-High, Price High-Low. "Best Selling" uses
   each product's sold count; "Highest Rated" uses the average review
   rating (products with no reviews sort last).
   -> src/pages/Products.jsx


STEPS
-----
1. Update Firestore rules:
   - Firebase Console -> Firestore Database -> Rules tab
   - Replace everything with firestore.rules from this zip -> Publish

2. Copy everything inside "src" into your project's src folder,
   replacing existing files.

3. npm run dev — test:
   - Open any product -> stock should say "In stock"/"Out of stock",
     no number
   - Go to /checkout -> confirm the subtitle line is gone
   - Go to /testimonials -> try submitting a review with a phone number
     that HAS a delivered order (should succeed) and one that doesn't
     (should show the "couldn't find a delivered order" message)
   - Check Home page -> "What Customers Say" section appears once you
     have at least one testimonial
   - Check Admin -> Reviews (new sidebar item) -> confirm you can see
     and delete testimonials
   - Hover over any product image in a grid, and on a Product Details
     page -> confirm the zoom-in effect
   - Check a product with reviews -> rating pill should look bold and
     easy to spot
   - Go to Admin -> Orders -> open an order -> Print Invoice -> click
     "Copy Invoice" -> paste somewhere (e.g. WhatsApp or a text editor)
     to confirm it copied correctly
   - Go to Products -> try "Best Selling" and "Highest Rated" sort options

4. If everything works:
       git add .
       git commit -m "Hide stock count from customers, add shop testimonials with photo, hover zoom, clearer ratings, copyable invoice, best-selling/top-rated sort"
       git push
       npm run deploy


A QUESTION FOR YOU
-------------------
Anything you want changed about the testimonials feature — e.g. should
it require an actual order ID instead of just a phone number, or is
letting anyone with a delivered order leave one general shop review
(rather than tying it to a specific order) exactly what you wanted?
