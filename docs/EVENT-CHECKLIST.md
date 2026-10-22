# Opening Pour, Nov 15 2026: build checklist

Decided: $25 + HST (checkout shows $28.25), 100 tickets, max 6 per order, everything in Shopify.

**Access: by request, not public.** The public page shows the event and a request form that emails the owner. She approves a guest by sending the private link `https://infuseandmuse.com/events?invite=<EVENT_INVITE_CODE>`; only that link shows Get tickets, and the cart refuses ticket adds without the code. Changing EVENT_INVITE_CODE in Vercel retires every link already sent. Set it in Vercel (Production and Preview) before launch.
Event: Sun Nov 15 2026, 4pm to 8pm, shown publicly as "Downtown Toronto" only. The street address is not on the site; the owner gives it to approved guests.
Today is Oct 16. Target: tickets on sale by Oct 23, dry run by Nov 8.

## 0. Decisions and copy needed from the owner
- [ ] Event name (working title: "Tea Gathering")
- [ ] What the ticket includes (tastings? a take-home tin? food?) and the schedule of the evening
- [ ] Venue name, doors time, parking and transit note, accessibility note
- [ ] Allergen note ("may contain dairy" blends are in the line-up)
- [ ] Age rule, photography rule, any dress or what-to-bring line
- [ ] Refund and transfer rule (e.g. refundable until Nov 8, transferable by forwarding the ticket link)
- [ ] On-sale date and time, and the date sales close (default: Nov 15, 2pm)
- [ ] Hero photo choice (default: existing brew stills)
- [ ] Her wording is used verbatim, no em dashes

**Order matters:** deploy the site code BEFORE setting the ticket Active in Shopify, or the live shop will list the ticket among the blends.

## 1. Shopify admin (Chrome)
- [x] Ticket product created as DRAFT: "Tea Gathering Ticket", $25, one variant (product id 10357092712688)
- [x] Not a physical product, so no shipping step for ticket-only carts
- [x] Inventory tracked at 100, "continue selling when out of stock" OFF
- [x] Category "Event Tickets in Arts & Entertainment"; Charge tax = Yes
- [x] Product type "Event ticket" (the site uses it to keep the ticket out of the blends grid)
- [x] Published to the Headless channel only
- [x] Max 6 per order enforced in the site cart route (a soft cap: someone calling Shopify's Storefront API directly could bypass it, so also eyeball orders)
- [x] INFUSEFAMILY left as is (owner is fine with the 30% applying to tickets); no discount changes needed
- [ ] Test: ticket-only checkout asks for no shipping address and shows $28.25 with HST
- [ ] Test: ticket plus tea checkout still charges shipping on the tea only, and check whether the ticket counts toward the $75 free-shipping line
- [ ] Refund policy and Terms get an events paragraph (owner's rule from section 0)
- [ ] Admin API private app created with read_orders and write_orders; token pasted by the owner into .env.local and Vercel (never read by Claude)

## 2. Site: the event page
- [x] `/events` page built (check on a real phone before launch: Get Tickets sits below the details on narrow screens)
- [x] `/event` redirects to `/events`
- [~] Date, time and address done; what is included, allergen and refund notes wait for owner copy (EVENT.description in lib/event.ts)
- [x] Get Tickets: quantity 1 to 6, adds to the existing Shopify cart and opens the bag; a Checkout button shows on the page once tickets are in the bag
- [x] QR visitors (`/events?from=qr`) skip the bag and go straight to Shopify checkout; the Instagram link stays plain `/events`
- [~] States built and unit tested (not yet on sale, on sale, sold out, sales closed, event passed); sold out does not yet point to the mailing list
- [x] No map links and no street address on the site (owner decision 2026-10-16): the page says "Downtown Toronto"
- [x] Add to calendar was built, then removed at the owner's request (2026-10-22)
- [~] Link-preview tags done with the square brew photo; a dedicated 1200x630 image still to make
- [~] Added to the sitemap; footer link and homepage notice still to do
- [x] Ticket kept out of the blends and boxed sets lists and the /products/<slug> route (by Product type)

## 2b. Request-only access
- [x] Public visitors see a "Request a ticket" form (name, email, how many, note) that emails the owner via Resend (CONTACT_INBOX)
- [x] Private invite link shows the ticket control; cart route returns 403 for a ticket without a valid code
- [x] Ticket price shown on the page; no public "buy" structured data
- [ ] Set EVENT_INVITE_CODE in Vercel (owner or you; pick your own value, do not reuse the local one)
- [ ] Owner decision: does a request get an automatic "we got it" email to the guest? (not built)
- [ ] Owner decision: wording of the request section (current text is placeholder: "Tickets are by request.")

## 3. Site: tickets and QR
- [x] Signed ticket links (HMAC with TICKET_SECRET): one link per order, one QR per ticket; nothing stored, tamper-proof
- [x] `/tickets` "Find my tickets" (order number + email) and `/tickets/<token>` page with a QR per ticket; `/t/<token>` single ticket (what the QR opens)
- [x] Reads the order live from Shopify; cancelled, refunded and unpaid orders show as not valid; guest names shortened ("Jane D.") on shareable pages
- [x] "Find my tickets" link on the event page
- [x] Invite link and invite QR (`/events?invite=...`) show the street address and map links in "Where", add the venue as a note on the ticket line so Shopify's checkout prints "Venue: ..." under it, and are marked noindex. Public visitors and wrong codes still see "Downtown Toronto".
- [x] The street address is shown only to ticket holders (ticket email and valid ticket pages); every public page still says "Downtown Toronto". Lives in server-only lib/event-venue.ts, guarded by tests/server/venue-privacy.test.ts.
- [x] Personal ticket link emailed to each guest automatically when a ticket order is paid (Shopify ORDERS_PAID webhook -> /api/webhooks/orders-paid -> Resend; tagged `tickets-emailed` so it sends once). Verified live with a real order.
- [ ] Optional: also add "Your tickets: infuseandmuse.com/tickets" to Shopify's own confirmation email
- [ ] Reminder email the day before (Shopify Email, segment = bought the ticket)

## 4. Site: door check-in
- [x] `/checkin` behind a staff PIN (CHECKIN_PIN), sent as a header, kept in sessionStorage only
- [x] Camera scanner (jsQR): green Valid, amber Already used, red Not valid, with Undo
- [x] Guest list with search by name, email or order number, per-ticket admit and undo, live "admitted of sold"
- [x] "Admitted" is stored as an order tag in Shopify (`checked-in-<n>`), so it survives deploys
- [x] Tested end to end against real Shopify orders (scan, repeat scan, forged code, refunded position, undo)
- [x] Camera scanner tried on a real phone by the user (2026-10-17): scanned demo order #1017 ticket 1 and it worked
- [ ] Fallback: export the guest list from Shopify and print it, in case there is no signal at the door
- Known limit: two phones scanning the very same ticket in the same second could both read "valid". Use one scanner per door.

**Vercel needs 4 new variables (Production and Preview), pasted by the owner/you:** SHOPIFY_ADMIN_CLIENT_ID, SHOPIFY_ADMIN_CLIENT_SECRET, TICKET_SECRET, CHECKIN_PIN.

## 5. Instagram kit for the owner
- [ ] One short link for the bio and story link sticker: infuseandmuse.com/events
- [ ] QR code, one per use: public flyer QR = plain `/events`; invited-guest QR = `/events?invite=<code>&from=qr` (straight to checkout); branded (green on cream, scan-tested), as SVG and a print-size PNG, saved in the repo
- [ ] Optional: story-size (1080x1920) and post-size (1080x1350) cards with the QR on them

## 6. Test and launch
- [ ] Test orders (100% discount code on a test ticket, then cancel): 1 ticket, 6 tickets, 7 tickets blocked
- [ ] Sold-out behaviour tested by setting inventory to 0
- [ ] Refund a test order and confirm its ticket turns invalid
- [ ] Double scan rejected on a real phone, in the Instagram browser and Safari and Chrome
- [ ] Lighthouse mobile pass on /events
- [ ] Preview deploy reviewed by the owner, then production
- [ ] Product moved from Draft to Active at the on-sale time
- [ ] After the event: ticket product to Draft, page flips to "This gathering has passed"
