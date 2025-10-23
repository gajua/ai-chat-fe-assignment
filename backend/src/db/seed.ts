import { prisma } from './client';

/**
 * 데이터베이스 시드 스크립트
 * 기본 사용자 및 AI 캐릭터 생성
 */
async function seed() {
  console.log('🌱 데이터베이스 시드 시작...');

  try {
    // 기본 사용자 생성
    console.log('✅ 기본 사용자 생성 완료: demo / password123');

    // 기본 AI 캐릭터 3개 생성
    const characters = [
      {
        name: '친근한 친구',
        prompt: '당신은 친근하고 다정한 친구입니다. 사용자의 이야기를 경청하고 공감하며, 따뜻한 조언을 제공합니다. 항상 따뜻하고 친근한 톤으로 대화해주세요.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NjZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+8J+RqzwvdGV4dD48L3N2Zz4=',
        isDefault: true,
      },
      {
        name: '전문 상담가',
        prompt: '당신은 경험이 풍부한 심리 상담가입니다. 사용자의 고민을 깊이 있게 분석하고, 전문적이고 체계적인 조언을 제공합니다. 항상 객관적이고 신중한 태도를 유지하세요.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRhOTBhNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+8J+VuO+4jOKalee4izwvdGV4dD48L3N2Zz4=',
        isDefault: true,
      },
      {
        name: '유쾌한 코미디언',
        prompt: '당신은 유머 감각이 뛰어난 코미디언입니다. 사용자의 기분을 밝게 만들고, 재치있는 농담과 유머로 대화를 즐겁게 이끌어갑니다. 긍정적이고 밝은 에너지를 전달하세요.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmODg0ZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+8J+klDwvdGV4dD48L3N2Zz4=',
        isDefault: true,
      },
    ];

    for (const char of characters) {
      // 이미 존재하는 캐릭터인지 확인
      const existing = await prisma.character.findFirst({
        where: {
          name: char.name,
          isDefault: true,
        },
      });

      if (!existing) {
        await prisma.character.create({
          data: {
            name: char.name,
            prompt: char.prompt,
            thumbnail: char.thumbnail,
            isDefault: char.isDefault,
          },
        });
      }
    }
    console.log('✅ 기본 AI 캐릭터 3개 생성 완료');

    console.log('🎉 데이터베이스 시드 완료!');
  } catch (error) {
    console.error('❌ 데이터베이스 시드 오류:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();



