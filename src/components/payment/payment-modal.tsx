"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Loader2, QrCode } from "lucide-react";

interface Props {
  resourceId: string;
  resourceSlug: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ resourceId, amount, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"qr" | "processing" | "success">("qr");
  const [orderId, setOrderId] = useState<string>("");
  const [qrcodeUrl, setQrcodeUrl] = useState<string>("");

  // Create order
  useEffect(() => {
    async function createOrder() {
      try {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceId, amount }),
        });
        const data = await res.json();
        if (data.orderId) {
          setOrderId(data.orderId);
          setQrcodeUrl(data.qrcodeUrl || "");
        }
      } catch {
        toast.error("创建订单失败");
        onClose();
      }
    }
    createOrder();
  }, [resourceId, amount, onClose]);

  // Poll payment status
  const pollStatus = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/payment/status?orderId=${orderId}`);
      const data = await res.json();
      if (data.status === "PAID") {
        setStep("success");
        setTimeout(() => onSuccess(), 1500);
      }
    } catch {
      // Keep polling
    }
  }, [orderId, onSuccess]);

  useEffect(() => {
    if (step !== "qr") return;
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [step, pollStatus]);

  const handleMockConfirm = async () => {
    if (!orderId) return;
    setStep("processing");
    try {
      await fetch(`/api/payment/mock-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      setStep("success");
      setTimeout(() => onSuccess(), 1500);
    } catch {
      toast.error("支付确认失败");
      setStep("qr");
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "支付成功" : "扫码支付"}
          </DialogTitle>
          <DialogDescription>
            {step === "qr" && `支付金额：￥${amount}`}
            {step === "processing" && "正在确认支付..."}
            {step === "success" && "感谢购买，正在跳转下载..."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          {step === "qr" && (
            <>
              {qrcodeUrl ? (
                <img src={qrcodeUrl} alt="支付二维码" className="w-48 h-48 border rounded-lg" />
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                请使用微信或支付宝扫码支付
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleMockConfirm}
              >
                [开发模式] 模拟支付成功
              </Button>
            </>
          )}

          {step === "processing" && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}

          {step === "success" && (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
