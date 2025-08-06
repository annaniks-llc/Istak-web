# Mock Database Documentation

This directory contains mock JSON data that serves as a database for the online drinks store application.

## 📁 File Structure

```
app/data/
├── products.json          # Product catalog
├── categories.json        # Product categories
├── users.json            # User accounts
├── orders.json           # Order history
├── reviews.json          # Product reviews
├── coupons.json          # Discount coupons
├── settings.json         # Store configuration
├── mock-database.json    # Complete database (legacy)
└── README.md            # This file
```

## 🗄️ Database Schema

### Products (`products.json`)

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "volume": "number",
  "category": "string",
  "image": "string",
  "ingredients": ["string"],
  "alcoholContent": "number",
  "origin": "string",
  "inStock": "boolean",
  "rating": "number",
  "reviews": "number",
  "tags": ["string"],
  "salePrice": "number|null",
  "discount": "number",
  "featured": "boolean"
}
```

### Categories (`categories.json`)

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "image": "string",
  "productCount": "number"
}
```

### Users (`users.json`)

```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "createdAt": "string",
  "lastLogin": "string",
  "isVerified": "boolean",
  "preferences": {
    "newsletter": "boolean",
    "marketing": "boolean",
    "language": "string"
  }
}
```

### Orders (`orders.json`)

```json
{
  "id": "string",
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "name": "string",
      "price": "number",
      "quantity": "number",
      "total": "number"
    }
  ],
  "subtotal": "number",
  "tax": "number",
  "shipping": "number",
  "total": "number",
  "status": "string",
  "paymentMethod": "string",
  "shippingAddress": "object",
  "billingAddress": "object",
  "createdAt": "string",
  "updatedAt": "string",
  "deliveredAt": "string|null",
  "trackingNumber": "string|null"
}
```

### Reviews (`reviews.json`)

```json
{
  "id": "string",
  "productId": "string",
  "userId": "string",
  "rating": "number",
  "title": "string",
  "comment": "string",
  "createdAt": "string",
  "verified": "boolean"
}
```

### Coupons (`coupons.json`)

```json
{
  "id": "string",
  "code": "string",
  "discount": "number",
  "type": "percentage|fixed",
  "minOrder": "number",
  "maxDiscount": "number",
  "validFrom": "string",
  "validUntil": "string",
  "usageLimit": "number",
  "usedCount": "number",
  "active": "boolean"
}
```

### Settings (`settings.json`)

```json
{
  "store": {
    "name": "string",
    "description": "string",
    "currency": "string",
    "taxRate": "number",
    "shippingCost": "number",
    "freeShippingThreshold": "number",
    "contactEmail": "string",
    "contactPhone": "string",
    "address": "object",
    "socialMedia": "object"
  },
  "features": "object",
  "paymentMethods": "array",
  "shippingMethods": "array",
  "orderStatuses": "array"
}
```

## 🛠️ Usage

### Importing Data

```typescript
import { mockDB } from '@/app/utils/mockData';

// Get all products
const products = mockDB.getProducts();

// Get product by ID
const product = mockDB.getProductById('1');

// Search products
const searchResults = mockDB.searchProducts('vodka');

// Get user orders
const userOrders = mockDB.getUserOrders('1');

// Validate coupon
const couponValidation = mockDB.validateCoupon('WELCOME10', 100);
```

### Available Methods

#### Products

- `getProducts()` - Get all products
- `getProductById(id)` - Get product by ID
- `getProductsByCategory(category)` - Get products by category
- `getFeaturedProducts()` - Get featured products
- `searchProducts(query)` - Search products

#### Categories

- `getCategories()` - Get all categories
- `getCategoryById(id)` - Get category by ID

#### Users

- `getUsers()` - Get all users
- `getUserById(id)` - Get user by ID
- `getUserByEmail(email)` - Get user by email
- `createUser(userData)` - Create new user
- `updateUser(id, updates)` - Update user

#### Orders

- `getOrders()` - Get all orders
- `getOrderById(id)` - Get order by ID
- `getUserOrders(userId)` - Get user's orders
- `createOrder(orderData)` - Create new order
- `updateOrderStatus(id, status)` - Update order status

#### Reviews

- `getReviews()` - Get all reviews
- `getProductReviews(productId)` - Get product reviews
- `createReview(reviewData)` - Create new review

#### Coupons

- `getCoupons()` - Get all coupons
- `getCouponByCode(code)` - Get coupon by code
- `validateCoupon(code, orderTotal)` - Validate coupon

#### Settings

- `getSettings()` - Get store settings

#### Utilities

- `calculateTax(subtotal)` - Calculate tax
- `calculateShipping(subtotal)` - Calculate shipping
- `formatPrice(price)` - Format price

## 🔄 Data Updates

The mock database is in-memory and will reset when the application restarts. To persist changes, you would need to:

1. Implement a real database (PostgreSQL, MongoDB, etc.)
2. Use localStorage/sessionStorage for client-side persistence
3. Implement a file-based storage system

## 📊 Sample Data

### Products

- 10 different alcoholic beverages
- Various categories: vodka, whiskey, rum, gin, tequila, wine, beer, cocktails
- Price range: $8.99 - $89.99
- Featured products with sale prices

### Users

- 3 sample users with complete profiles
- Demo user: `demo@example.com` / `password`

### Orders

- 3 sample orders with different statuses
- Complete order details with items, addresses, and tracking

### Reviews

- 8 product reviews with ratings and comments
- Mix of verified and unverified reviews

### Coupons

- 5 active discount coupons
- Various types: percentage and fixed discounts
- Different minimum order requirements

## 🚀 Integration

The mock database is integrated with the Zustand stores:

- `useProductsStore` - Uses product data
- `useAuthStore` - Uses user data
- `useOrdersStore` - Uses order data
- `useCartStore` - Manages cart state

All stores can be easily replaced with real API calls by updating the store implementations.
