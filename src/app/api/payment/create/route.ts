import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "请先登录" }, { status: 401 });
  }

  const { resourceId, amount } = await req.json();

  if (!resourceId || !amount) {
    return NextResponse.json({ message: "参数不完整" }, { status: 400 });
  }

  const resource = await db.resource.findUnique({ where: { id: resourceId } });
  if (!resource) {
    return NextResponse.json({ message: "资源不存在" }, { status: 404 });
  }

  // Check if already purchased
  const existing = await db.order.findFirst({
    where: {
      userId: session.user.id,
      resourceId,
      status: "PAID",
    },
  });
  if (existing) {
    return NextResponse.json({ message: "已购买，无需重复支付" }, { status: 400 });
  }

  const orderNo = `ORD${Date.now()}${nanoid(6)}`;

  const order = await db.order.create({
    data: {
      orderNo,
      userId: session.user.id,
      resourceId,
      amount,
      status: "PENDING",
    },
  });

  // Mock: return a placeholder QR code
  const qrcodeUrl = process.env.MOCK_PAYMENT === "true"
    ? `https://placehold.co/300x300/FFF/333?text=Pay+${amount}+Yuan`
    : "";

  return NextResponse.json({
    orderId: order.id,
    orderNo: order.orderNo,
    qrcodeUrl,
  });
}
