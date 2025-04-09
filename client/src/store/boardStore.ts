// src/store/boardStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'

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
                const response = await axios.get(`http://localhost:3000/api/boards`, {
                    params: {page, limit}
                })

                this.boardItems = response.data.data
                this.meta = response.data.meta
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to fetch boards'
                console.error('Error fetching boards:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchBoardOne(idx: number) {
            this.loading = true
            this.error = null
            try {
                const response = await axios.get(`http://localhost:3000/api/boards/one/${idx}`);

                if (response.data && response.data.data) {
                    this.currentBoard = response.data.data;
                    return response.data.data;
                } else {
                    throw new Error('게시물 데이터가 없습니다.');
                }

            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Failed to fetchBoardOne'
                console.error('Error fetching boards:', error)
            } finally {
                this.loading = false
            }
        }
    }
})