// /src/routes/boardRoutes.ts

import {Router, Request, Response} from 'express';
import pool from '../config/database'
import {Board} from '../models/board/board';

const router = Router();

/**
 * 전체 게시글 조회
 * GET /api/boards
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                    idx, board_key as boardKey, writer_key as writerKey,
                    writer, title, content_text as contentText, is_use as isUse 
                FROM cms_board_data`
        );
        res.json(rows);
    } catch (error) {
        console.error('GET /api/boards error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
