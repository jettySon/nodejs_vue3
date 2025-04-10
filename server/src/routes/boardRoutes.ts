// src/routes/boardRoutes.ts
import { Router } from 'express';
import BoardController from '../controllers/board/BoardController';

const router = Router();
const boardController = new BoardController();

// 게시글 목록 조회
router.get('/', boardController.getBoards);

// 특정 게시글 조회
router.get('/:id', boardController.getBoardOne);

// 게시글 생성
router.post('/', boardController.setBoardOne);

export default router;