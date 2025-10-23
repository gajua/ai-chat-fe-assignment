# 🤖 AI 사용 가이드

이 문서는 프로젝트에서 OpenAI API를 어떻게 사용하는지 설명합니다.

## 📋 목차

- [사용하는 AI 모델](#사용하는-ai-모델)
- [프롬프트 전략](#프롬프트-전략)
- [API 호출 로직](#api-호출-로직)
- [에러 처리 및 재시도](#에러-처리-및-재시도)
- [보안 조치](#보안-조치)
- [비용 최적화](#비용-최적화)

## 🎯 사용하는 AI 모델

### GPT-3.5-Turbo

현재 프로젝트는 **GPT-3.5-Turbo** 모델을 사용합니다.

**선택 이유:**
- ✅ **비용 효율성**: GPT-4 대비 10배 이상 저렴
- ✅ **빠른 응답 속도**: 실시간 채팅에 적합한 레이턴시
- ✅ **충분한 성능**: 일반적인 대화 시나리오에 적합
- ✅ **안정성**: 프로덕션 환경에서 검증된 모델

**모델 구성:**
```typescript
const MODEL = 'gpt-3.5-turbo';
const MAX_TOKENS = 400;      // 응답 최대 길이 (한글 약 200)
const TEMPERATURE = 0.7;     // 창의성 수준 (0-1)
```

**설정 값 설명:**
- `MAX_TOKENS`: 400 토큰으로 설정하여 적절한 길이의 응답 생성 (한글 기준 약 200자)
- `TEMPERATURE`: 0.7로 설정하여 창의적이지만 예측 가능한 응답 생성

## 💬 프롬프트 전략

### 시스템 프롬프트

각 AI 캐릭터는 고유한 **시스템 프롬프트**를 가집니다. 이는 캐릭터의 성격, 말투, 행동 방식을 정의합니다.

**기본 캐릭터 예시:**

```typescript
// 1. 친근한 친구
{
  name: "친근한 친구",
  prompt: "당신은 친근하고 다정한 친구입니다. 사용자의 이야기를 경청하고 공감하며, 따뜻한 조언을 제공합니다. 항상 따뜻하고 친근한 톤으로 대화해주세요."
}

// 2. 전문 상담가
{
  name: "전문 상담가",
  prompt: "당신은 경험이 풍부한 심리 상담가입니다. 사용자의 고민을 깊이 있게 분석하고, 전문적이고 체계적인 조언을 제공합니다. 항상 객관적이고 신중한 태도를 유지하세요."
}

// 3. 유쾌한 코미디언
{
  name: "유쾌한 코미디언",
  prompt: "당신은 유머 감각이 뛰어난 코미디언입니다. 사용자의 기분을 밝게 만들고, 재치있는 농담과 유머로 대화를 즐겁게 이끌어갑니다. 긍정적이고 밝은 에너지를 전달하세요."
}
```

### 대화 컨텍스트 관리

효과적인 대화를 위해 **대화 기록**을 컨텍스트로 제공합니다.

**구현 방식:**
```typescript
const messages: OpenAIMessage[] = [
  {
    role: 'system',
    content: character.prompt  // 캐릭터 시스템 프롬프트
  },
  // 최근 9개의 이전 대화 (컨텍스트 제공)
  ...previousMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  })),
  {
    role: 'user',
    content: userMessage  // 현재 사용자 메시지
  }
];
```

**컨텍스트 제한:**
- 최근 **10개의 메시지**만 컨텍스트로 사용 (시스템 프롬프트 + 9개 이전 대화)
- 토큰 비용 절감과 응답 품질의 균형
- 너무 오래된 대화는 제외하여 관련성 유지

## 🔄 API 호출 로직

### 호출 흐름

```
1. 사용자 메시지 수신
   ↓
2. 데이터베이스에 사용자 메시지 저장
   ↓
3. 최근 대화 기록 조회 (9개)
   ↓
4. OpenAI API 호출
   - System Prompt 추가
   - 대화 기록 추가
   - 사용자 메시지 추가
   ↓
5. AI 응답 수신
   ↓
6. 데이터베이스에 AI 응답 저장
   ↓
7. 클라이언트에 두 메시지 모두 반환
```

### 코드 구현

**파일 위치**: `backend/src/services/openai-service.ts`

```typescript
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
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  // OpenAI API 호출 (재시도 로직 포함)
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  });

  // 응답 추출 및 반환
  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('Empty response from OpenAI');
  }

  return response.trim();
}
```

## 🛡️ 에러 처리 및 재시도

### 재시도 전략

OpenAI API는 일시적인 장애나 Rate Limit 오류가 발생할 수 있습니다. 이를 대비한 재시도 로직을 구현했습니다.

**설정:**
```typescript
const MAX_RETRIES = 3;        // 최대 재시도 횟수
const RETRY_DELAY = 1000;     // 기본 재시도 지연 (1초)
```

**재시도 로직:**
```typescript
for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    // API 호출 시도
    const completion = await openai.chat.completions.create({...});
    return completion.choices[0]?.message?.content?.trim();
  } catch (error) {
    // 에러 분석 및 처리
    if (error.message.includes('authentication')) {
      // 인증 오류: 재시도 불가
      throw new Error('OpenAI API authentication failed');
    }

    if (error.message.includes('Rate limit')) {
      // Rate Limit: 지연 후 재시도
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt); // 지수 백오프
        continue;
      }
      throw new Error('OpenAI API rate limit exceeded');
    }

    // 네트워크 오류: 재시도
    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY);
      continue;
    }
  }
}

throw new Error(`Failed after ${MAX_RETRIES} attempts`);
```

### 에러 타입별 처리

| 에러 타입 | 처리 방법 | 재시도 |
|----------|----------|-------|
| 인증 오류 (401) | 즉시 실패, 사용자에게 설정 확인 요청 | ❌ |
| Rate Limit (429) | 지수 백오프로 재시도 | ✅ |
| 네트워크 오류 | 1초 후 재시도 | ✅ |
| 빈 응답 | 에러로 처리, 재시도 | ✅ |
| 타임아웃 | 재시도 | ✅ |

### 사용자 친화적 에러 메시지

```typescript
// Backend에서 명확한 에러 메시지 반환
catch (error) {
  if (error.message.includes('authentication')) {
    return res.status(500).json({
      error: 'OpenAI API 인증에 실패했습니다. API 키를 확인해주세요.'
    });
  }
  
  if (error.message.includes('Rate limit')) {
    return res.status(429).json({
      error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
    });
  }
  
  return res.status(500).json({
    error: 'AI 응답 생성에 실패했습니다. 다시 시도해주세요.'
  });
}
```

## 🔒 보안 조치

### API 키 보호

**핵심 원칙: API 키는 절대 프론트엔드에 노출되지 않습니다.**

#### 1. 환경 변수 관리

```bash
# Backend .env (서버 측)
OPENAI_API_KEY=sk-your-actual-api-key

# .gitignore에 추가되어 Git에 커밋되지 않음
.env
*.env
!.env.example
```

#### 2. 서버 사이드 호출

```typescript
// ✅ 올바른 방법: Backend에서만 API 호출
// backend/src/services/openai-service.ts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // 서버 환경 변수
});

// ❌ 잘못된 방법: Frontend에서 직접 호출하지 않음
// Frontend는 Backend API를 통해서만 AI 응답 요청
```

#### 3. API 엔드포인트 인증

모든 AI 관련 엔드포인트는 **JWT 인증**이 필요합니다:

```typescript
// 인증 미들웨어 적용
router.post('/messages', authenticate, sendMessage);

// 인증되지 않은 요청은 401 반환
if (!token) {
  return res.status(401).json({ error: 'Authentication required' });
}
```

### 입력 검증

사용자 입력을 Zod 스키마로 검증:

```typescript
const sendMessageSchema = z.object({
  content: z.string()
    .min(1, '메시지를 입력해주세요')
    .max(200, '메시지는 200자를 초과할 수 없습니다'),
  characterId: z.string().uuid('올바른 캐릭터 ID가 아닙니다')
});
```

## 💰 비용 최적화

### 토큰 사용 최적화

**전략:**

1. **응답 길이 제한**
   - `max_tokens: 600` 설정으로 적절한 응답 길이 유지

2. **컨텍스트 제한**
   - 최근 10개 메시지만 포함
   - 평균 토큰 수: ~1,000 tokens per request

3. **모델 선택**
   - GPT-3.5-Turbo 사용으로 비용 절감
   - GPT-4 대비 약 10배 저렴

### 예상 비용 (2025년 1월 기준)

**GPT-3.5-Turbo 가격:**
- Input: $0.0005 / 1K tokens
- Output: $0.0015 / 1K tokens

**예상 시나리오:**
```
요청당 평균 토큰:
- Input: ~800 tokens (system + history + user message)
- Output: ~150 tokens (AI response)

요청당 비용:
- Input: 800 * $0.0005 / 1000 = $0.0004
- Output: 150 * $0.0015 / 1000 = $0.000225
- 총: ~$0.000625 per request

1,000개 요청: ~$0.625
10,000개 요청: ~$6.25
```

### 추가 최적화 방안

**구현 가능한 개선사항:**

1. **응답 캐싱**
   ```typescript
   // 동일한 질문에 대한 캐싱 (TODO)
   const cacheKey = `${characterId}:${hash(userMessage)}`;
   const cached = await redis.get(cacheKey);
   if (cached) return cached;
   ```

2. **배치 처리**
   - 여러 요청을 모아서 처리 (해당되는 경우)

3. **스트리밍 응답** (TODO)
   ```typescript
   // 실시간 스트리밍으로 사용자 경험 개선
   const stream = await openai.chat.completions.create({
     model: MODEL,
     messages,
     stream: true,
   });
   ```

## 📊 모니터링 및 로깅

### 로깅 전략

모든 AI 호출은 로깅됩니다:

```typescript
console.log('OpenAI API call:', {
  characterId,
  userMessageLength: userMessage.length,
  historyLength: conversationHistory.length,
  timestamp: new Date().toISOString()
});
```

### 에러 추적

```typescript
console.error('OpenAI API error:', {
  attempt,
  error: error.message,
  characterId,
  timestamp: new Date().toISOString()
});
```

## 🔮 향후 개선 사항

1. **스트리밍 응답**
   - 실시간으로 AI 응답 표시
   - 사용자 경험 개선

2. **응답 캐싱**
   - Redis를 사용한 캐싱 레이어
   - 동일한 질문에 대한 빠른 응답

3. **더 긴 컨텍스트**
   - 중요한 대화 요약 저장
   - 장기 기억 구현

4. **멀티모달 지원**
   - 이미지 입출력 지원
   - GPT-4 Vision 통합

5. **Fine-tuning**
   - 특정 사용 사례에 맞춘 모델 파인튜닝
   - 더 일관된 캐릭터 성격 구현

---

**더 자세한 프로젝트 정보는 [README.md](./README.md)를 참고하세요.**






