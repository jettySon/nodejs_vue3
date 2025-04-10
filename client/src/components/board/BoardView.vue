<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBoardStore } from "../../store/boardStore.ts";
import { formatDate } from "../../utils/dateUtils.ts";

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();

// Computed properties
const board = computed(() => boardStore.currentBoard);
const loading = computed(() => boardStore.loading);
const error = computed(() => boardStore.error);

onMounted(async () => {
    // Get idx from route parameters
    const idx = Number(route.params.idx);

    // Validate idx
    if (isNaN(idx)) {
        router.push('/board'); // Redirect to board list if idx is invalid
        return;
    }

    // Fetch board data
    await boardStore.fetchBoardOne(idx);
});

function goList() {
    router.push('/board');
}
</script>

<template>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>게시글 상세</h2>
            <button class="btn btn-secondary" @click="goList">목록으로</button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">로딩 중...</span>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
            <button class="btn btn-link" @click="goList">게시판으로 돌아가기</button>
        </div>

        <!-- Content when loaded -->
        <div v-else-if="board" class="card">
            <div class="card-header bg-light">
                <h3 class="card-title mb-0">{{ board.title }}</h3>
            </div>

            <div class="card-body">
                <div class="mb-4 text-muted d-flex justify-content-between">
                    <span>
                        <strong>작성자:</strong> {{ board.writer }}
                    </span>
                    <span>
                        <strong>작성일:</strong> {{ formatDate(new Date(board.createDate || new Date())) }}
                    </span>
                </div>

                <div class="board-content border-top pt-4">
                    <p v-if="board.contentText">{{ board.contentText }}</p>
                    <p v-else class="text-muted">내용이 없습니다.</p>
                </div>
            </div>

            <div class="card-footer text-end">
                <button class="btn btn-secondary" @click="goList">목록으로</button>
            </div>
        </div>

        <!-- No board found -->
        <div v-else class="alert alert-warning" role="alert">
            게시글을 찾을 수 없습니다.
            <button class="btn btn-link" @click="goList">게시판으로 돌아가기</button>
        </div>
    </div>
</template>

<style scoped>
.board-content {
    min-height: 200px;
}

@media (max-width: 768px) {
    .card-header h3 {
        font-size: 1.5rem;
    }

    .text-muted {
        flex-direction: column;
    }
}
</style>