// src/services/board/BoardService.ts
import prisma from '../../lib/prisma';
import { BoardVO } from '../../models/board/BoardVO';
import {Prisma} from "@prisma/client";

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

    async getAllBoards(page = 1, limit = 10): Promise<{
        data: any;
        meta: {
            total: number | GetFindResult<Prisma.$BoardPayload<DefaultArgs>, { take: number; orderBy: { idx: string }; where: { isUse: boolean }; skip: number }, Prisma.PrismaClientOptions>[];
            limit: number;
            totalPages: number;
            page: number
        }
    }> {
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
                orderBy: {
                    idx: Prisma.SortOrder.desc
                }
            })
        ]);


        let boardVOs = null;
        // 도메인 모델로 변환
        if (typeof boards !== "number") {
            boardVOs = boards.map(board => this.mapToVO(board));
        }

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

            const board = await prisma.board.findUnique({
                where: {idx: boardIdx}
            });

            if(!board) {
                return null;
            }

            return this.mapToVO(board);

        } catch (error) {
            console.error(`게시물 조회 오류 (idx: ${idx}):`, error);
            throw error;
        }
    }

    private mapToVO(data: any): BoardVO {
        return new BoardVO(
            data.idx,
            data.boardKey,
            data.writerKey,
            data.writer,
            data.title,
            data.contentText,
            data.isUse,
            data.createDate
        );
    }
}