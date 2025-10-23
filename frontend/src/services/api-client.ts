import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/constants';

/**
 * 기본 설정이 적용된 Axios 인스턴스
 * 인증, 에러 처리, CORS 처리
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 요청과 함께 쿠키 전송
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

/**
 * 에러 처리를 위한 응답 인터셉터
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // 인증 에러 처리
    if (error.response?.status === 401) {
      // 인증되지 않은 경우 로그인 페이지로 리디렉션
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 사용자 친화적인 에러 메시지 생성
    let errorMessage = '요청 처리 중 오류가 발생했습니다.';

    if (error.response) {
      // 서버가 에러 응답을 반환한 경우
      const serverError = error.response.data?.error || error.response.data?.message;
      
      switch (error.response.status) {
        case 400:
          errorMessage = serverError || '잘못된 요청입니다.';
          break;
        case 401:
          errorMessage = '아이디 혹은 비밀번호가 일치하지 않습니다.';
          break;
        case 403:
          errorMessage = '권한이 없습니다.';
          break;
        case 404:
          errorMessage = '요청한 리소스를 찾을 수 없습니다.';
          break;
        case 429:
          errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 500:
          errorMessage = serverError || 'OpenAI API 키가 설정되지 않았거나 서버에 문제가 발생했습니다.';
          break;
        default:
          errorMessage = serverError || errorMessage;
      }
    } else if (error.request) {
      // 네트워크 에러
      errorMessage = '네트워크 연결을 확인해주세요.';
    }

    // 더 나은 UX를 위해 에러 메시지 오버라이드
    error.message = errorMessage;

    return Promise.reject(error);
  }
);

export default apiClient;



