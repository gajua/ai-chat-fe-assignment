import { Character } from '@/types';

/**
 * 캐릭터 목록 컴포넌트
 * 사용 가능한 AI 캐릭터들을 그리드로 표시
 */
interface CharacterListProps {
  characters: Character[];
  onSelect: (characterId: string) => void;
}

export function CharacterList({ characters, onSelect }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="p-12 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">아직 캐릭터가 없습니다. 새로운 캐릭터를 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <button
          key={character.id}
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-150 text-center hover:border-primary hover:-translate-y-1 hover:shadow-md"
          onClick={() => onSelect(character.id)}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 overflow-hidden">
            {character.thumbnail ? (
              <img 
                src={character.thumbnail} 
                alt={character.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-2xl font-bold">
                {character.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
              {character.name}
            </h3>
            {character.isDefault && (
              <span className="inline-block px-2 py-0.5 text-xs bg-primary-light text-white rounded-sm mb-2">
                기본
              </span>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mt-2">
              {character.prompt.substring(0, 80)}...
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
