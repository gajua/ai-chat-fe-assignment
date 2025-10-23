import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useDarkMode } from '@/hooks/use-dark-mode';

/**
 * 헤더 컴포넌트
 * 앱 네비게이션 및 사용자 컨트롤 표시
 */
interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-[64px] py-3">
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <button
                onClick={() => navigate('/')}
                className="text-sm text-primary hover:text-primary-hover dark:text-primary-light font-medium transition-colors p-2"
                aria-label="뒤로 가기"
              >
                ← 돌아가기
              </button>
            ) : (
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                🤖 AI 채팅
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 다크모드 토글 버튼 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="다크모드 토글"
              title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? (
                <span className="text-xl">☀️</span>
              ) : (
                <span className="text-xl">🌙</span>
              )}
            </button>
            
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300 font-medium">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
