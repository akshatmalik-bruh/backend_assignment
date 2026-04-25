import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client'; 
import { DATABASE_URL } from "../config.js"; 

// 1. Initialize the pg Pool with recommended settings for Supabase
const pool = new Pool({ 
    connectionString: DATABASE_URL,
    max: 10, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// 2. Setup the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Create the instance using the adapter
const prisma = new PrismaClient({ 
    adapter
});

export default prisma;
