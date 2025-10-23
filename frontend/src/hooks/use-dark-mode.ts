import { useEffect, useState } from 'react';

/**
 * 다크모드 Hook
 * 로컬스토리지와 시스템 설정을 고려한 다크모드 관리
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 로컬스토리지에서 저장된 값 확인
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    
    // 저장된 값이 없으면 시스템 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 로컬스토리지에 저장
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleDarkMode };
}




