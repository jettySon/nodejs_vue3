
// API 서버의 기본 URL
// 실제 환경에서는 환경 변수(.env 파일)로 관리하는 것이 좋습니다
export const API_HOST = 'http://localhost:3000';

// API의 기본 경로
export const API_BASE_PATH = '/api';

// 전체 API 기본 URL
export const API_BASE_URL = `${API_HOST}${API_BASE_PATH}`;

// 리소스별 엔드포인트
export const API_ENDPOINTS = {
    BOARD: `${API_BASE_URL}/board`,
    USER: `${API_BASE_URL}/user`,
    // 향후 더 많은 엔드포인트를 추가할 수 있습니다
};