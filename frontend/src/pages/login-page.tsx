import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

/**
 * 로그인 페이지 컴포넌트
 * 사용자 인증 처리
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  const { login, isAuthenticated, isLoading, error, clearError, checkAuth } = useAuthStore();

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    checkAuthStatus();
  }, [checkAuth]);

  // 이미 인증된 경우 즉시 홈으로 리디렉션
  useEffect(() => {
    if (isAuthenticated && !isChecking) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isChecking, navigate]);

  // 컴포넌트 언마운트 시 에러 클리어
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // 인증 확인 중에는 로딩 화면 표시
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 dark:from-purple-900 dark:via-purple-950 dark:to-black">
        <div className="text-center text-white">
          <div className="loading text-4xl mb-4">⏳</div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }

    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (error) {
      // 에러는 스토어에서 처리
      console.error('Login failed:', error);
    }
  };

  // 이미 로그인된 경우 아무것도 표시하지 않음 (리디렉션 중)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 dark:from-purple-900 dark:via-purple-950 dark:to-black">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">🤖 AI 채팅</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI 캐릭터와 대화를 시작해보세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                사용자명
              </label>
              <input
                id="username"
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="demo"
                autoComplete="username"
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                autoComplete="current-password"
                required
                minLength={6}
                maxLength={100}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm text-center">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-base"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md leading-relaxed">
              <strong>테스트 계정:</strong><br />
              사용자명: demo<br />
              비밀번호: password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
