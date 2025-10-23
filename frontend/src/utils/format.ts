/**
 * 포맷팅 유틸리티 함수
 */

/**
 * 텍스트를 지정된 길이로 자르기
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * 타임스탬프를 읽기 쉬운 날짜로 포맷
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * 이모지 문자열 검증
 */
export function isEmoji(text: string): boolean {
  const emojiRegex = /\p{Emoji}/u;
  return emojiRegex.test(text);
}






