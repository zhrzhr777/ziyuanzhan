"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/payment/payment-modal";
import { Download, Lock, LogIn, ExternalLink, HardDrive } from "lucide-react";

interface Props {
  resourceId: string;
  resourceSlug: string;
  price: number;
  hasPurchased: boolean;
  fileUrl: string;
  externalUrl?: string;
  isLoggedIn: boolean;
  className?: string;
}

export function DownloadButton({
  resourceId,
  resourceSlug,
  price,
  hasPurchased,
  fileUrl,
  externalUrl,
  isLoggedIn,
  className,
}: Props) {
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);

  // 如果有外链且免费
  if (externalUrl && price === 0) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          className={className}
          variant="default"
          onClick={() => window.open(externalUrl, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          访问资源
        </Button>
      </motion.div>
    );
  }

  // 有外链且付费（已购买）
  if (externalUrl && hasPurchased) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          className={className}
          variant="secondary"
          onClick={() => window.open(externalUrl, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          打开链接
        </Button>
      </motion.div>
    );
  }

  // 免费资源 + 已登录
  if (price === 0 && isLoggedIn) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button className={className} onClick={() => router.push(fileUrl || "#")}>
          <Download className="mr-2 h-4 w-4" />
          免费下载
        </Button>
      </motion.div>
    );
  }

  // 免费资源 + 未登录
  if (price === 0 && !isLoggedIn) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button className={className} onClick={() => router.push(`/login?callbackUrl=/resources/${resourceSlug}`)}>
          <LogIn className="mr-2 h-4 w-4" />
          登录后免费下载
        </Button>
      </motion.div>
    );
  }

  // 付费资源 + 已购买
  if (hasPurchased) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button className={className} variant="secondary" onClick={() => router.push(fileUrl || "#")}>
          <Download className="mr-2 h-4 w-4" />
          下载
        </Button>
      </motion.div>
    );
  }

  // 付费资源 + 未登录
  if (!isLoggedIn) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button className={className} onClick={() => router.push(`/login?callbackUrl=/resources/${resourceSlug}`)}>
          <LogIn className="mr-2 h-4 w-4" />
          登录后购买
        </Button>
      </motion.div>
    );
  }

  // 付费资源 + 已登录 + 未购买
  return (
    <>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button className={className} onClick={() => setShowPayment(true)}>
          <Lock className="mr-2 h-4 w-4" />
          立即购买 ￥{price}
        </Button>
      </motion.div>
      {showPayment && (
        <PaymentModal
          resourceId={resourceId}
          resourceSlug={resourceSlug}
          amount={price}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
