import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ResourceCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-10 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="h-5 bg-muted animate-pulse rounded w-full" />
        <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-full" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="flex gap-3">
          <div className="h-4 w-12 bg-muted animate-pulse rounded" />
          <div className="h-4 w-14 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="aspect-video bg-muted animate-pulse rounded-lg" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-14 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="h-8 bg-muted animate-pulse rounded w-2/3" />
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </div>
        <div className="w-80 shrink-0 space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-40 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ResourceCardSkeleton key={i} />
      ))}
    </div>
  );
}
