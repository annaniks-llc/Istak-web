# 🍷 Online Drinks Store

A modern, full-featured online store for alcoholic beverages built with Next.js 15, TypeScript, and Zustand state management.

## ✨ Features

### 🔐 Authentication System
- **Login Page** (`/login`) - User authentication with form validation
- **Registration Page** (`/register`) - New user registration with comprehensive form validation
- **Demo Credentials**: 
  - Email: `demo@example.com`
  - Password: `password`

### 👤 User Dashboard (`/dashboard`)
- **Profile Management** - View and edit personal information
- **Order History** - Track all past orders with status updates
- **Responsive Design** - Works seamlessly on all devices

### 🛍️ Product Management
- **Products Page** (`/products`) - Browse all available drinks with:
  - Advanced filtering by category (Vodka, Cocktail, Whiskey, Rum, Gin, Tequila, Wine, Beer)
  - Search functionality
  - Sorting by name, price, or rating
  - Responsive grid layout
- **Product Details** (`/products/[id]`) - Detailed product information including:
  - Product specifications (volume, alcohol content, origin)
  - Ingredients list
  - Related products
  - Add to cart with quantity selection

### 🛒 Shopping Cart (`/cart`)
- **Cart Management** - Add, remove, and update item quantities
- **Real-time Updates** - Cart badge shows total items in header
- **Order Summary** - Calculate totals with tax and shipping
- **Persistent Storage** - Cart data persists across sessions

### 💳 Checkout Process (`/checkout`)
- **Shipping Information** - Comprehensive address form
- **Payment Methods** - Credit Card, PayPal, Cash on Delivery
- **Order Review** - Complete order summary before confirmation
- **Form Validation** - Real-time validation with error messages

### ✅ Order Confirmation (`/order-confirmation/[id]`)
- **Order Details** - Complete order information
- **Tracking Information** - Order status and tracking number
- **Next Steps** - Clear guidance on what happens next
- **Order History** - Access to all past orders

## 🏗️ Technical Architecture

### State Management
- **Zustand Stores**:
  - `auth.ts` - User authentication and profile management
  - `cart.ts` - Shopping cart functionality
  - `products.ts` - Product data and filtering
  - `orders.ts` - Order management and history

### Form Handling
- **React Hook Form** - Efficient form management
- **Zod Validation** - Type-safe form validation
- **Real-time Validation** - Instant feedback on form errors

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Modern Styling** - SCSS modules with consistent design system
- **Toast Notifications** - User feedback for all actions
- **Loading States** - Smooth user experience during data fetching
- **Error Handling** - Graceful error states and user guidance

### Mock Data
- **10 Premium Products** - Realistic alcoholic beverage data
- **User Profiles** - Complete user information structure
- **Order System** - Full order lifecycle simulation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Istak-web

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Available Scripts
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn test         # Run tests
```

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with featured products
- **Products** (`/products`) - Product catalog with filtering
- **Product Details** (`/products/[id]`) - Individual product pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Cart** (`/cart`) - Shopping cart management

### Protected Pages (Requires Authentication)
- **Dashboard** (`/dashboard`) - User profile and order history
- **Checkout** (`/checkout`) - Order completion
- **Order Confirmation** (`/order-confirmation/[id]`) - Order success page

## 🎨 Design System

### Color Palette
- **Primary**: `#827E78` (Gray)
- **Primary Dark**: `#221C13` (Dark Gray)
- **Secondary**: `#D5873B` (Orange)
- **Placeholder**: `#F6F4F1` (Light Gray)

### Typography
- **Geist Sans** - Primary font family
- **Geist Mono** - Monospace font for code elements

### Components
- **Button** - Consistent button styling with variants
- **Input** - Form input components with validation states
- **ProductCard** - Product display component
- **CartBadge** - Shopping cart indicator

## 🔧 Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **SCSS Modules** - Styled components
- **React Hot Toast** - Toast notifications
- **Framer Motion** - Animations (existing)

## 📊 Data Structure

### Product Schema
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  volume: number;
  category: 'vodka' | 'cocktail' | 'whiskey' | 'rum' | 'gin' | 'tequila' | 'wine' | 'beer';
  image: string;
  ingredients?: string[];
  alcoholContent: number;
  origin: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}
```

### User Schema
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}
```

### Order Schema
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}
```

## 🧪 Testing

The project includes Jest configuration for testing:
```bash
yarn test         # Run all tests
yarn test:watch   # Run tests in watch mode
```

## 📦 Deployment

### Build for Production
```bash
yarn build
yarn start
```

### Environment Variables
Create a `.env.local` file for any environment-specific configurations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a demo application with mock data. In a production environment, you would integrate with real APIs for authentication, payment processing, and inventory management.
