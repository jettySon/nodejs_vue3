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
}