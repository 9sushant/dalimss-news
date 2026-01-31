# Razorpay Payment Gateway Integration Guide

## Setup Instructions

### 1. Create Razorpay Account
1. Visit [https://razorpay.com/](https://razorpay.com/)
2. Sign up for a free account
3. Complete KYC verification (required for live payments)

### 2. Get API Keys
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate/Copy your **Test Mode** keys:
   - Key ID (starts with `rzp_test_`)
   - Key Secret

### 3. Add Environment Variables
Add these to your `.env.local` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### 4. Run Database Migration
The Prisma schema has been updated with Course and Enrollment models.

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed Courses (Optional)
You can create courses manually via database or create an admin panel.

Example SQL to insert test courses:

```sql
INSERT INTO "Course" (title, description, price, duration, level, students, rating, highlights)
VALUES 
  ('Digital Journalism Fundamentals', 'Learn the basics of modern digital journalism', 4999, '6 weeks', 'Beginner', 0, 4.8, '["News Writing","Research Skills","Interview Techniques","Ethics in Journalism"]'),
  ('Video Production & Editing', 'Master video production from concept to final cut', 6999, '8 weeks', 'Intermediate', 0, 4.9, '["Camera Techniques","Adobe Premiere Pro","Sound Design","Color Grading"]');
```

## Testing Payment Flow

### Test Mode
Razorpay provides test cards for testing:

**Test Card Details:**
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **OTP:** 123456 (for test mode)

**Other Payment Methods:**
- **UPI:** success@razorpay
- **Netbanking:** Select any bank and use any credentials

### Payment Flow
1. User clicks "Enroll Now" on a course
2. Modal opens with enrollment form
3. User fills name, email, phone
4. Clicks "Pay" button
5. Razorpay checkout opens
6. User completes payment
7. Payment is verified server-side
8. Enrollment is saved to database
9. Course student count increments

## Security Features
- Server-side signature verification
- Order creation with unique receipt IDs
- Enrollment tracking for audit trail
- Failed payment logging

## Going Live

### 1. Complete KYC
- Submit business documents
- Bank account verification
- Razorpay will review (2-3 days)

### 2. Switch to Live Keys
- Get **Live Mode** keys from dashboard
- Replace test keys in `.env.local`:
  ```env
  RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
  RAZORPAY_KEY_SECRET=your_live_secret_key
  ```

### 3. Configure Webhooks (Optional)
For automatic payment confirmation:
1. Dashboard → Webhooks → Add New Webhook
2. URL: `https://yourdomain.com/api/payment/webhook`
3. Events: `payment.captured`, `payment.failed`

## Payment Methods Supported
- Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
- UPI (Google Pay, PhonePe, Paytm, BHIM)
- Netbanking (All major banks)
- Wallets (Paytm, PhonePe, Freecharge, MobiKwik)
- EMI options

## Pricing
Razorpay charges:
- **2% + ₹0** per transaction for domestic cards/UPI
- **3% + ₹0** for international cards
- Instant settlements available (additional 0.25%)

## API Endpoints Created

### Create Order
**POST** `/api/payment/create-order`

Request:
```json
{
  "courseId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+919876543210",
  "userId": "optional_user_id"
}
```

Response:
```json
{
  "orderId": "order_xxxxx",
  "amount": 499900,
  "currency": "INR",
  "enrollmentId": "enroll_xxxxx",
  "key": "rzp_test_xxxxx"
}
```

### Verify Payment
**POST** `/api/payment/verify`

Request:
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "enrollmentId": "enroll_xxxxx"
}
```

Response:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "enrollment": {...}
}
```

## Database Schema

### Course Model
- id, title, description, price
- duration, level, students, rating
- highlights (JSON array)
- timestamps

### Enrollment Model
- id, userId, userName, userEmail, userPhone
- courseId (relation to Course)
- amount, currency, status
- razorpay fields (orderId, paymentId, signature)
- timestamps

## Troubleshooting

### Payment not working?
1. Check if Razorpay script is loaded
2. Verify API keys are correct
3. Check browser console for errors
4. Ensure test mode is enabled

### Signature verification failing?
- Make sure KEY_SECRET matches in both env and Razorpay dashboard
- Check that you're not mixing test/live keys

### Order creation failing?
- Verify database connection
- Check Prisma schema is migrated
- Ensure Course exists in database

## Support
- Razorpay Docs: https://razorpay.com/docs/
- Support: https://razorpay.com/support/
