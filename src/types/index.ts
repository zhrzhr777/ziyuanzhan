import type { User, Resource, Category, Order } from "../generated/prisma/client";

export type { User, Resource, Category, Order };

export type ResourceWithCategory = Resource & {
  category: Category;
};

export type OrderWithResource = Order & {
  resource: Resource;
};

export type UserSession = {
  id: string;
  email: string;
  name: string;
  role: string;
};
