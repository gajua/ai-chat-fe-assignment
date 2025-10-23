import OpenAI from 'openai';
import { OpenAIMessage } from '../types';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 설정값
const MODEL = 'gpt-3.5-turbo'; // 비용 효율성을 위해 GPT-3.5-turbo 사용
const MAX_TOKENS = 400; // 응답 최대 길이 (입력 200자 기준, 충분한 응답 길이)
const TEMPERATURE = 0.7;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초

/**
 * OpenAI API로부터 AI 응답 받기
 * 
 * @param systemPrompt - 캐릭터의 시스템 프롬프트
 * @param userMessage - 사용자의 현재 메시지
 * @param conversationHistory - 컨텍스트를 위한 이전 메시지들
 * @returns AI가 생성한 응답
 */
export async function getAIResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  // API 키 검증
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  // 메시지 배열 구성
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    // 컨텍스트를 위한 대화 기록 추가
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ];

  // 재시도 로직 구현
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      return response.trim();
    } catch (error) {
      lastError = error as Error;
      console.error(`OpenAI API error (attempt ${attempt}/${MAX_RETRIES}):`, error);

      // 특정 에러는 재시도하지 않음
      if (error instanceof Error) {
        // 잘못된 API 키 또는 인증 에러
        if (error.message.includes('Incorrect API key') || 
            error.message.includes('authentication')) {
          throw new Error('OpenAI API authentication failed. Please check your API key.');
        }

        // Rate limit 에러
        if (error.message.includes('Rate limit')) {
          if (attempt < MAX_RETRIES) {
            // 재시도 전 대기 (지수 백오프)
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
            continue;
          }
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
      }

      // 네트워크 에러나 일시적 장애 시 재시도
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        continue;
      }
    }
  }

  // 모든 재시도 실패
  throw new Error(
    `Failed to get AI response after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * OpenAI API가 올바르게 설정되었는지 확인
 */
export function validateOpenAIConfig(): { valid: boolean; error?: string } {
  if (!process.env.OPENAI_API_KEY) {
    return {
      valid: false,
      error: 'OPENAI_API_KEY environment variable is not set',
    };
  }

  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    return {
      valid: false,
      error: 'OPENAI_API_KEY appears to be invalid (should start with "sk-")',
    };
  }

  return { valid: true };
}






