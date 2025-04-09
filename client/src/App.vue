<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
    <header class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <RouterLink class="navbar-brand" to="/">게시판 앱</RouterLink>
            <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">홈</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/board">게시판</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </header>

    <main>
        <RouterView />
    </main>

    <footer class="footer mt-auto py-3 bg-light">
        <div class="container text-center">
            <span class="text-muted">© 2025 게시판 애플리케이션</span>
        </div>
    </footer>
</template>

<style>
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
}

.footer {
    margin-top: 2rem;
    padding-bottom: env(safe-area-inset-bottom);
}

@media (max-width: 767.98px) {
    .container {
        padding-left: 15px;
        padding-right: 15px;
    }

    .navbar-brand {
        font-size: 1.15rem;
    }
}

/* Fix for iOS Safari bottom bar */
@supports (padding: max(0px)) {
    .footer {
        padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
    }
}
</style>