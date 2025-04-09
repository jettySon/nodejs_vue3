// test.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 타입 체크를 위한 샘플 쿼리
    const result = await prisma.board.findMany({
        orderBy: { idx: 'desc' }
    })
    console.log(result)
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())