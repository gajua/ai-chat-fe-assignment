/**
 * 이미지 처리 유틸리티 함수
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * 이미지 파일을 Base64로 변환
 * 
 * @param file - 이미지 파일
 * @returns Base64 인코딩된 문자열
 */
export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to Base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 파일 검증
 * 
 * @param file - 검증할 파일
 * @returns 검증 결과 { valid: boolean, error?: string }
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `이미지 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.`,
    };
  }

  // 파일 형식 검증
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: '지원하는 이미지 형식: JPEG, PNG, GIF, WebP',
    };
  }

  return { valid: true };
}

/**
 * 이미지 크기 조정 (리사이징)
 * 
 * @param file - 원본 이미지 파일
 * @param maxWidth - 최대 너비
 * @param maxHeight - 최대 높이
 * @returns 리사이즈된 Base64 이미지
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 비율 유지하며 크기 조정
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Base64로 변환
        const resizedBase64 = canvas.toDataURL(file.type);
        resolve(resizedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}


