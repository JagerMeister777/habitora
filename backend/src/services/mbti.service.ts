import { PrismaClient } from '@prisma/client';
import { AppError, MBTIDiagnosisResponse } from '../types';
import { computeMbtiType, MbtiAnswers } from '../utils/mbti';

const prisma = new PrismaClient();

export const createInitialDiagnosis = async (
  userId: number,
  answers: MbtiAnswers,
): Promise<MBTIDiagnosisResponse & { typeName: string }> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const { typeCode, vector } = computeMbtiType(answers);

  const diagnosis = await prisma.mBTIDiagnosis.create({
    data: {
      userId,
      diagnosisType: 'INITIAL',
      resultType: typeCode,
      resultVectorJson: JSON.stringify(vector),
      reasoningText: null,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { mbtiType: typeCode, reDiagnosisNeeded: false },
  });

  await prisma.avatar.upsert({
    where: { userId },
    create: { userId, fixedType: typeCode },
    update: { fixedType: typeCode, updatedAt: new Date() },
  });

  const { getMbtiTypeName } = await import('../utils/mbti');

  return {
    id: diagnosis.id,
    userId: diagnosis.userId,
    diagnosisType: diagnosis.diagnosisType,
    resultType: diagnosis.resultType,
    resultVectorJson: diagnosis.resultVectorJson,
    diagnosedAt: diagnosis.diagnosedAt,
    typeName: getMbtiTypeName(typeCode),
  };
};

export const getDiagnoses = async (userId: number): Promise<MBTIDiagnosisResponse[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const diagnoses = await prisma.mBTIDiagnosis.findMany({
    where: { userId },
    orderBy: { diagnosedAt: 'desc' },
  });

  return diagnoses.map((d) => ({
    id: d.id,
    userId: d.userId,
    diagnosisType: d.diagnosisType,
    resultType: d.resultType,
    resultVectorJson: d.resultVectorJson,
    diagnosedAt: d.diagnosedAt,
  }));
};
