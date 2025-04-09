// src/controllers/BoardController.ts
import { Request, Response } from 'express';
import BoardService from '../../service/board/BoardService';

export default class BoardController {
    private boardService: BoardService;

    constructor() {
        this.boardService = new BoardService();
    }

    getBoards = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string || '1', 10);
            const limit = parseInt(req.query.limit as string || '10', 10);

            const result = await this.boardService.getAllBoards(page, limit);
            res.json(result);
        } catch (error) {
            console.error('게시글 목록 조회 오류:', error);
            res.status(500).json({error: '서버 내부 오류가 발생했습니다'});
        }
    }


    getBoardOne = async (req: Request, res: Response): Promise<void> => {
        try {
            // 경로 매개변수에서 idx 가져오기 (req.query 대신 req.params 사용)
            const idxParam = req.params.idx;

            // idx가 존재하는지 확인
            if (!idxParam) {
                res.status(400).json({ error: '게시물 번호(idx)가 필요합니다.' });
                return;
            }

            // 숫자로 변환
            const idx = Number(idxParam);

            // 변환이 유효한지 확인
            if (isNaN(idx)) {
                res.status(400).json({ error: '유효하지 않은 게시물 번호입니다.' });
                return;
            }

            const result = await this.boardService.getBoardOne(idx);

            // 게시물이 없는 경우
            if (result === null) {
                res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
                return;
            }

            // 클라이언트의 기대 형식에 맞게 응답
            res.json({ data: result });
        } catch (error) {
            console.error('게시글 상세 조회 오류:', error);
            res.status(500).json({ error: '서버 내부 오류가 발생했습니다' });
        }
    }
}