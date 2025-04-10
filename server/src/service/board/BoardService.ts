// src/services/board/BoardService.ts
import prisma from '../../lib/prisma';
import { BoardVO } from '../../models/board/BoardVO';
import {cms_board_data, Prisma} from "@prisma/client";

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
        const whereCondition: Prisma.cms_board_dataWhereInput = {
            is_use: true
        };

        const orderByOption: Prisma.cms_board_dataOrderByWithRelationInput = {
            idx: Prisma.SortOrder.desc
        };

        // 전체 개수와 페이지 데이터를 병렬로 조회
        const [total, boards] = await Promise.all([
            prisma.cms_board_data.count({
                where: whereCondition
            }),
            prisma.cms_board_data.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: orderByOption
            })
        ]) as [number, cms_board_data[]];


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

            const board = await prisma.cms_board_data.findUnique({
                where: {
                    idx: boardIdx
                }
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

    async saveBoardOne (boardData : BoardVO) {
        try {

            const boardKey = 'notice'

            const result = await prisma.cms_board_data.create({
                data: {
                    board_key: boardKey,
                    writer_key: boardData.writerKey,
                    writer: boardData.writer,
                    title: boardData.title,
                    content_text: boardData.contentText,
                    is_use: true,
                    create_date: new Date(),
                    pidx: 0n, // BigInt 값은 뒤에 n을 붙여야 함
                    gid: 0n,
                    depth: 0,
                    is_all_target: false,
                    is_notice: false,
                    is_secret: false,
                    is_temp: false,
                    order_main: 0n,
                    order_num: 0n
                }
            }) as cms_board_data;

            return this.mapToVO(result);

        } catch (error) {
            console.error(`게시물 저장 오류`, error);
            throw error;
        }
    }

    private mapToVO(data: any): BoardVO {
        // Prisma에서 받은 snake_case 필드를 BoardVO의 camelCase로 매핑
        return new BoardVO(
            Number(data.idx),
            data.board_key || '',
            data.writer_key || '',
            data.writer || '',
            data.title || '',
            data.content_text,
            Boolean(data.is_use),
            data.create_date
        );
    }
}