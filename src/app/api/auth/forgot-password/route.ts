import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "请输入邮箱" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (user) {
    console.log(`[DEV] Password reset for ${email}: user found (ID: ${user.id})`);
    // In production: send email with reset link via nodemailer
  }

  return NextResponse.json({ message: "如该邮箱已注册，重置邮件已发送" });
}
