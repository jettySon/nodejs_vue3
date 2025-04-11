// src/store/boardStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import {API_ENDPOINTS} from "../config/api.ts";

interface BoardItem {
    idx: number
    boardKey: string
    writerKey: string
    writer: string
    title: string
    contentText: string | null
    isUse: boolean
    createDate?: Date
}

interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

interface BoardState {
    boardItems: BoardItem[]
    currentBoard: BoardItem | null
    loading: boolean
    error: string | null
    meta: PaginationMeta
}

export const useBoardStore = defineStore('board', {
    state: (): BoardState => ({
        boardItems: [],
        currentBoard: null,
        loading: false,
        error: null,
        meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        }
    }),

    actions: {
        async fetchBoards(page = 1, limit = 4) {
            this.loading = true
            this.error = null

            try {
                const response = await axios.get(API_ENDPOINTS.BOARD, {
                    params: { page, limit }
                })

                this.boardItems = response.data.data
                this.meta = response.data.meta
            } catch (error) {
                this.error = error instanceof Error ? error.message : '게시글 목록을 불러오는데 실패했습니다'
                console.error('Error fetching boards:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchBoardOne(idx: number) {
            this.loading = true
            this.error = null
            try {
                const response = await axios.get(`${API_ENDPOINTS.BOARD}/${idx}`);

                if (response.data) {
                    this.currentBoard = response.data;
                    return response.data;
                } else {
                    console.error('게시물 데이터가 없습니다.');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다'
                console.error('Error fetching board:', error)
            } finally {
                this.loading = false
            }
        },

        async createBoard(boardData: {
            writer: string;
            writerKey: string;
            title: string;
            contentText: string;
        }) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.post(API_ENDPOINTS.BOARD, boardData);
                return response.data.data;
            } catch (error) {
                this.error = error instanceof Error ? error.message : '게시글 저장에 실패했습니다';
                console.error('Error saving board:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
})