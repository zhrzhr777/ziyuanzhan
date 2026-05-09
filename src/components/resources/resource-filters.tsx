"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { resources: number };
}

interface Props {
  categories: Category[];
  currentCategory?: string;
  currentPrice?: string;
  currentSort?: string;
}

function FilterContent({ categories, currentCategory, currentPrice, currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    return `/resources?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h4 className="font-semibold mb-3">价格</h4>
        <div className="space-y-1">
          <Link
            href={buildUrl("price", "")}
            className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
              !currentPrice ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            全部
          </Link>
          <Link
            href={buildUrl("price", "free")}
            className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
              currentPrice === "free" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            免费资源
          </Link>
          <Link
            href={buildUrl("price", "paid")}
            className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
              currentPrice === "paid" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            付费资源
          </Link>
        </div>
      </div>

      <Separator />

      {/* Category Filter */}
      <div>
        <h4 className="font-semibold mb-3">分类</h4>
        <div className="space-y-1">
          <Link
            href={buildUrl("category", "")}
            className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
              !currentCategory ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            全部分类
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl("category", cat.slug)}
              className={`block text-sm px-3 py-1.5 rounded-md transition-colors flex justify-between ${
                currentCategory === cat.slug ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-60">{cat._count.resources}</span>
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h4 className="font-semibold mb-3">排序</h4>
        <div className="space-y-1">
          {[
            { value: "newest", label: "最新发布" },
            { value: "popular", label: "下载最多" },
            { value: "price-low", label: "价格从低到高" },
            { value: "price-high", label: "价格从高到低" },
          ].map((option) => (
            <Link
              key={option.value}
              href={buildUrl("sort", option.value)}
              className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
                (currentSort || "newest") === option.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResourceFilters(props: Props) {
  return (
    <Suspense fallback={<div className="space-y-6"><div className="h-6 bg-muted animate-pulse rounded" /></div>}>
      <FilterContent {...props} />
    </Suspense>
  );
}
