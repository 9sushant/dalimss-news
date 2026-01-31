import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      enrollmentId,
    } = req.body;

    // Verify payment signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      // Update enrollment as failed
      await (prisma as any).enrollment.update({
        where: { id: enrollmentId },
        data: { status: "failed" },
      });

      return res.status(400).json({ 
        success: false, 
        error: "Invalid payment signature" 
      });
    }

    // Update enrollment as paid
    const enrollment = await (prisma as any).enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      include: {
        course: true,
      },
    });

    // Increment course student count
    await (prisma as any).course.update({
      where: { id: enrollment.courseId },
      data: {
        students: {
          increment: 1,
        },
      },
    });

    console.log("Payment verified successfully for:", enrollment.userEmail);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      enrollment,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Payment verification failed",
      details: error.message 
    });
  }
}
