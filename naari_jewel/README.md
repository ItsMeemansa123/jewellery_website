# Naari Jewels — AI-Native Luxury Jewellery E-Commerce Platform

> **An Agentic AI-powered conversational shopping platform and end-to-end e-commerce store for handcrafted luxury jewellery.**

## Key Highlights & Innovations

### 1.**Naari AI Shopping Agent (Agentic Shopping Experience)**
* **Conversational Natural Language Shopping**: Describe occasions, styles, budgets (e.g., *"Show me a minimalist silver necklace under ₹3,000 for a wedding gift"*), and the AI understands, searches, scores, and recommends the best pieces.
* **Intelligent Match Scoring**: Computes and displays dynamic match percentages (e.g., `96% Match`) with personalized *Why This Fits* explanations.
* **Side-by-Side Comparison Engine**: Real-time side-by-side comparison tables evaluating Price, Material, Style, Occasion suitability, Stock availability, and an AI Recommendation Verdict.
* **RAG Policy & Care Assistant**: Built-in retrieval-augmented generation (RAG) knowledge base to instantly answer questions about materials, jewellery care, dynamic shipping, and transit damage replacement policies.

### 2.**Seamless Checkout & Payment Infrastructure**
* **Razorpay Payment Gateway**: Real-time order creation, Razorpay Modal Checkout, and cryptographic HMAC-SHA256 signature verification (with automatic mock sandbox fallback for offline testing).
* **WhatsApp Instant Checkout**: Direct fallback to confirm orders via WhatsApp with formatted cart summary.
* **Dynamic Shipping Engine**: Automatically calculates dynamic delivery charges based on customer delivery pincode and location zone.
* **Order Tracking Timeline**: Real-time 4-stage visual order tracking (Placed ➔ Confirmed ➔ Dispatched ➔ Delivered).

### 3.**Authentication & Smart Routing**
* **Instant Auto-Login on Sign Up**: New users are automatically logged in upon registration—no repetitive login required.
* **Smart Route Preservation**: Unauthenticated users attempting *Instant Buy* or *Cart Checkout* are routed to Login/Signup, and immediately returned to their exact previous page upon authentication.
* **Cart Icon Security**: Shopping bag icon is visible only to authenticated users.
* **Forgot & Reset Password**: Built-in self-service password reset flow with auto-login.
* **Admin Management**: Secure JWT role-based access control with one-line CLI promotion tool (`node makeAdmin.js <email>`).

### 4.**Modern Luxury UI/UX**
* **Responsive Category Grid**: Dynamically balanced layout with zero awkward empty slots.
* **Smooth Luxury Marquee**: Slow-paced moving product cards with hover-to-pause interaction.
* **Framer Motion Micro-interactions**: Smooth page transitions, card hover elevations, and responsive drawers.


## Tech Stack
   ````
| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Framer Motion, Axios, React Router 7, FontAwesome |
| **Backend** | Node.js, Express 5, Mongoose, JWT, BcryptJS, Razorpay SDK, `@google/genai` (Google Gemini) |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Payments** | Razorpay (UPI, Cards, NetBanking, Wallets) + WhatsApp API |

````
````
## Project Structure

Naari_jewel/
├── package.json                   # Root monorepo scripts
├── README.md                      # Complete project documentation
├── Backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── models/
│   │   ├── Product.js             # Rich product schema (tags, occasion, material, rating)
│   │   ├── User.js                # User auth & role schema (user / admin)
│   │   └── Order.js               # Order tracking & Razorpay signature schema
│   ├── Routes/
│   │   ├── aiRoutes.js            # /api/ai/chat & /api/ai/suggestions
│   │   ├── authRoutes.js          # /api/auth (signup, login, reset-password)
│   │   ├── productRoutes.js       # /api/products (CRUD with admin protection)
│   │   ├── paymentRoutes.js       # /api/payment (create-order, verify)
│   │   └── orderRoutes.js         # /api/orders (tracking & history)
│   ├── services/
│   │   ├── ai/
│   │   │   ├── agent.js           # Multi-turn Gemini AI agent controller
│   │   │   ├── tools.js           # Agent tools (search, compare, inventory, policy)
│   │   │   └── knowledgeBase.js   # RAG policy & care knowledge base
│   │   └── razorpayService.js     # Razorpay API & HMAC signature verification
│   ├── Middlewares/
│   │   └── authMiddleware.js      # JWT Token & Admin authorization middleware
│   ├── products_dump.json         # 25 rich handcrafted jewellery mock dataset
│   ├── seed.js                    # MongoDB Atlas dataset seeding script
│   ├── makeAdmin.js               # CLI utility to promote users to Admin
│   └── server.js                  # Express application entrypoint
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AIChatMessage.jsx     # Markdown renderer with embedded cards & widgets
    │   │   ├── AIComparisonTable.jsx # Side-by-side feature comparison table
    │   │   ├── AIProductCard.jsx     # AI product card with match % badge & reasoning
    │   │   ├── Categories.jsx        # Dynamically balanced category grid
    │   │   ├── Shop.jsx              # Smooth luxury marquee carousel
    │   │   └── navbar.jsx            # Responsive navigation with auth-aware cart
    │   ├── context/
    │   │   ├── AuthContext.jsx       # Global JWT authentication context
    │   │   └── CartContext.jsx       # Global cart state with quantity management
    │   ├── pages/
    │   │   ├── AIShopping.jsx        # Flagship AI Shopping Assistant page
    │   │   ├── Cart.jsx              # Dynamic shipping & Razorpay Checkout
    │   │   ├── Orders.jsx            # Live 4-stage order tracking
    │   │   ├── ProductDetail.jsx     # Detailed product view with specifications
    │   │   ├── ShopAll.jsx           # Full catalog search & category filtering
    │   │   ├── AdminDashboard.jsx    # Admin product CRUD & inventory controls
    │   │   ├── Login.jsx             # User login with return-to-page redirect
    │   │   ├── Signup.jsx            # Auto-login onboarding
    │   │   └── ForgotPassword.jsx    # Self-service password reset
    │   └── services/
    │       ├── api.js                # Dynamic API Base URL resolver
    │       └── razorpay.js           # Razorpay checkout modal loader
    └── vite.config.js

````
## Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas Connection URI**

### 2.Configure Environment Variables

Create `Backend/.env` with the following variables:

env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/naari_jewel?retryWrites=true&w=majority
JWT_SECRET=naari_jewels_super_secret_jwt_key_2026

# Optional: Razorpay Payment Gateway (Defaults to test sandbox if omitted)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Optional: Google Gemini API (Agent includes smart keyword fallback if omitted)
GEMINI_API_KEY=your_gemini_api_key


### 3. Install Dependencies & Seed Database

Open terminal in the project root:

powershell
# 1. Install Backend dependencies
cd D:\Naari_jewel\naari_jewel\Backend
npm install

# 2. Seed MongoDB Atlas with 25 rich handcrafted jewellery products
npm run seed

# 3. Install Frontend dependencies
cd D:\Naari_jewel\naari_jewel\Frontend
npm install


### 4. Run Development Servers

You can start both servers simultaneously from the root folder or individually:

#### Option A: Start from Root
powershell
cd D:\Naari_jewel\naari_jewel
npm run dev:backend

npm run dev:frontend

#### Option B: Start Separately
powershell
# Terminal 1 (Backend - Port 5000)
cd D:\Naari_jewel\naari_jewel\Backend
npm run dev

# Terminal 2 (Frontend - Port 5173)
cd D:\Naari_jewel\naari_jewel\Frontend
npm run dev


Visit **`http://localhost:5173`** in your browser!

## Admin Setup

To give any user admin privileges:
1. Sign up on the website with your email (e.g. `admin@naarijewels.com`).
2. Run the admin command in terminal:
   powershell
   cd D:\Naari_jewel\naari_jewel\Backend
   node makeAdmin.js admin@naarijewels.com
   
3. Refresh the website — your profile menu will now include **"⚙️ Admin Dashboard"** at [`/admin`](http://localhost:5173/admin).


## Testing Key User Flows

| Feature | How to Test | Expected Behavior |
|---|---|---|
| **AI Shopping** | Navigate to `/ai-shopping` and type: *"Need a necklace under ₹4000 for a wedding"* | AI filters catalog, displays top matches with Match % badges, reasoning, and instant buy options. |
| **AI Comparison** | In AI chat, type: *"Compare top 2 necklaces side by side"* | Side-by-side table compares prices, materials, occasions, and delivers an AI verdict. |
| **Auto-Login Signup** | Go to `/signup`, create a new account | Account is created, user is automatically logged in, and redirected to prior page without asking for password again. |
| **Instant Buy Protection** | While logged out, click *Instant Buy* on any product | Redirects to `/login`, and upon login automatically forwards straight to `/cart`. |
| **Dynamic Shipping** | In `/cart`, enter pincodes starting with `11` (Metro) vs `79` (Remote) | Delivery charges recalculate dynamically (₹60 vs ₹90). |
| **Razorpay Payment** | Fill address in `/cart` and click *Pay with Razorpay* | Secure Razorpay popup opens; upon success, displays order confirmation ID with real-time tracking link. |
| **Order Tracking** | Visit `/orders` | Displays real-time 4-step progress timeline of your orders. |
| **Password Reset** | Go to `/login` ➔ click *Forgot Password?* ➔ enter email & new password | Password updates in database, user is logged in automatically. |


## Store Policies Summary
* **Return Policy**: Strict no-return policy once delivered for handcrafted pieces. 100% free replacement or refund provided for items received defective, damaged in transit, or lost by courier (reported within 24h with unboxing proof).
* **Shipping**: Dynamic shipping rates applied at checkout based on pincode and location zone. Dispatched within 24 hours with SMS/Email tracking.
* **Materials**: Authenticated 925 Sterling Silver, 18K/24K micron plating, 100% hypoallergenic, nickel-free & lead-free.

## License
Crafted for **Naari Jewels** — All Rights Reserved.
