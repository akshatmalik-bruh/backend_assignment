import dotenv from "dotenv";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || "Jai$riram123";
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS = process.env.REDIS;
export const PORT = process.env.PORT || 3000;