// src/services/BoardService.ts
import prisma from '../../lib/prisma';
import { BoardVO } from '../../models/board/BoardVO';

interface PaginationResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default class BoardService {

    async getAllBoards(page = 1, limit = 10): Promise<PaginationResult<BoardVO>> {
        // Prisma에서는 skip과 take를 사용하여 페이지네이션 구현
        const skip = (page - 1) * limit;

        // 전체 개수와 페이지 데이터를 병렬로 조회
        const [total, boards] = await Promise.all([
            prisma.board.count({
                where: { isUse: true }
            }),
            prisma.board.findMany({
                where: { isUse: true },
                skip,
                take: limit,
                orderBy: { id: 'desc' }
            })
        ]);

        // 도메인 모델로 변환
        const boardVOs = boards.map(board => this.mapToVO(board));

        return {
            data: boardVOs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }



    private mapToVO(data: any): BoardVO {
        return new BoardVO(
            data.id,
            data.boardKey,
            data.writerKey,
            data.writer,
            data.title,
            data.contentText,
            data.isUse,
            data.createdAt,
            data.updatedAt
        );
    }
}