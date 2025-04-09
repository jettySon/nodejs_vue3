// src/routes/boardRoutes.ts
import { Router } from 'express';
import BoardController from '../controllers/board/BoardController';

const router = Router();
const boardController = new BoardController();

/**
 * 전체 게시글 조회
 * GET /api/boards
 */
router.get('/', boardController.getBoards);

export default router;