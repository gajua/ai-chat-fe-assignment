import { prisma } from '../src/db/client';

/**
 * 사용자가 생성한 캐릭터 삭제 (기본 캐릭터 3개만 유지)
 */
async function cleanCharacters() {
  console.log('🧹 사용자 생성 캐릭터 삭제 시작...');

  try {
    // isDefault = false인 캐릭터 삭제
    const result = await prisma.character.deleteMany({
      where: {
        isDefault: false,
      },
    });

    console.log(`✅ ${result.count}개의 사용자 생성 캐릭터 삭제 완료`);

    // 남은 캐릭터 확인
    const remainingCharacters = await prisma.character.findMany({
      select: {
        id: true,
        name: true,
        isDefault: true,
      },
    });

    console.log('\n📋 남은 캐릭터 목록:');
    remainingCharacters.forEach((char, index) => {
      console.log(`${index + 1}. ${char.name} (기본: ${char.isDefault})`);
    });

    console.log('\n🎉 정리 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanCharacters();




