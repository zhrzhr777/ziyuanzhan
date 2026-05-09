import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (process.env.MOCK_PAYMENT !== "true") {
    return NextResponse.json({ message: "仅开发模式可用" }, { status: 403 });
  }

  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ message: "缺少订单ID" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ message: "订单不存在" }, { status: 404 });
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "PAID", paidAt: new Date() },
  });

  return NextResponse.json({ message: "支付成功", status: "PAID" });
}
