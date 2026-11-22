# WedPlan — Wedding Planning Platform

WedPlan is a full-stack wedding planning platform where customers can discover professional wedding services, explore vendors, and request bookings. Vendors can manage their services and booking requests, while administrators manage users, services, and platform transactions.

## 🌐 Live Website

[Add your deployed client URL here]

## 📂 Project Repositories

- Client Repository: [WedPlan Client](https://github.com/zenianazninmbstu/wedplan-client)
- Server Repository: [WedPlan Server](https://github.com/zenianazninmbstu/WedPlan-server)

## ✨ Key Features

- Role-based authentication for Admin, Vendor, and Customer.
- Browse and search wedding services.
- Filter services by category and location.
- Sort services by price.
- View detailed service information.
- Submit and manage wedding booking requests.
- Vendor dashboard with service and booking management.
- Free and Premium vendor subscription plans.
- Secure Stripe Checkout integration.
- Customer and Vendor profile management.
- Image uploads using ImgBB.
- Admin dashboard for managing users, services, and transactions.
- Responsive user interface.
- Loading states and toast notifications.
- Smooth UI animations.

## 🛠️ Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Node.js
- Express.js
- JavaScript (ES Modules)
- MongoDB
- Better Auth
- JOSE
- Stripe Checkout
- ImgBB
- Framer Motion / Motion
- Sonner
- Lucide React

## ⚙️ Installation & Setup

### 1. Clone the Repository


git clone https://github.com/zenianazninmbstu/wedplan-client.git


### 2. Navigate to the Project Directory


cd wedplan-client


### 3. Install Dependencies


npm install


### 4. Configure Environment Variables

Create a `.env.local` file in the project root:


NEXT_PUBLIC_API_URL=http://localhost:5000


Add any other required public configuration variables used by your local setup. Never expose secret credentials in frontend code.

## 🚀 Run Locally

Start the development server:


npm run dev


Open your browser:

`http://localhost:3000`

Make sure the Express backend server is running before using backend-dependent features.

## 🏗️ Build for Production


npm run build
npm run start


## 🔐 Security & Configuration

- Protected routes and authentication are handled through Better Auth.
- Backend authorization and sensitive operations are verified by the server.
- Environment variables are used for application configuration.
- Secret credentials must never be exposed in frontend code.
- Never upload `.env.local` to GitHub.

## 📝 Important Notes

- Configure the backend API URL before running the client locally.
- Ensure the server and required integrations are properly configured.
- Use Stripe Test Mode credentials during development.
- Keep client and server environment configurations consistent.



**WedPlan — Making Wedding Planning Easier, Smarter, and More Beautiful.**