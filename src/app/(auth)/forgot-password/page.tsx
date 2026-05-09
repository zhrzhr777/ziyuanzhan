"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      setSent(true);
      if (!res.ok) {
        toast.error("发送失败");
      }
    } catch {
      toast.error("发送失败，请重试");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">找回密码</CardTitle>
        <CardDescription>
          {sent ? "如该邮箱已注册，我们会发送重置邮件" : "请输入注册邮箱"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="text-center py-4 space-y-4">
            <p className="text-muted-foreground text-sm">
              密码重置链接已发送到你的邮箱（开发模式：查看控制台）。
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">返回登录</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入注册邮箱"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              发送重置链接
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          返回登录
        </Link>
      </CardFooter>
    </Card>
  );
}
