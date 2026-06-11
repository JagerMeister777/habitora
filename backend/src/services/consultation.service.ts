import { PrismaClient } from '@prisma/client';
import { AppError, ConsultationResponse } from '../types';

const prisma = new PrismaClient();

type Theme = '悩み' | '不安' | '感情整理' | '自己理解' | 'その他';

const GUIDANCE: Record<Theme, { type: string; steps: string[]; insight: string }> = {
  '悩み': {
    type: 'WORRY',
    steps: [
      '今、一番つらいと感じていることは何ですか？できるだけ具体的に言葉にしてみてください。',
      'その悩みはいつ頃から続いていますか？きっかけになる出来事はありましたか？',
      '自分を責めていることはありますか？あなたのせいではないことも、たくさんあります。',
      'もし親友が同じ悩みを抱えていたら、あなたはどんな言葉をかけますか？',
    ],
    insight: '悩みを言葉にすることで、少し軽くなることがあります。あなたは一人ではありません。',
  },
  '不安': {
    type: 'ANXIETY',
    steps: [
      '今、ここにある確かなものを3つ挙げてみてください（例：椅子、窓、自分の手）。',
      '最悪の場合を想像してみました。その確率はどのくらいだと思いますか？',
      '不安を感じている自分に「それはどんなメッセージですか？」と聞いてみてください。',
      '一歩だけやるとしたら、どんな小さなことができますか？',
    ],
    insight: '不安は「備えよ」というサインです。小さな一歩が不安を和らげます。',
  },
  '感情整理': {
    type: 'EMOTION',
    steps: [
      '今の気持ちに名前をつけるとしたら何でしょう？（例：悲しみ、もどかしさ、怒り）',
      'その感情を体のどこで感じていますか？胸、お腹、頭…？',
      'その感情に何かメッセージがあるとしたら、何を伝えたいでしょうか？',
      'その感情を持っていてもいい、と自分に言ってあげてください。何か変わりましたか？',
    ],
    insight: '感情に名前をつけることで、感情に飲み込まれにくくなります。',
  },
  '自己理解': {
    type: 'SELF',
    steps: [
      '最近うれしかった、または充実していたのはいつですか？それはどんな瞬間でしたか？',
      '自分の強みだと思うことは何ですか？苦手な自分もあわせて教えてください。',
      '1年後の自分に手紙を書くとしたら、どんな言葉をかけますか？',
    ],
    insight: '自己理解は比較ではなく、自分との対話から生まれます。',
  },
  'その他': {
    type: 'OTHER',
    steps: [
      '今、頭の中にあることを自由に書き出してみてください。',
      '今の自分に必要なのは「行動」「休息」「誰かに話す」のどれだと思いますか？',
      '今日、自分を少し喜ばせることができるとしたら何をしますか？',
    ],
    insight: '自分の気持ちに気づいて、言葉にしようとしたこと、それだけで十分です。',
  },
};

const AVATAR_REACTIONS: Record<string, string> = {
  WORRY:   'あなたの悩みを受け止めました。ゆっくり一緒に考えていきましょう。',
  ANXIETY: '不安な気持ち、伝わりました。深呼吸して、一歩ずつ進みましょう。',
  EMOTION: '感情を整理しようとしているんですね。その勇気、素晴らしいです。',
  SELF:    '自分と向き合おうとしているんですね。それはとても大切なことです。',
  OTHER:   '今の気持ちを言葉にしてくれてありがとう。',
};

const toResponse = (c: {
  id: number; userId: number; title: string | null; content: string;
  selectedTheme: string | null; guidanceType: string | null; guidanceStepsJson: string;
  insightSummary: string | null; avatarReaction: string | null;
  isArchived: boolean; submittedAt: Date;
}): ConsultationResponse => ({
  id: c.id, userId: c.userId, title: c.title, content: c.content,
  selectedTheme: c.selectedTheme, guidanceType: c.guidanceType,
  guidanceStepsJson: c.guidanceStepsJson, insightSummary: c.insightSummary,
  avatarReaction: c.avatarReaction, isArchived: c.isArchived, submittedAt: c.submittedAt,
});

export const createConsultation = async (data: {
  userId: number;
  content: string;
  selectedTheme?: string;
  title?: string;
}): Promise<ConsultationResponse> => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const theme = (data.selectedTheme as Theme) ?? 'その他';
  const guidance = GUIDANCE[theme] ?? GUIDANCE['その他'];

  const consultation = await prisma.consultation.create({
    data: {
      userId: data.userId,
      title: data.title ?? null,
      content: data.content,
      selectedTheme: theme,
      guidanceType: guidance.type,
      guidanceStepsJson: JSON.stringify(guidance.steps),
      insightSummary: guidance.insight,
      avatarReaction: AVATAR_REACTIONS[guidance.type] ?? null,
      isArchived: false,
    },
  });

  return toResponse(consultation);
};

export const listConsultations = async (userId: number): Promise<ConsultationResponse[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const consultations = await prisma.consultation.findMany({
    where: { userId, isArchived: false },
    orderBy: { submittedAt: 'desc' },
    take: 10,
  });
  return consultations.map(toResponse);
};

export const archiveConsultation = async (id: number): Promise<ConsultationResponse> => {
  const c = await prisma.consultation.findUnique({ where: { id } });
  if (!c) throw new AppError(404, '相談が見つかりませんでした。');
  const updated = await prisma.consultation.update({ where: { id }, data: { isArchived: true } });
  return toResponse(updated);
};
