// src/services/board/BoardService.ts
import prisma from '../../lib/prisma';
import { BoardVO } from '../../models/board/BoardVO';
import { Prisma, Board } from "@prisma/client";

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

        // 필드명을 명시적으로 타입으로 선언하여 자동 완성 활성화
        const whereCondition: Prisma.BoardWhereInput = {
            is_use: true
        };

        const orderByOption: Prisma.BoardOrderByWithRelationInput = {
            idx: Prisma.SortOrder.desc
        };

        // 전체 개수와 페이지 데이터를 병렬로 조회
        const [total, boards] = await Promise.all([
            prisma.board.count({
                where: whereCondition
            }),
            prisma.board.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: orderByOption
            })
        ]) as [number, Board[]];

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

    // 1개만 조회
    async getBoardOne(idx: number): Promise<BoardVO | null> {
        try {
            const boardIdx = Number(idx);

            // idx가 유효한 숫자인지 확인
            if (isNaN(boardIdx)) {
                throw new Error('유효하지 않은 게시물 번호입니다.');
            }

            const whereCondition: Prisma.BoardWhereUniqueInput = {
                idx: boardIdx
            };

            const board = await prisma.board.findUnique({
                where: whereCondition
            });

            if(!board) {
                return null;
            }

            return this.mapToVO(board as unknown as Board);

        } catch (error) {
            console.error(`게시물 조회 오류 (idx: ${idx}):`, error);
            throw error;
        }
    }


    private mapToVO(data: Board): BoardVO {
        // Prisma에서 받은 snake_case 필드를 BoardVO의 camelCase로 매핑
        return new BoardVO(
            data.idx,
            data.board_key,
            data.writer_key,
            data.writer,
            data.title,
            data.content_text,
            data.is_use,
            data.create_date
        );
    }
}