# VELOCITY RETAIL GROUP - INTERNAL OPERATIONS & KNOWLEDGE BASE

Document Version: 2026.4
Classification: Customer Success & Logistics Standard Operating Procedures

---

## 1. COMPANY OVERVIEW & PRODUCT LINES

- **Company Name:** Velocity Retail Group (operating publically as Velocity Store)
- **Industry:** Direct-to-Consumer (DTC) E-commerce
- **Core Product Categories:** Premium Athleisure Wear, Smart Fitness Accessories, and Eco-Friendly Hydration Gear.
- **Flagship Products:**
  - _AeroWeave Leggings:_ High-performance, moisture-wicking recycled nylon.
  - _PulseSync Smart Bottle:_ A stainless-steel water bottle that tracks daily water intake via Bluetooth.

---

## 2. SHIPPING & LOGISTICS POLICIES

### 2.1 Order Processing Timelines

- **Standard Processing:** All orders placed before 2:00 PM EST Monday through Friday are processed and shipped from the warehouse on the same business day. Orders placed after 2:00 PM EST or over the weekend are shipped the following business day.
- **Peak Season Exception:** During major holiday windows (November 20 to December 26), processing times may extend by 24–48 hours.

### 2.2 Shipping Tiers and Rates (Domestic)

- **Standard Shipping:** Costs R75.00 flat rate (Free for orders over R1,000.00). Delivery takes 3 to 5 business days via CourierIT or Dawn Wing.
- **Express Shipping:** Costs R150.00 flat rate. Delivery takes 1 to 2 business days.
- **International Shipping:** Currently restricted to Southern African Development Community (SADC) countries. Costs a flat rate of R350.00 and takes 7 to 10 business days.

---

## 3. RETURNS, REFUNDS, AND EXCHANGE RULES

### 3.1 The 30-Day Return Window

- **Policy:** Velocity Retail Group offers a strict 30-day return or exchange policy from the date the package is marked as delivered by the courier.
- **Condition Items Must Be In:** To qualify for a full refund, items must be unworn, unwashed, and still have all original product tags attached.
- **Exempt Items:** For hygiene reasons, undergarments, socks, and opened _PulseSync Smart Bottles_ cannot be returned or exchanged under any circumstances unless deemed defective upon arrival.

### 3.2 Refund Method and Processing Time

- **Refund Type:** Approved returns are refunded directly to the customer's original method of payment (Visa, Mastercard, PayFlex, or Ozow).
- **Processing Time:** Once the warehouse scans the returned item, it takes 5 to 7 business days for the financial institution to process the funds back to the customer's account.
- **Return Shipping Fees:** Velocity Retail Group provides free pre-printed return courier labels for exchanges, but a return shipping fee of R50.00 is deducted from the final refund amount for straight returns.

---

## 4. CUSTOMER EXCELLENCE & SUPPORT ESCALATION

### 4.1 Tier 1 Support Protocol (General Enquiries)

- **Channel Management:** All incoming customer chats via the website or email (`support@velocitystore.co.za`) are handled initially by Tier 1 agents.
- **Response Windows:** Live chat queries must be answered within 2 minutes. Email tickets must be answered within 4 hours during operational hours.
- **Operational Hours:** Monday to Friday, 8:00 AM to 6:00 PM SAST. Saturday, 9:00 AM to 1:00 PM SAST.

### 4.2 Tier 2 Support Escalation (Complex Issues)

- **Damaged or Missing Items:** If a customer receives a broken item or an empty box, the agent must _not_ issue a manual refund. The ticket must be escalated to Tier 2 in Zendesk with photos of the damaged packaging attached.
- **Lost Packages:** If a tracking link shows no courier updates for more than 48 hours, escalate to Tier 2 Logistics to open an official carrier investigation.

---

## 5. TECHNICAL INVENTORY & BACKEND ECOSYSTEM

- **E-commerce Platform Engine:** Shopify Plus Core API.
- **Inventory Management System (IMS):** Katana Cloud Inventory.
- **Payment Gateways Integrated:** Peach Payments, Ozow, and PayFlex.
- **RAG Prompt Mapping Rule:** When a user asks about order status, the RAG chatbot should remind the user to have their 6-digit order number (e.g., #VEL-1024) ready before passing the request to an internal order tracking system.
