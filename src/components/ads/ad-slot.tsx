import { db } from "@/lib/db";

interface AdSlotProps {
  position: string;
  className?: string;
}

export async function AdSlot({ position, className = "" }: AdSlotProps) {
  let adCode: string | null = null;

  try {
    const slot = await db.adSlot.findUnique({
      where: { position },
    });
    if (slot && slot.isActive && slot.adCode) {
      adCode = slot.adCode;
    }
  } catch {
    // Database not available (build time), show placeholder
  }

  if (!adCode) {
    return (
      <div className={`flex items-center justify-center border-2 border-dashed border-muted rounded-lg p-8 text-center ${className}`}>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">广告位招租</p>
          <p className="text-xs text-muted-foreground/60">{position}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        srcDoc={`<html><body style="margin:0;padding:0;">${adCode}</body></html>`}
        sandbox="allow-scripts allow-popups"
        className="w-full border-0 overflow-hidden"
        style={{ minHeight: "90px" }}
        title={`ad-${position}`}
      />
    </div>
  );
}
