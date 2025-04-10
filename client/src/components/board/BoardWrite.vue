<script setup lang="ts">

// Form data
import {ref} from "vue";
import router from "../../router";
import {useBoardStore} from "../../store/boardStore.ts";
const boardStore = useBoardStore()


const title = ref('')
const content = ref('')
const writer = ref('')

// Form validation state
const titleError = ref('')
const writerError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

// Validate form fields
function validateForm(): boolean {
    // Reset previous validation errors
    titleError.value = ''
    writerError.value = ''
    submitError.value = ''

    let isValid = true

    if (!title.value.trim()) {
        titleError.value = '제목을 입력해주세요.'
        isValid = false
    } else if (title.value.length > 100) {
        titleError.value = '제목은 100자 이내로 입력해주세요.'
        isValid = false
    }

    if (!writer.value.trim()) {
        writerError.value = '작성자명을 입력해주세요.'
        isValid = false
    } else if (writer.value.length > 20) {
        writerError.value = '작성자명은 20자 이내로 입력해주세요.'
        isValid = false
    }

    return isValid
}


async function submitForm() {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true
    submitError.value = ''

    try {
        // API 호출하여 게시글 저장
        await boardStore.createBoard({
            writer: writer.value,
            writerKey: 'anonymous', // 익명 사용자의 경우 기본값
            title: title.value,
            contentText: content.value
        })

        // 성공 시 게시판 목록으로 이동
        router.push('/board')
    } catch (error) {
        // 오류 처리
        console.error('게시글 저장 오류:', error)
        submitError.value = error instanceof Error
            ? error.message
            : '게시글 저장 중 오류가 발생했습니다.'
    } finally {
        isSubmitting.value = false
    }
}
function cancel() {
    router.push('/board')
}


</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-lg-8 offset-lg-2">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>게시글 작성</h2>
                    <button class="btn btn-secondary" @click="cancel">
                        취소
                    </button>
                </div>

                <!-- Form error message -->
                <div v-if="submitError" class="alert alert-danger" role="alert">
                    {{ submitError }}
                </div>

                <!-- Board write form -->
                <form @submit.prevent="submitForm" class="card">
                    <div class="card-body">
                        <!-- Writer field -->
                        <div class="mb-3">
                            <label for="writer" class="form-label">작성자 <span class="text-danger">*</span></label>
                            <input
                                    type="text"
                                    class="form-control"
                                    id="writer"
                                    v-model="writer"
                                    :class="{ 'is-invalid': writerError }"
                                    placeholder="작성자명을 입력하세요"
                                    maxlength="20"
                            />
                            <div v-if="writerError" class="invalid-feedback">
                                {{ writerError }}
                            </div>
                        </div>

                        <!-- Title field -->
                        <div class="mb-3">
                            <label for="title" class="form-label">제목 <span class="text-danger">*</span></label>
                            <input
                                    type="text"
                                    class="form-control"
                                    id="title"
                                    v-model="title"
                                    :class="{ 'is-invalid': titleError }"
                                    placeholder="제목을 입력하세요"
                                    maxlength="100"
                            />
                            <div v-if="titleError" class="invalid-feedback">
                                {{ titleError }}
                            </div>
                        </div>

                        <!-- Content field -->
                        <div class="mb-3">
                            <label for="content" class="form-label">내용</label>
                            <textarea
                                    class="form-control"
                                    id="content"
                                    v-model="content"
                                    rows="10"
                                    placeholder="내용을 입력하세요"
                            ></textarea>
                        </div>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" @click="cancel">
                            취소
                        </button>
                        <button
                                type="submit"
                                class="btn btn-primary"
                                :disabled="isSubmitting"
                        >
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Responsive styles */
@media (max-width: 768px) {
    .card-footer {
        flex-direction: column-reverse;
        gap: 0.5rem;
    }

    .card-footer .btn {
        width: 100%;
    }

    textarea {
        min-height: 150px;
    }
}

/* Fix iOS input styles */
input, textarea {
    appearance: none;
    -webkit-appearance: none;
    border-radius: 0.375rem;
}

/* Required field marker */
.form-label span.text-danger {
    font-weight: bold;
}

/* Card animation */
.card {
    transition: all 0.2s ease;
}

.card:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>