import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_SYYCfVv7Um4t2Z",
  key_secret: "uOZPV3Dr08Pa2AuSUVhwrhxT",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = body?.amount || 500; // Default amount
    const currency = body?.currency || "INR";

    const options = {
      amount: amount * 100, // Amount must be in paise (smallest currency unit)
      currency,
      receipt: `rcptid_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
