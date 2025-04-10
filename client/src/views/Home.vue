<!-- src/views/Home.vue -->
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2 text-center">
                <h1 class="mb-4 responsive-heading">게시판 프로젝트</h1>
                <p class="lead">Vue 3 + TypeScript + Node.js + Prisma</p>
                <div class="mt-5">
                    <RouterLink to="/board" class="btn btn-primary btn-lg responsive-button">
                        게시판 보기
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.responsive-heading {
    font-size: calc(1.5rem + 1.5vw);
}

.responsive-button {
    width: 80%;
    max-width: 250px;
}

@media (max-width: 576px) {
    .container {
        padding-top: 2rem;
    }

    .responsive-button {
        width: 100%;
        padding: 0.75rem;
        font-size: 1.1rem;
    }
}
</style>