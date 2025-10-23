import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacterStore } from '@/store/character-store';
import { useChatStore } from '@/store/chat-store';
import { ChatWindow } from '@/components/chat-window';
import { Header } from '@/components/header';

/**
 * 채팅방 페이지 컴포넌트
 * 선택한 캐릭터와의 채팅 인터페이스 표시
 */
export default function ChatRoomPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const { characters, selectedCharacter, selectCharacter } = useCharacterStore();
  const { fetchMessages } = useChatStore();

  useEffect(() => {
    if (!characterId) {
      navigate('/', { replace: true });
      return;
    }

    // 캐릭터 찾기 및 선택
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      selectCharacter(character);
      fetchMessages(characterId);
    } else {
      // 캐릭터를 찾을 수 없으면 홈으로 리디렉션
      navigate('/', { replace: true });
    }
  }, [characterId, characters, selectCharacter, fetchMessages, navigate]);

  if (!characterId || !selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="loading text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header showBackButton />
      
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {selectedCharacter.thumbnail ? (
                <img 
                  src={selectedCharacter.thumbnail} 
                  alt={selectedCharacter.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedCharacter.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {selectedCharacter.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCharacter.prompt.substring(0, 100)}...
              </p>
            </div>
          </div>
        </div>

        <ChatWindow characterId={characterId} />
      </main>
    </div>
  );
}
