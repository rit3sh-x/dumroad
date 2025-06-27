# Dumroad - Digital Marketplace

Dumroad is a modern, multi-tenant digital marketplace built with a powerful stack including Next.js, Payload CMS, and tRPC. It provides a platform for creators to sell digital products, with seamless payment integration using Stripe.

## Key Features

- **Multi-tenancy:** Each tenant has their own isolated data, allowing for multiple vendors to operate on the same platform.
- **Digital Product Sales:** Easily upload and sell digital products.
- **Stripe Integration:** Secure and reliable payment processing with Stripe, including webhook support for real-time updates.
- **Authentication:** Robust authentication system for users and tenants.
- **Payload CMS:** Powerful and flexible content management with a rich text editor and custom collections.
- **tRPC:** End-to-end typesafe APIs for a seamless development experience.
- **Shadcn UI:** Beautifully designed and accessible UI components.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **CMS:** [Payload CMS](https://payloadcms.com/)
- **API:** [tRPC](https://trpc.io/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rit3sh-x/dumroad.git
   cd dumroad
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up environment variables:**

   Create a `.env` file by copying the example:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:

   ```
   PAYLOAD_CONFIG_PATH=src/payload.config.ts
   PAYLOAD_SECRET=your-payload-secret
   DATABASE_URI=your-mongodb-uri
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_KEY=your-stripe-webhook-secret
   ```

### Running the Application

1. **Start the development server:**

   ```bash
   bun run dev
   ```

2. **Seed the database (optional):**

   To populate the database with initial data, run:

   ```bash
   bun run db:seed
   ```

   The application will be available at `http://localhost:3000`.

## Available Scripts

- `dev`: Starts the development server.
- `build`: Creates a production build.
- `start`: Starts the production server.
- `lint`: Lints the codebase.
- `generate:types`: Generates types from your Payload configuration.
- `db:fresh`: Drops the database and runs migrations.
- `db:seed`: Seeds the database with initial data.
- `generate:importmap`: Generates an import map for the Payload admin UI.

## Project Structure

The project is organized into the following main directories:

- `src/app`: Contains the Next.js application routes and layouts.
- `src/collections`: Defines the data models (collections) for Payload CMS.
- `src/components`: Shared UI components.
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions and libraries.
- `src/modules`: Contains the core business logic for different features.
- `src/trpc`: tRPC server and client configuration.
- `public`: Static assets.


---

## How the Code Works

Dumroad is architected as a modular, full-stack application using Next.js for the frontend, Payload CMS for content and data management, tRPC for type-safe API communication, and Stripe for payments. Here’s how the main parts of the codebase work together:

### 1. Environment & Configuration

The application loads environment variables from `.env` to configure connections to MongoDB, Stripe, and Payload CMS. The `PAYLOAD_CONFIG_PATH` points to the main Payload configuration in `src/payload.config.ts`, which defines collections, authentication, and admin UI settings.

### 2. Application Structure

- **Frontend (Next.js):**
  - Located in `src/app`, the frontend uses Next.js app directory routing. Pages and layouts are organized by feature (e.g., `(auth)`, `(home)`, `(library)`, `(tenants)`).
  - UI components are in `src/components` and `src/components/ui`, using Shadcn UI and Tailwind CSS for styling.
  - Custom React hooks in `src/hooks` provide reusable logic, such as device detection (`use-mobile`).

- **Backend & API:**
  - tRPC is set up in `src/trpc` to provide end-to-end type-safe APIs between the frontend and backend. Procedures are organized by feature in `src/trpc/routers`.
  - The business logic for each feature (auth, checkout, products, tenants, etc.) is encapsulated in `src/modules`, with clear separation between server logic, UI, and types.
  - Payload CMS collections are defined in `src/collections`, describing the data models for users, products, orders, reviews, etc.

- **Payments:**
  - Stripe integration is handled in `src/lib/stripe.ts` and related modules. Webhooks are managed in `src/app/(payload)/api/stripe` and `src/app/(payload)/api/stripe/webhooks`.

### 3. Data Flow & Business Logic

1. **User requests** (e.g., sign in, view products, checkout) are routed through Next.js pages and handled by React components.
2. **API calls** are made via tRPC, which invokes server-side procedures in `src/modules` for business logic (e.g., authentication, product queries, order creation).
3. **Database operations** are performed using the Payload CMS API, which interacts with MongoDB based on the collection definitions in `src/collections`.
4. **Payments** are processed via Stripe, with webhook events updating order statuses in the database.

### 4. Multi-Tenancy

The `tenants` module and collection ensure that each vendor’s data is isolated. Middleware and server logic enforce tenant boundaries, so users and products are always scoped to the correct tenant.

### 5. Utilities & Extensibility

Utility functions in `src/lib` support authentication, access control, and other cross-cutting concerns. The modular structure makes it easy to add new features or collections by following the established patterns in `src/modules` and `src/collections`.

### 6. Admin & Content Management

Payload CMS provides an admin UI (configured in `src/payload.config.ts`) for managing collections, users, and content. Admins and vendors can use this interface to manage products, orders, and more.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.