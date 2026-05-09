"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink } from "lucide-react";
import type { ResourceWithCategory } from "@/types";

export function ResourceCard({ resource, index = 0 }: { resource: ResourceWithCategory; index?: number }) {
  const hasExternal = !!resource.externalUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/resources/${resource.slug}`}>
        <Card className="h-full group overflow-hidden border-2 border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer">
          {/* Cover */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center overflow-hidden relative">
            {resource.coverImage ? (
              <img
                src={resource.coverImage}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <motion.span
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {resource.category?.icon || "📁"}
              </motion.span>
            )}
            {/* 悬浮价格标签 */}
            <div className="absolute top-2 right-2">
              <Badge
                variant={resource.price > 0 ? "default" : "secondary"}
                className="shadow-lg text-xs font-bold"
              >
                {resource.price > 0 ? `￥${resource.price}` : "免费"}
              </Badge>
            </div>
            {hasExternal && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-background/80 text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" /> 外链
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {resource.category?.name || "未分类"}
              </Badge>
            </div>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
              {resource.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {resource.description}
            </p>
          </CardContent>

          <CardFooter className="px-4 pb-4 pt-0">
            <div className="flex items-center text-xs text-muted-foreground gap-3">
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {resource.downloadCount}
              </span>
              {resource.fileSize && <span>{resource.fileSize}</span>}
              <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity text-primary font-medium">
                查看详情 →
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
