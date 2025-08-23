import { PrismaClient } from "./generated/prisma"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
const globalForPrisma = globalThis as {
    prisma?: PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query']
})

if(process.env.NODE_ENV != "production") globalForPrisma.prisma = prisma

export default prisma