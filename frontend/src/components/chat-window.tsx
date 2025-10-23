import { useState, useEffect, useRef, FormEvent } from 'react';
import { useChatStore } from '@/store/chat-store';
import { MessageList } from './message-list';
import { MESSAGE_MAX_LENGTH } from '@/config/constants';

/**
 * 채팅 윈도우 컴포넌트
 * 메시지 표시 및 메시지 입력 처리
 */
interface ChatWindowProps {
  characterId: string;
}

export function ChatWindow({ characterId }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { messagesByCharacter, sendMessage, isLoading, error } = useChatStore();
  const messages = messagesByCharacter[characterId] || [];

  useEffect(() => {
    // 마운트 시 입력 필드에 포커스
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    // 입력창을 즉시 비우고 포커스 유지
    setMessage('');
    inputRef.current?.focus();

    try {
      // 메시지 전송 (스토어에서 즉시 UI 업데이트)
      await sendMessage(characterId, trimmedMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      // 에러는 스토어에서 처리됨
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      <MessageList messages={messages} isLoading={isLoading} />

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            className="input flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            maxLength={MESSAGE_MAX_LENGTH}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary min-w-[100px]"
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? '전송 중...' : '전송'}
          </button>
        </form>

        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.length} / {MESSAGE_MAX_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
