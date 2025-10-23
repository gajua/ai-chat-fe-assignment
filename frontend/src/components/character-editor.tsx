import { useState, FormEvent, useRef } from 'react';
import { useCharacterStore } from '@/store/character-store';
import { validateImageFile, resizeImage } from '@/utils/image-utils';

/**
 * 캐릭터 에디터 컴포넌트
 * 사용자가 새로운 AI 캐릭터를 생성할 수 있게 함
 */
export function CharacterEditor() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createCharacter, isLoading, error } = useCharacterStore();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || '이미지 업로드 실패');
      return;
    }

    try {
      // 이미지 리사이징 및 Base64 변환
      const resizedBase64 = await resizeImage(file, 200, 200);
      setThumbnail(resizedBase64);
      setThumbnailPreview(resizedBase64);
    } catch (error) {
      setUploadError('이미지 처리 중 오류가 발생했습니다.');
      console.error('Image processing error:', error);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !prompt) {
      return;
    }

    try {
      await createCharacter({
        name,
        prompt,
        thumbnail: thumbnail || undefined,
      });

      // 폼 초기화
      setName('');
      setPrompt('');
      setThumbnail('');
      setThumbnailPreview('');
      setUploadError('');
      setIsExpanded(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return (
    <div className="card fade-in">
      {!isExpanded ? (
        <button
          className="btn btn-primary w-full py-4 text-base"
          onClick={() => setIsExpanded(true)}
        >
          + 새 캐릭터 만들기
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              캐릭터 이름 *
            </label>
            <input
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 친절한 선생님"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              썸네일 이미지 (선택)
            </label>
            
            {/* 이미지 미리보기 */}
            {thumbnailPreview && (
              <div className="mb-4 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img 
                    src={thumbnailPreview} 
                    alt="미리보기" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* 이미지 업로드 */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                required
                className="block w-full text-sm text-gray-600 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary file:text-white
                  file:cursor-pointer
                  hover:file:bg-primary-hover
                  transition-colors"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                지원 형식: JPEG, PNG, GIF, WebP (최대 2MB, 자동 리사이징 200x200)
              </p>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                ⚠️ {uploadError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              시스템 프롬프트 *
            </label>
            <textarea
              id="prompt"
              className="input resize-y min-h-[150px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="이 캐릭터가 어떻게 행동하고 대화해야 하는지 설명해주세요..."
              required
              minLength={10}
              maxLength={2000}
              rows={6}
            />
            <span className="block text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {prompt.length} / 2000
            </span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              className="btn btn-secondary sm:min-w-[120px]"
              onClick={() => {
                setIsExpanded(false);
                setName('');
                setPrompt('');
                setThumbnail('');
                setThumbnailPreview('');
                setUploadError('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary sm:min-w-[120px]"
              disabled={isLoading || !name || !prompt}
            >
              {isLoading ? '생성 중...' : '캐릭터 생성'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
