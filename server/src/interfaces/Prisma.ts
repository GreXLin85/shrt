import { Prisma, PrismaClient } from '@prisma/client'

const whichOneToLog: (Prisma.LogLevel | Prisma.LogDefinition)[] = process.env.NODE_ENV !== 'test' ? ['info', 'warn', 'error'] : []

const prisma = new PrismaClient({
  log: whichOneToLog
});

export default prisma
