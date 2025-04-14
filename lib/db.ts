import { PrismaClient } from "@prisma/client"
import { neon } from "@neondatabase/serverless"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Create a SQL client using Neon serverless
export const sql = neon(process.env.DATABASE_URL!)

export default prisma
