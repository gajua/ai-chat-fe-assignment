import { useState, useEffect } from 'react';

/**
 * 로컬 스토리지 Hook
 * localStorage와 상태 동기화
 * 
 * @param key - localStorage 키
 * @param initialValue - 키가 없을 때 초기값
 * @returns [저장된값, 값설정함수]
 * 
 * TODO: BroadcastChannel API를 사용한 탭 동기화 구현
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 로컬 스토리지에서 가져오고 JSON 파싱 또는 초기값 반환
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // localStorage에 새 값을 저장하는 래퍼 함수 반환
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // useState와 동일한 API를 위해 함수 허용
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}






