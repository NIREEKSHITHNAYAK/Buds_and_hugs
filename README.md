# Flower Art Store

A mobile-first luxury flower-art storefront built with React (Vite) and Node.js/Express.

## Requirements
- Node.js 18+
- npm

## Run locally

Open two terminals.

### 1) Backend
```bash
cd backend
npm install
npm run dev
```
API runs at http://localhost:5000

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

## Add/edit your 111 products
Edit `frontend/src/data/products.js`. The starter includes 111 sample product records.
For each product:
- `name`, `category`, `description`
- `price` = selling price
- `originalPrice` = higher crossed-out price
- `images` = array of image paths

Put product photos in `frontend/public/images/`. Example:
```js
images: [
  "/images/flower-001/1.jpg",
  "/images/flower-001/2.jpg",
  "/images/flower-001/3.jpg"
]
```
Create folders `flower-001` through `flower-111` and add as many photos as needed. If a photo is missing, the UI displays a graceful placeholder.

## WhatsApp ordering
The WhatsApp number is configured in `frontend/src/config.js` as `6362246251` (India country code 91). When the customer checks out, the cart items, quantities, prices and total are encoded into a pre-filled WhatsApp message. The customer must press Send in WhatsApp.

## Backend
The Express API exposes:
- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`

The storefront currently loads its starter catalogue locally so it works immediately. The API is included as the Node.js backend foundation; connect the frontend to it when you want server-managed products or a database.

## Important
This is a starter project, not a payment gateway. Orders are enquiries sent through WhatsApp; no payment is collected and no order is automatically confirmed.

## Updated version
This build includes the glassmorphism styling and corrected WhatsApp message formatting (real line breaks instead of visible `\n` text). If you already extracted an older ZIP, replace the whole `frontend/src/App.jsx` and `frontend/src/styles.css` from this updated project.

## Visual theme
The current design uses light floral glassmorphism: translucent frosted-glass panels, soft pastel backgrounds, and sage-green accents. The previous black-and-gold theme has been replaced.

## Welcome page Glass AI Button
The welcome screen embeds the supplied Glass AI Button authored HTML in an opaque `sandbox="allow-scripts"` iframe. The HTML source is copied byte-for-byte to `frontend/src/effects/glass-ai-button/glass-ai-button.html`; the React host mounts it only while visible so its WebGL resources are released when the welcome screen is hidden or the browser tab is not visible. No ThreeUI package is required.

## Animated glass navigation dock

The frontend now includes a custom responsive glass navigation dock at `frontend/src/effects/animated-top-dock/`. It has Home, Flowers, Categories, About and Contact anchors, a 34-particle canvas field, and pointer-proximity spring scaling on fine-pointer desktop devices. On touch and reduced-motion devices the navigation remains usable without proximity motion. The particle field is a lightweight Canvas 2D implementation authored for this project; it is not the original Three.js/WebGL shader source from ThreeUI.
