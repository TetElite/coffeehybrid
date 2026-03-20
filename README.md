# CoffeeHybrid V2 ☕️🚀

> **Smart Coffee Ordering System** — Order ahead, skip the queue, and enjoy premium coffee.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v5-purple?style=for-the-badge&logo=next.js&logoColor=white)

## 📌 Project Overview

**CoffeeHybrid V2** is a modern, full-stack e-commerce application designed to streamline the coffee ordering experience. It features a complete online ordering flow for customers and a comprehensive management dashboard for staff and administrators.

The platform bridges the gap between digital convenience and physical service, utilizing **QR code technology** for order verification and pickup.

### 🌟 Key Features

#### 🛍️ Customer Experience

- **Smart Menu**: Browse categories, search products, and customize orders (size, sugar, ice, add-ons).
- **Cart Management**: Real-time cart updates powered by **Zustand**.
- **Secure Ordering**: Place orders online and generate a unique QR code for pickup.
- **Order Tracking**: View order status (Pending, Confirmed, Ready, Completed) in real-time.
- **Order History**: Access past orders and reorder favorites easily.

#### 👨‍💼 Staff & Admin Portal

- **Dashboard Analytics**: Visualize sales data, popular items, and revenue trends with **Recharts**.
- **Order Queue**: Manage incoming orders with a live Kanban-style board.
- **QR Scanner**: Built-in camera scanner for staff to verify customer orders instantly.
- **Product Management**: Full CRUD operations for menu items and categories.
- **User Management**: Manage roles (Customer, Staff, Admin) and permissions.

#### ⚙️ Technical Highlights

- **Authentication**: Secure login via **Google OAuth** and Credentials (email/password) using **NextAuth.js v5**.
- **Database**: **MongoDB Atlas** with Mongoose ODM for robust data modeling.
- **Performance**: Server-Side Rendering (SSR) and Static Site Generation (SSG) for optimal SEO and speed.
- **Cron Jobs**: Automated order expiration handling via **Vercel Cron**.
- **Testing**: Unit and integration tests using **Vitest**.

---

## 🛠️ Tech Stack

| Layer                   | Technology                                                       |
| ----------------------- | ---------------------------------------------------------------- |
| **Frontend**      | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React |
| **UI Components** | Shadcn/UI (Radix Primitives), Framer Motion                      |
| **Backend**       | Next.js API Routes (Serverless), Mongoose                        |
| **Database**      | MongoDB Atlas                                                    |
| **Auth**          | NextAuth.js (Auth.js) v5 Beta                                    |
| **State**         | Zustand (Global Store), React Hook Form + Zod (Validation)       |
| **Testing**       | Vitest, React Testing Library                                    |
| **Deployment**    | Vercel                                                           |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/coffeehybrid-v2.git
   cd coffeehybrid-v2/coffeehybrid
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication (NextAuth.js)
   NEXTAUTH_SECRET=your_generated_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Cron Jobs (Optional for local dev)
   CRON_SECRET=your_cron_secret_key
   ```
4. **Run the development server:**

   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

We use **Vitest** for unit and integration testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📂 Project Structure

```
coffeehybrid/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (public)/         # Public pages (menu, cart, checkout)
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # Backend API endpoints
│   ├── staff/            # Staff portal routes
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── cart/             # Cart components
│   ├── menu/             # Product cards and lists
│   ├── staff/            # QR Scanner and Order Queue
│   └── ui/               # Shadcn/UI primitives
├── lib/                  # Utilities, DB connection, Auth config
├── models/               # Mongoose schemas (User, Product, Order)
├── store/                # Zustand state stores
└── types/                # TypeScript interfaces
```

---

## 🔮 Future Roadmap

- [ ] **Loyalty Program**: Points system for frequent customers.
- [ ] **Mobile App**: React Native wrapper for iOS/Android.
- [ ] **Payment Integration**: Stripe/PayPal payment gateway.
- [ ] **AI Recommendations**: Personalized drink suggestions based on order history.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ and ☕️ by [Your Name]
