# Next.js Shop

A full-stack e-commerce application built with **Next.js App Router**, **React**, and **MongoDB**. The project includes a customer-facing storefront, shopping cart and checkout flow, account features, and an administration area for managing the store.

> This repository is under active development. Features, configuration, and routes may change as the application evolves.

## Overview

The application is organized around two main experiences:

- **Storefront:** browse products, view product details, manage a cart, and proceed through checkout.
- **Administration:** manage products, categories, users, discounts, comments, and stock through dedicated dashboard pages.

## Features

### Storefront
- Product listing and individual product detail pages
- Featured and related product sections
- Product categories and home-page category navigation
- Shopping cart with shared cart state
- Checkout flow
- Address management
- Customer profile and order history pages

### Authentication and accounts
- Login and registration pages
- NextAuth-based authentication
- OTP send and verification API routes
- Customer profile and address management

### Store administration
- Admin dashboard
- Product creation, editing, and listing
- Category management
- User management
- Discount creation, editing, and verification
- Stock management
- Comment management
- Order management endpoints

### Backend
- REST API routes implemented with the Next.js App Router
- MongoDB connection managed through Mongoose
- Dedicated Mongoose models for users, products, categories, carts, orders, discounts, comments, and OTP records

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js](https://nextjs.org/) 16 | React framework and App Router |
| [React](https://react.dev/) 19 | User interface |
| [MongoDB](https://www.mongodb.com/) | Database |
| [Mongoose](https://mongoosejs.com/) | MongoDB object modeling |
| [NextAuth.js](https://next-auth.js.org/) | Authentication |
| [Bootstrap](https://getbootstrap.com/) 5 | Styling and responsive UI |
| [React Bootstrap](https://react-bootstrap.netlify.app/) | Bootstrap components for React |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon components |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | Toast notifications |

The codebase is written in **JavaScript**.

## Getting Started

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (use a current LTS release)
- npm
- A MongoDB database, either local or hosted (for example, MongoDB Atlas)
- A GitHub account is only needed if you plan to clone or contribute to this repository

### 1. Clone the repository

```bash
git clone https://github.com/mehrandevs/nextjs-shop.git
cd nextjs-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a file named `.env.local` in the project root:

```env
MONGODB_URI="your-mongodb-connection-string"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Replace the placeholder values with your own configuration. Never commit real credentials, database connection strings, API keys, or secrets to Git.

> Some integrations may require additional environment variables depending on how they are configured. Check the relevant implementation before enabling them.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The development server supports hot reloading, so changes to the application are reflected as you edit the code.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server (after building) |

## Project Structure

A simplified view of the main application directories:

```text
nextjs-shop/
├── app/
│   ├── admin/          # Store administration pages
│   ├── address/        # Address-related pages
│   ├── api/            # REST API route handlers
│   ├── auth/           # Login and registration pages
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout flow
│   ├── components/     # Shared UI and feature components
│   ├── context/        # React context providers
│   ├── home/           # Home-page data helpers
│   ├── lib/            # Shared utilities and database connection
│   ├── panel/          # Customer account pages
│   ├── products/       # Product detail pages
│   └── styles/         # Application stylesheets
├── models/             # Mongoose models
├── public/             # Static assets and uploaded media
├── package.json
└── README.md
```

## API Areas

The API is grouped by feature under `app/api/`:

- `/api/auth` — authentication and OTP operations
- `/api/products` — product data and related product endpoints
- `/api/categories` — category data
- `/api/cart` — cart operations
- `/api/order` and `/api/panel/orders` — order operations
- `/api/address` — customer addresses
- `/api/users` and `/api/panel/user` — user and account operations
- `/api/discounts` — discounts and discount verification
- `/api/comments` — product comments

These are route groups, not a substitute for checking each route handler's accepted methods and request schema.

## Database

The application uses MongoDB with Mongoose models located in `models/`:

- `User`
- `Product`
- `Category`
- `Cart`
- `Order`
- `Discount`
- `Comment`
- `Otp`

Set `MONGODB_URI` to a database you control. For local development, you can use a local MongoDB instance or a MongoDB Atlas connection string.

## Deployment

The application can be deployed to a Node.js-compatible hosting platform such as [Vercel](https://vercel.com/).

For a production deployment:

1. Push the repository to GitHub.
2. Import the repository into your hosting provider.
3. Configure the production environment variables in the hosting dashboard.
4. Set `MONGODB_URI` to your production database connection string.
5. Set `NEXTAUTH_URL` to your production application URL.
6. Generate a strong, unique `NEXTAUTH_SECRET`.
7. Deploy and verify the storefront, authentication, database connection, and checkout flow.

Do not use development credentials or a local database URL in production.

## Development Workflow

A recommended workflow for new features:

```bash
# Start from the latest main branch
git switch main
git pull origin main

# Create a feature branch
git switch -c feature/your-feature-name

# After making changes
git add .
git commit -m "Describe your changes"

# Push the feature branch to GitHub
git push -u origin feature/your-feature-name
```

Open a Pull Request when the feature is ready to be reviewed and merged.

## Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Keep changes focused and use clear commit messages.
4. Test the affected functionality.
5. Open a Pull Request with a concise explanation of the change.

## Author

**Mehran Sharifi**

- GitHub: [@mehrandevs](https://github.com/mehrandevs)

---

Built with JavaScript, Next.js, React, and MongoDB.
