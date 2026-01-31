# 🚀 Quick Start Guide: Setting up Razorpay Payment Gateway

## ✅ What's Been Done

The payment gateway integration is **90% complete**! Here's what's ready:

- ✅ Database models (Course & Enrollment)
- ✅ Payment API endpoints (`/api/payment/create-order` and `/api/payment/verify`)
- ✅ Frontend payment modal with form
- ✅ Razorpay SDK integration
- ✅ 6 courses seeded in database
- ✅ Signature verification for security

## 🔑 What You Need to Do

### Step 1: Create Razorpay Account (10 minutes)

1. **Go to Razorpay**: Visit [https://razorpay.com](https://razorpay.com) and click "Sign Up"
2. **Register**: Use your email and create account
3. **Verify Email**: Check your email and verify
4. **Login**: Access your dashboard

### Step 2: Get Your API Keys (2 minutes)

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Click on **"Settings"** in left sidebar
3. Click on **"API Keys"** 
4. You'll see **"Test Mode"** toggle at top
5. Click **"Generate Test Key"** (if not already generated)
6. You'll see:
   - **Key ID** (looks like: `rzp_test_XXXXXXXXXXXXXXXX`)
   - **Key Secret** (click "show" to reveal)
7. **COPY BOTH** - we'll use them in next step

### Step 3: Add to Environment Variables (1 minute)

1. Open your `.env.local` file (create if it doesn't exist)
2. Add these two lines:

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYYYYYY
```

Replace with YOUR actual keys from Step 2.

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🧪 Testing the Payment Flow

### Test with Fake Cards (No Real Money!)

Razorpay provides test cards you can use:

**Credit/Debit Card:**
- Card Number: `4111 1111 1111 1111`
- CVV: `123` (any 3 digits)
- Expiry: `12/25` (any future date)
- Name: Your name

**UPI:**
- UPI ID: `success@razorpay`

**Net Banking:**
- Select any bank
- Use any credentials (it's test mode!)

### How to Test:

1. Go to http://localhost:3000/courses
2. Click **"Enroll Now"** on any course
3. Fill the form with:
   - Name: Your test name
   - Email: test@example.com
   - Phone: 9999999999
4. Click **"Pay ₹X,XXX"**
5. Razorpay checkout will open
6. Use test card details above
7. Complete payment
8. You'll see "Payment successful!" alert

### Check Database:

```bash
npx prisma studio
```

Go to `Enrollment` table - you'll see your test enrollment!

## 🎉 You're Done!

The payment gateway is working. Now users can:
- Click "Enroll Now" on any course
- Fill their details
- Pay via Razorpay (cards, UPI, wallets, net banking)
- Get enrolled automatically

## 📚 Going Live (Later)

When you're ready for real payments:

1. **Complete KYC**:
   - Go to Dashboard → Account & Settings
   - Submit business documents
   - Add bank account details
   - Wait 2-3 days for approval

2. **Switch to Live Keys**:
   - Get Live keys from dashboard
   - Replace in `.env.local`:
     ```env
     RAZORPAY_KEY_ID=rzp_live_XXXXXXXX
     RAZORPAY_KEY_SECRET=YYYYYYYYYYYY
     ```

3. **Deploy & Test** with small real transaction

## 💡 Pro Tips

- Test mode = FREE, use it extensively
- Check Razorpay Dashboard for all payments
- Transaction fees: 2% + ₹0 for cards/UPI
- Instant settlements: +0.25% extra
- Keep API keys SECRET (never commit to Git)

## 🆘 Troubleshooting

### "Cannot find module 'razorpay'"
Run: `npm install razorpay`

### Payment not opening?
1. Check browser console for errors
2. Ensure Razorpay script loaded (check Network tab)
3. Verify KEY_ID is correct

### "Invalid signature"
- KEY_SECRET is wrong in .env.local
- Mixing test/live keys

### Still stuck?
- Check `RAZORPAY_SETUP.md` for detailed docs
- Razorpay Docs: https://razorpay.com/docs/
- Their support is excellent: https://razorpay.com/support/

---

**Ready to test? Follow Steps 1-4 above! 🚀**
