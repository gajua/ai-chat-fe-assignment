import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 메시지 목록 컴포넌트
 * 채팅 메시지를 자동 스크롤과 함께 표시
 */
interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 메시지 변경 시 하단으로 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-6xl opacity-50 mb-4">💬</div>
        <p className="text-gray-600 dark:text-gray-400">대화를 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin max-h-[600px] md:max-h-[800px]" 
      ref={containerRef}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col fade-in ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-lg break-words ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
              }`}
            >
              <p className="leading-relaxed">{message.content}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start fade-in">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg rounded-bl-sm">
              <div className="flex gap-1">
                <span className="loading-dot text-primary">●</span>
                <span className="loading-dot text-primary">●</span>
                <span className="loading-dot text-primary">●</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
