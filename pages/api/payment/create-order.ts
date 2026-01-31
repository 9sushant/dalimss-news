import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { courseId, userName, userEmail, userPhone, userId } = req.body;

    // Validate input
    if (!courseId || !userName || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch course details
    const course = await (prisma as any).course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(course.price * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: course.id,
        courseName: course.title,
        userEmail,
        userName,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Store enrollment in database
    const enrollment = await (prisma as any).enrollment.create({
      data: {
        userId: userId || null,
        userName,
        userEmail,
        userPhone: userPhone || null,
        courseId: course.id,
        amount: course.price,
        currency: "INR",
        status: "created",
        razorpayOrderId: razorpayOrder.id,
      },
    });

    console.log("Order created:", razorpayOrder.id);

    return res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      enrollmentId: enrollment.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Payment order creation error:", error);
    return res.status(500).json({ 
      error: "Failed to create order",
      details: error.message 
    });
  }
}
