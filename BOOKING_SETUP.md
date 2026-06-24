# Booking Management System - Setup Guide

## ✅ What's Been Implemented

### 1. Redux Store Structure
- ✅ `bookings-slice.js` - Redux slice for bookings state management
- ✅ `bookings-api.js` - RTK Query API for CRUD operations
- ✅ Updated `store.js` to include bookings reducer

### 2. Complete Booking Management UI
- ✅ Full booking form with all required fields
- ✅ Data table with filtering and search
- ✅ Status management (inline status updates)
- ✅ Payment tracking
- ✅ Filter bar (status, date range)
- ✅ Create/Edit/Delete functionality
- ✅ Loading states and error handling

### 3. Form Fields Included

**Customer Information:**
- Customer Name (text)
- Mobile Number (tel)
- Email (email, optional)

**Booking Details:**
- Service (select - will be populated from services API)
- Staff Member (select - will be populated from staff API)
- Booking Date (date)
- Booking Time (time)
- Duration (number - minutes)

**Status & Payment:**
- Status (select: pending, confirmed, completed, cancelled, no_show)
- Payment Status (select: pending, paid, partially_paid, refunded)
- Payment Method (select: cash, card, upi, online)
- Total Amount (number)
- Paid Amount (number)

**Notes:**
- Customer Notes / Special Requests (textarea)
- Internal Notes (textarea)

## 🔧 Setup Instructions

### Step 1: Add API URL

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Or your production API:
# NEXT_PUBLIC_API_URL=https://api.yoursalonapp.com
```

### Step 2: API Endpoints Expected

Your API should provide these endpoints:

```
GET    /api/bookings?page=1&pageSize=10&status=confirmed&date_from=2024-01-01&date_to=2024-01-31
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
PATCH  /api/bookings/:id/status
```

### Step 3: API Response Format

**GET /api/bookings Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "customer_name": "John Doe",
      "customer_mobile": "+919876543210",
      "customer_email": "john@example.com",
      "service_id": "uuid",
      "service_name": "Haircut",
      "staff_id": "uuid",
      "staff_name": "Jane Smith",
      "booking_date": "2024-01-15",
      "booking_time": "10:00",
      "duration": 60,
      "status": "confirmed",
      "payment_status": "paid",
      "payment_method": "cash",
      "total_amount": 500.00,
      "paid_amount": 500.00,
      "customer_notes": "Short on top",
      "notes": "Regular customer",
      "created_at": "2024-01-10T10:00:00Z",
      "updated_at": "2024-01-10T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

**POST /api/bookings Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_mobile": "+919876543210",
  "customer_email": "john@example.com",
  "service_id": "uuid",
  "staff_id": "uuid",
  "booking_date": "2024-01-15",
  "booking_time": "10:00",
  "duration": 60,
  "status": "pending",
  "payment_status": "pending",
  "payment_method": "cash",
  "total_amount": 500.00,
  "paid_amount": 0.00,
  "customer_notes": "Special request",
  "notes": "Internal note"
}
```

**PATCH /api/bookings/:id/status Request Body:**
```json
{
  "status": "confirmed"
}
```

### Step 4: Testing Without API

Currently, the system will make API calls but won't have data until your API is ready. You can:

1. Mock the API responses in `bookings-api.js` for development
2. Or set up your API endpoints following the format above

## 📋 Next Steps

1. ✅ Booking Management UI - **COMPLETE**
2. ⏭️ Services Management (similar structure)
3. ⏭️ Users/Staff Management (similar structure)
4. ⏭️ Customers Management (similar structure)

## 🎯 Features Implemented

- ✅ Complete booking form with validation
- ✅ Redux state management
- ✅ RTK Query for API calls
- ✅ Filtering by status and date range
- ✅ Inline status updates
- ✅ Payment tracking
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

## 🔄 How It Works

1. **Data Fetching**: `useGetBookingsQuery` automatically fetches bookings
2. **Filtering**: Filters are stored in Redux and passed to API
3. **Form Submission**: Form data is collected and sent via mutations
4. **Status Updates**: Inline dropdown updates booking status
5. **State Management**: All state is managed through Redux

## 🚀 Ready for API Integration

Once you have your API ready, just:
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure your API matches the expected format
3. That's it! Everything else is already wired up.

