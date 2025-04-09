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

/**
 * 특정 게시물 조회 (쿼리 파라미터 사용)
 * GET /api/boards/one?idx=1
 */
router.get('/one/:idx', boardController.getBoardOne);

export default router;