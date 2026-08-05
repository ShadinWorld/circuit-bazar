CIRCUIT BAZAR — ROUND 6 (Stock Color, Home/Products Search, Review
Limits & "Leave a Review" Button)
======================================================================

1. STOCK STATUS COLOR-CODED
   "In stock" now shows in green (your accent color), "Out of stock"
   in red — easy to spot at a glance on the Product Details page.
   -> src/pages/ProductDetails.jsx

2. SEARCH BOX ON HOME PAGE (+ sort)
   Right above "Latest Arrivals" on the Home page, there's now a search
   box and a sort dropdown (Newest / Best Selling / Highest Rated /
   Price). Typing in the search box and pressing Enter takes you to
   the full /search page with that query already filled in. The sort
   dropdown reorders the "Latest Arrivals" row itself, right there on
   Home.
   -> src/pages/Home.jsx
   -> src/pages/Search.jsx (now reads a "?q=" link parameter so the
      Home search box can hand off to it)

3. SEARCH BOX ON PRODUCTS PAGE
   Added next to the category filter pills — this one filters the
   already-loaded product list immediately (by name, category, or
   description), no page reload.
   -> src/pages/Products.jsx

4. TESTIMONIALS — REVIEW LIMIT + "LEAVE A REVIEW" BUTTON + IMPROVEMENT
   FEEDBACK FIELD

   a) One review per delivered order (not unlimited)
      Previously anyone with at least one delivered order could submit
      as many reviews as they wanted. Now it's capped: a customer can
      leave at most as many reviews as they have delivered orders — if
      they've had 3 orders delivered, they can leave up to 3 reviews;
      if they try a 4th, they'll see a message saying they've used up
      their review slots. This works WITHOUT storing their phone
      number anywhere public — a separate, admin-only-readable
      collection just tracks a count per phone number.
      -> src/firebase/testimonials.js (adds claimTestimonialSlot)
      -> src/firebase/orders.js (adds getDeliveredOrderCount)
      -> firestore.rules (adds the testimonialClaims collection)

   b) "Leave a Review" button
      Added right next to the "What Customers Say" heading on the Home
      page — takes customers straight to the review form on
      /testimonials.
      -> src/pages/Home.jsx

   c) "Anything we could improve?" field
      Added an optional field to the review form for private feedback
      — NOT shown publicly on the testimonial cards (Home or the
      Testimonials page). Only visible to you, in Admin -> Reviews,
      shown in a small amber note under each review. This is a good
      place to see suggestions/complaints without it turning into a
      public complaint board.
      -> src/pages/Testimonials.jsx
      -> src/admin/pages/AdminTestimonials.jsx
      -> firestore.rules (validates the new field)


STEPS
-----
1. Update Firestore rules:
   - Firebase Console -> Firestore Database -> Rules tab
   - Replace everything with firestore.rules from this zip -> Publish

2. Copy everything inside "src" into your project's src folder,
   replacing existing files.

3. npm run dev — test:
   - Open a product -> "In stock"/"Out of stock" should be green/red
   - Home page -> try the search box (press Enter) -> should land on
     /search with that term already searched
   - Home page -> try the sort dropdown -> "Latest Arrivals" reorders
   - Products page -> type in the new search box -> list filters
     instantly
   - Go to /testimonials -> submit a review for a phone number with a
     delivered order -> should succeed. Try submitting again with the
     SAME phone (assuming they only have 1 delivered order) -> should
     now be blocked with a "used up your review slots" message
   - Try the "improvements" field -> submit it -> confirm it does NOT
     show on the public testimonial card, but DOES show (in an amber
     box) under that review in Admin -> Reviews
   - Home page -> "Leave a Review" button next to "What Customers Say"
     should link to /testimonials

4. If everything works:
       git add .
       git commit -m "Color-code stock status, add search to Home and Products pages, limit testimonials to one per delivered order, add private improvement feedback field, add Leave a Review button"
       git push
       npm run deploy
