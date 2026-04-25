import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: process.env.DATABASE_URL, // REQUIRED in Prisma 7
  },
});
