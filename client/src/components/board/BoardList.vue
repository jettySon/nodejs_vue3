<!-- src/components/board/BoardList.vue -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useBoardStore } from '../../store/boardStore'
import { formatDate } from '../../utils/dateUtils'
import router from "../../router";

const boardStore = useBoardStore()
const currentPage = ref(1)

// Load boards on component mount
onMounted(() => {
    loadBoards()
})

// Watch for page changes and reload boards
watch(currentPage, () => {
    loadBoards()
})

// Computed properties
const boards = computed(() => boardStore.boardItems)
const loading = computed(() => boardStore.loading)
const error = computed(() => boardStore.error)
const meta = computed(() => boardStore.meta)

// Calculate pagination range
const paginationRange = computed(() => {
    const totalPages = meta.value.totalPages
    const current = currentPage.value
    const delta = 2 // Pages to show on each side

    let start = Math.max(1, current - delta)
    let end = Math.min(totalPages, current + delta)

    // Adjust if we're at the beginning or end
    if (start === 1) {
        end = Math.min(totalPages, 1 + 2 * delta)
    }
    if (end === totalPages) {
        start = Math.max(1, totalPages - 2 * delta)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Functions
function loadBoards() {
    boardStore.fetchBoards(currentPage.value)
}

function changePage(page: number) {
    if (page < 1 || page > meta.value.totalPages) return
    currentPage.value = page
}

function formatBoardDate(date: Date | string | undefined) {
    if (!date) return ''
    return formatDate(new Date(date))
}

function goDetail(idx: number) {
    router.push(`/board/${idx}`)
}
</script>

<template>
    <div class="container mt-5">
        <div class="row mb-4">
            <div class="col">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>게시글</h2>
                    <a href="/board/write" class="btn btn-secondary">작성하기</a>
                </div>

                <!-- Loading indicator -->
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">로딩 중...</span>
                    </div>
                </div>

                <!-- Error message -->
                <div v-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>

                <!-- Board table for desktop -->
                <div v-if="!loading && !error" class="board-container">
                    <!-- Desktop view - table -->
                    <div class="card d-none d-md-block">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                    <tr>
                                        <th width="10%" class="text-center">번호</th>
                                        <th width="50%">제목</th>
                                        <th width="15%" class="text-center">작성자</th>
                                        <th width="15%" class="text-center">작성일</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-if="boards.length === 0">
                                        <td colspan="4" class="text-center py-4">게시글이 없습니다.</td>
                                    </tr>
                                    <tr v-for="board in boards" :key="board.boardKey" class="clickable-row">
                                        <td class="text-center">{{ board.idx }}</td>
                                        <td @click="goDetail(board.idx)">{{ board.title }}</td>
                                        <td class="text-center">{{ board.writer }}</td>
                                        <td class="text-center">{{ formatBoardDate(board.createDate) }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile view - cards -->
                    <div class="d-md-none">
                        <div v-if="boards.length === 0" class="text-center py-4 bg-light rounded">
                            게시글이 없습니다.
                        </div>
                        <div v-for="board in boards" :key="board.boardKey" class="card mb-3 clickable-row">
                            <div class="card-body">
                                <h5 class="card-title">{{ board.title }}</h5>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                    <span class="badge bg-primary">{{ board.idx }}</span>
                                    <div class="text-muted small">
                                        <span class="me-2">{{ board.writer }}</span>
                                        <span>{{ formatBoardDate(board.createDate) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <nav aria-label="Page navigation" class="mt-4" v-if="meta.totalPages > 1">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                                    이전
                                </a>
                            </li>

                            <li v-for="page in paginationRange" :key="page" class="page-item" :class="{ active: page === currentPage }">
                                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                            </li>

                            <li class="page-item" :class="{ disabled: currentPage >= meta.totalPages }">
                                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                                    다음
                                </a>
                            </li>
                        </ul>

                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.clickable-row {
    cursor: pointer;
}
.clickable-row:hover {
    background-color: rgba(0, 0, 0, 0.03);
}
</style>