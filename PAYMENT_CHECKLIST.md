# ✅ Payment Gateway - Final Checklist

## 🎯 What You Need to Do (Takes 10 minutes total)

### Step 1: Create Razorpay Account (5 minutes)

- [ ] Go to [Razorpay.com](https://razorpay.com)
- [ ] Click "Sign Up" 
- [ ] Use your business email
- [ ] Verify your email
- [ ] Login to dashboard

### Step 2: Get Test API Keys (2 minutes)

- [ ] Go to [Dashboard → Settings → API Keys](https://dashboard.razorpay.com/app/keys)
- [ ] Ensure you're in **TEST MODE** (toggle at top)
- [ ] Click "Generate Test Key" (if not already generated)
- [ ] Copy **Key ID** (starts with `rzp_test_`)
- [ ] Click "Show" and copy **Key Secret**

### Step 3: Add Keys to .env.local (1 minute)

Open `.env.local` file and replace:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

With your actual keys:

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYYYYYY
```

### Step 4: Restart Server (1 minute)

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

### Step 5: Test Payment (2 minutes)

- [ ] Open http://localhost:3000/courses
- [ ] Click **"Enroll Now"** on any course
- [ ] Fill form:
  - Name: Test User
  - Email: test@example.com
  - Phone: 9999999999
- [ ] Click **"Pay ₹X,XXX"**
- [ ] Razorpay checkout opens
- [ ] Use test card:
  - **Card**: 4111 1111 1111 1111
  - **CVV**: 123
  - **Expiry**: 12/25
  - **Name**: Your Name
- [ ] Complete "payment"
- [ ] See "Payment successful!" alert
- [ ] ✅ DONE!

## 📊 Verify It Worked

Check your database:

```bash
npx prisma studio
```

1. Open **Enrollment** table
2. You should see your test enrollment
3. Status should be **"paid"**
4. Payment ID should be filled

## 🚀 You're Live!

Once the test works, your payment gateway is **fully functional**!

Users can now:
✅ Enroll in courses
✅ Pay via UPI/Cards/NetBanking/Wallets
✅ Get confirmation
✅ Data saved securely

## 📈 Optional Next Steps

After testing works:

### For Production (Going Live):

1. **Complete KYC** on Razorpay (requires business docs)
2. **Get Live Keys** from dashboard
3. **Replace** test keys with live keys in `.env.local`
4. **Deploy** to Vercel
5. **Add live keys** to Vercel environment variables
6. **Test** with real small payment

### For Better UX:

- [ ] Add email confirmation after payment
- [ ] Create "My Courses" page for enrolled students
- [ ] Add course access/LMS integration
- [ ] Send course materials via email
- [ ] Add admin dashboard to view enrollments

## ❓ Troubleshooting

### Payment modal not opening?
- Check browser console for errors
- Ensure Razorpay script loaded (Network tab)
- Verify keys are added to .env.local
- Restart dev server

### "Invalid Key" error?
- Double-check you copied full Key ID from dashboard
- Make sure you're using TEST keys (starts with `rzp_test_`)
- No extra spaces in .env.local

### Payment not verifying?
- Check Key Secret is correct
- Look at terminal for API errors
- Check database migration ran successfully

### Still stuck?
1. Check `PAYMENT_SETUP_QUICK_START.md`
2. Check `RAZORPAY_SETUP.md` for detailed docs
3. Razorpay support: https://razorpay.com/support/

## 🎯 Summary

**Current Status**: ✅ Ready to test
**Time to complete**: 10 minutes
**Next step**: Create Razorpay account → Get keys → Test

**Questions?** All documentation is in the project root:
- `PAYMENT_SETUP_QUICK_START.md` - Start here!
- `RAZORPAY_SETUP.md` - Technical details
- `PAYMENT_INTEGRATION_SUMMARY.md` - What was built

---

**Everything is ready. Just add your Razorpay keys and test! 🚀**
