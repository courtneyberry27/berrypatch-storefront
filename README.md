# BerryPatch Farm Stand 🧺🍓

> An authentic roadside farm stand e-commerce produce experience with smooth animated transitions, optimistic bushel basket management, produce filter tabs, half-pound scale stations, and Stripe checkout integration.

---

## 🧺 Highlights & Farm Stand Features

- **🍓 Roadside Farm Stand Aesthetic**:
  - Classic red-and-cream awning canopies and vintage gingham check patterns.
  - Wooden produce bushel crates (`.crate-card`), chalkboard daily specials, and stamped kraft paper tags.
  - Rustic Fraunces serif and Patrick Hand chalkboard script typography.
  - Confetti burst celebration upon order confirmation using `canvas-confetti`.

- **⚖️ Half-Pound Produce Scale Station**:
  - Strawberries, Blueberries, and Raspberries weighed and added to cart in **0.5 lb increments** (`$X.XX / 1/2 lb`).
  - Real-time scale weight stepper formatting (`0.5 lb`, `1.0 lb`, `1.5 lbs`, etc.) and basket calculations.

- **🌿 Exact 10-Item Artisanal Catalog**:
  1. Strawberries (Sold by the 1/2 lb)
  2. Blueberries (Sold by the 1/2 lb)
  3. Raspberries (Sold by the 1/2 lb)
  4. Raspberry Preserves
  5. Strawberry Preserves
  6. Blueberry Preserves
  7. Strawberry Syrup
  8. Blueberry Syrup
  9. Raspberry Syrup
  10. Berry Fridge Storage Baskets (Set of 3 Colander Baskets)

- **⚡ Optimistic Bushel Basket Management**:
  - **Instantaneous UI Updates**: Add-to-cart, inline quantity steppers, and removals update the interface immediately with no perceived latency.
  - **Background Headless Sync**: Silently coordinates state with simulated headless backend.
  - **Free Chilled Courier Shipping Bar**: Dynamic progress calculation with moving delivery truck indicator.
  - **Coupon Engine**: Supports codes like `BERRYCUTE` (15% off), `FREESHIP` (free courier), and `COURTNEY` (20% off).

- **💳 Farm Stand Register & Stripe Checkout**:
  - Authentic Stripe Elements simulation with credit card formatting and instant test presets.
  - Customer shipping details capture for porch cooler box delivery.
  - Itemized harvest receipt with printable slip and 4-step farm-to-table progress tracker.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 4 (Node 16+ compatible)
- **Styling**: Tailwind CSS 3 with custom farm stand themes, colors & fonts
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Deployment**: GitHub Pages via automated GitHub Actions

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The storefront will be live at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 GitHub Pages Deployment

This repository includes a preconfigured GitHub Actions workflow in `.github/workflows/deploy.yml`:
1. Push this project to your GitHub repository.
2. In your GitHub repository, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. GitHub Actions will automatically build and publish your site!

---

🧺 *Crafted with love for Courtney Berry & fresh berry lovers everywhere.*

