import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const daysAgo = (n: number, hour = 10): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const resolveMood = (score: number): string => {
  if (score <= 10) return 'STORM';
  if (score <= 20) return 'RAIN';
  if (score <= 30) return 'SNOW';
  if (score <= 40) return 'FOG';
  if (score <= 50) return 'CLOUDY';
  if (score <= 60) return 'WHIRLWIND';
  if (score <= 70) return 'SPROUT';
  if (score <= 80) return 'RAINBOW';
  if (score <= 90) return 'STAR';
  return 'SUNNY';
};

const buildVector = (score: number): string => {
  const n = score / 100;
  return JSON.stringify({
    joy: Math.max(0, n - 0.3),
    sadness: Math.max(0, 0.7 - n),
    anger: score <= 10 ? 0.8 : 0,
    anxiety: score >= 51 && score <= 60 ? 0.6 : 0,
    hope: n >= 0.6 ? n - 0.5 : 0,
  });
};

type PostDef = { days: number; score: number; text: string; visible: boolean; keywords: string[] };

const harukaPostDefs: PostDef[] = [
  { days: 1,  score: 72, text: '久しぶりに友達と会えた。笑いすぎてお腹が痛いけど、やっぱり人と会うのって大切だな。',                  visible: true,  keywords: ['嬉しい', '友達', 'リフレッシュ'] },
  { days: 3,  score: 45, text: 'なんとなく気分が重い。理由はわからないけど、体が少し疲れてる感じがする。',                            visible: false, keywords: ['疲れ', 'もやもや'] },
  { days: 5,  score: 88, text: '好きな本を読み終えた。主人公の言葉がずっと心に残りそう。いい読書体験だった。',                          visible: true,  keywords: ['読書', '感動', '充実'] },
  { days: 7,  score: 55, text: '仕事は普通。可もなく不可もなくという感じ。夕飯においしいものを食べて少し元気になった。',                visible: false, keywords: ['普通', '食事'] },
  { days: 9,  score: 32, text: '昨日から続く疲れが取れない。心もすこしずつ削られている気がする。早く眠れますように。',                  visible: true,  keywords: ['疲れ', '落ち込み'] },
  { days: 11, score: 80, text: '今日は散歩に出かけた。風が気持ちよくて、久しぶりに深呼吸ができた気がする。',                          visible: true,  keywords: ['散歩', '自然', '癒し'] },
  { days: 13, score: 65, text: '少しずつやるべきことが片付いてきた。焦りが減ってきた気がする。',                                      visible: true,  keywords: ['達成感', '前向き'] },
  { days: 15, score: 22, text: 'ひどく悲しい夢を見た。目が覚めてもその感覚が残って、一日ずっとぼんやりしていた。',                      visible: false, keywords: ['悲しい', '夢'] },
  { days: 17, score: 77, text: '家族と電話した。たわいない話ばかりだけど、それが一番ほっとする。',                                      visible: true,  keywords: ['家族', '安心', '幸せ'] },
  { days: 19, score: 58, text: '少し忙しくなってきた。余裕がなくなると些細なことが気になる。意識して深呼吸している。',                  visible: false, keywords: ['忙しい', '焦り'] },
  { days: 21, score: 91, text: '今日は最高だった！ずっとやりたかったことに挑戦して、うまくいった。自分を褒めたい。',                    visible: true,  keywords: ['達成', '自信', '最高'] },
  { days: 23, score: 42, text: '人間関係でちょっとモヤモヤすることがあった。言葉にするのが難しい感情。',                              visible: false, keywords: ['人間関係', 'もやもや'] },
];

const taichiPostDefs: PostDef[] = [
  { days: 2,  score: 82, text: '新しいプロジェクトのアイデアが浮かんでワクワクが止まらない！夜中まで考えてしまった。',                  visible: true,  keywords: ['ワクワク', 'アイデア', '熱中'] },
  { days: 4,  score: 60, text: '今日はまあまあ普通の日。特に何もなかったけど悪くもない。そういう日も必要。',                            visible: false, keywords: ['普通', '平和'] },
  { days: 6,  score: 38, text: 'ちょっと疲れた。アイデアも浮かばないし今日は早めに休む。充電が必要だ。',                                visible: true,  keywords: ['疲れ', '充電'] },
  { days: 8,  score: 85, text: '久しぶりに議論に熱中した。相手も負けず劣らず面白くて、刺激的な時間だった。',                            visible: true,  keywords: ['議論', '刺激', '知的好奇心'] },
  { days: 10, score: 52, text: '締め切りが迫ってきた。焦りはあるけど、なんとかなりそうな気もしている。',                                visible: false, keywords: ['締め切り', '焦り'] },
  { days: 12, score: 74, text: '読んでいた本の謎がやっと解けた。こういう瞬間のために生きてる気がする。',                                visible: true,  keywords: ['閃き', '読書', '満足'] },
  { days: 14, score: 28, text: '思ったよりも落ち込んでいる。うまくいかないことが続いた。切り替えが難しい。',                            visible: false, keywords: ['落ち込み', '切り替え'] },
  { days: 16, score: 79, text: '友人と新しいカフェを開拓した。会話が弾んで気づいたら3時間経っていた。',                                visible: true,  keywords: ['友人', 'カフェ', '楽しい'] },
  { days: 18, score: 64, text: '仕事がじわじわと進んでいる感じ。大きな達成感はないけど、確実に前進している。',                          visible: false, keywords: ['進捗', '地道'] },
  { days: 20, score: 48, text: '天気が悪い日は気持ちも影響される。こんな日は静かに過ごすのが一番。',                                    visible: true,  keywords: ['天気', '静か'] },
];

const mioriPostDefs: PostDef[] = [
  { days: 1,  score: 86, text: 'お気に入りのカフェで好きな音楽を聴きながら読書した。これが最高の休日の過ごし方。',                      visible: true,  keywords: ['カフェ', '音楽', '読書', '幸せ'] },
  { days: 2,  score: 78, text: 'ひさしぶりに手紙を書いた。言葉を選ぶ時間がとても心地よかった。',                                        visible: true,  keywords: ['手紙', '言葉', '丁寧'] },
  { days: 4,  score: 35, text: '誰かに傷つけられたわけじゃないけど、なんか寂しい気持ちになった。季節のせいかな。',                      visible: false, keywords: ['寂しい', 'もやもや'] },
  { days: 5,  score: 51, text: '今日はそこそこ。特別なことは何もなかったけど、穏やかに過ごせた。',                                      visible: false, keywords: ['穏やか', '普通'] },
  { days: 7,  score: 94, text: '絵を描いたら思っていたより上手くいった！久しぶりに没頭できて、時間を忘れた。',                          visible: true,  keywords: ['絵', '没頭', '創作', '達成感'] },
  { days: 8,  score: 63, text: '今日は好きな映画を観た。感動とは言えないけど、温かい気持ちになれた。',                                  visible: true,  keywords: ['映画', '温かい'] },
  { days: 10, score: 19, text: '今日はとても辛かった。何もしたくなくて、ただ布団の中にいた。こんな日もある。',                          visible: false, keywords: ['辛い', '落ち込み'] },
  { days: 13, score: 75, text: '久しぶりに自然の中を歩いた。葉っぱの色や川の音に気持ちが落ち着いた。',                                  visible: true,  keywords: ['自然', '散歩', '癒し'] },
  { days: 16, score: 57, text: '友達と少し話した。相手の言葉が心に刺さった部分もあったけど、悪意はなかったと思う。',                    visible: false, keywords: ['友達', '複雑'] },
  { days: 19, score: 82, text: '初めてのレシピに挑戦したら美味しくできた！料理って創作みたいで楽しい。',                                visible: true,  keywords: ['料理', '挑戦', '達成感'] },
  { days: 22, score: 44, text: 'なんとなく体が重い。気持ちも少しぼんやりしている。でも明日は良くなると思いたい。',                      visible: false, keywords: ['体が重い', 'ぼんやり'] },
  { days: 25, score: 69, text: '朝の光が綺麗だった。小さなことだけど、それだけで少し気持ちが上がる自分に気づいた。',                    visible: true,  keywords: ['朝', '光', '気づき'] },
];

const kentoPostDefs: PostDef[] = [
  { days: 3,  score: 87, text: '今日の目標リストを全部クリアした。気持ちよくて最高。効率よく動ける日は気分が違う。',                    visible: true,  keywords: ['達成', '効率', '目標'] },
  { days: 6,  score: 53, text: 'まあまあ進んだ。ペースは落ちているが想定内。明日挽回できる見通し。',                                    visible: false, keywords: ['仕事', '進捗'] },
  { days: 9,  score: 26, text: '思ったより進まなかった。プランを見直す必要がある。悔しいが感情的になっても無意味だ。',                    visible: false, keywords: ['反省', '改善'] },
  { days: 12, score: 80, text: 'チームのメンバーが期待以上の成果を出してくれた。自分の関わり方が少しは役に立てたかな。',                  visible: true,  keywords: ['チーム', '感謝', '喜び'] },
  { days: 15, score: 61, text: '規則正しく過ごせている。運動・食事・睡眠のバランスが整ってきた気がする。',                                visible: true,  keywords: ['健康', '規則', 'バランス'] },
  { days: 18, score: 47, text: '会議が多くて疲れた。もっと事前に調整できることがあったはず。次回に活かす。',                              visible: false, keywords: ['会議', '疲れ', '改善'] },
  { days: 21, score: 88, text: '長期プロジェクトの節目を迎えた。仲間と達成できたのが嬉しい。次のフェーズに向けて気が引き締まる。',        visible: true,  keywords: ['節目', '達成', 'チーム'] },
  { days: 24, score: 40, text: '少し頭が痛い。体調が優れない日は判断力も落ちる。今日は無理せず早めに終わらせた。',                        visible: false, keywords: ['体調', '無理しない'] },
];

const aoiPostDefs: PostDef[] = [
  { days: 2,  score: 95, text: '今日も楽しかった！新しい出会いがあって、また世界が少し広がった気がする。',                              visible: true,  keywords: ['出会い', '楽しい', 'ワクワク'] },
  { days: 3,  score: 77, text: '友達の悩みを一緒に考えた。自分のことじゃないけど、寄り添えた気がしてうれしかった。',                    visible: true,  keywords: ['友達', '寄り添う', '嬉しい'] },
  { days: 5,  score: 48, text: 'ちょっとエネルギー切れ気味。楽しいことは好きだけど、たまに疲れる自分もいる。',                          visible: false, keywords: ['疲れ', 'エネルギー', '休息'] },
  { days: 6,  score: 42, text: 'アイデアが出ない日。ぼんやりしている。こういう日も必要だと頭ではわかってるけど。',                      visible: false, keywords: ['停滞', 'ぼんやり'] },
  { days: 8,  score: 83, text: 'ずっと行きたかった展覧会に行った！アーティストの世界観に引き込まれた。',                                visible: true,  keywords: ['展覧会', '感動', '芸術'] },
  { days: 9,  score: 70, text: '好きな人たちとご飯を食べた。温かくて美味しくて、笑いっぱなしだった。',                                  visible: true,  keywords: ['食事', '笑い', '温かい'] },
  { days: 11, score: 34, text: 'なんか不安な気持ちが続いている。具体的な理由がないのが逆につらい。',                                    visible: false, keywords: ['不安', 'もやもや'] },
  { days: 14, score: 59, text: '今日はまあまあな日。悪くはないけど、もう少し輝かせたかった。',                                          visible: false, keywords: ['普通', '物足りない'] },
  { days: 17, score: 90, text: '念願の挑戦をした。うまくいくかはわからないけど、やってみた自分が誇らしい。',                            visible: true,  keywords: ['挑戦', '勇気', '自信'] },
  { days: 20, score: 25, text: 'ひどく落ち込んでいる。自分が嫌になる日ってどうすればいいんだろう。',                                    visible: false, keywords: ['落ち込み', '自己嫌悪'] },
  { days: 23, score: 75, text: '空が綺麗だったので遠くまで歩いた。気づいたら頭がすっきりしていた。',                                    visible: true,  keywords: ['散歩', '空', 'リフレッシュ'] },
  { days: 26, score: 66, text: '最近気になっている人に勇気を出して話しかけた。普通に話せてよかった。',                                  visible: true,  keywords: ['勇気', '人間関係', '一歩'] },
];

async function createUserPosts(
  userId: number,
  defs: PostDef[],
): Promise<Array<{ id: number; isVisible: boolean; userId: number }>> {
  const result = [];
  for (const def of defs) {
    const mood = resolveMood(def.score);
    const post = await prisma.post.create({
      data: {
        userId,
        text: def.text,
        feelingScore: def.score,
        mood,
        emotionKeywords: JSON.stringify(def.keywords),
        isVisible: def.visible,
        createdAt: daysAgo(def.days),
      },
    });
    await prisma.feelingAnalysis.create({
      data: {
        postId: post.id,
        emotionScore: def.score,
        emotionVectorJson: buildVector(def.score),
        mood,
        analyzedAt: daysAgo(def.days),
      },
    });
    result.push({ id: post.id, isVisible: def.visible, userId });
  }
  return result;
}

const FORECAST_COMMENTS: Record<string, string> = {
  SUNNY: 'この調子で行きましょう！あなたの光が周りを照らしています。',
  RAINBOW: '困難の後に虹が出ます。今、まさにその時期ですね。',
  STAR: '夜空の星のように、静かに輝いています。',
  SPROUT: '少しずつ、でも確実に前向きになっています。',
  CLOUDY: '雲の上には必ず青空があります。',
  WHIRLWIND: '少しゆっくりしてみませんか？',
  FOG: '霧は必ず晴れます。今日は自分をいたわってあげてください。',
  RAIN: '雨の日は、自分に優しくする日です。',
  SNOW: '雪のような静かさの中に、美しさがあります。',
  STORM: 'この嵐も、必ず過ぎ去ります。無理しないでください。',
};

const FORECAST_SUMMARIES: Record<string, string> = {
  SUNNY: 'この頃は気持ちが明るく開けていたようです。そんな日が続いていること、すてきですね。',
  RAINBOW: '困難の後に光を見つけた日が多かったようです。あなたの中に、回復する力があります。',
  STAR: '静かに自分と向き合う時間が多かったようです。その深さは、あなたの大切な部分です。',
  SPROUT: '少しずつ、でも着実に前向きな気持ちが芽吹いていたようです。',
  CLOUDY: 'はっきりしないもやもやした日が多かったようです。それも、ありのままの自分です。',
  WHIRLWIND: '心が揺れ動いた日が多かったようです。少しゆっくり休んでみませんか。',
  FOG: '方向を見失いそうな日が続いていたようです。霧はいつか晴れます。',
  RAIN: '涙のような気持ちの日が多かったようです。自分をいたわってあげてください。',
  SNOW: '静けさの中で、静かに耐えていたようです。その優しさが、あなたらしさです。',
  STORM: '激しい感情と向き合う日が続いていたようです。嵐の後には、必ず空が開けます。',
};

const REVIEW_COMMENTS: Record<string, string> = {
  SUNNY: 'とても輝かしい月でしたね。その笑顔、大切にしてください。',
  RAINBOW: '乗り越えた証が虹になりました。あなたは強いです。',
  STAR: '静かに深く考えた月でしたね。その思索はあなたの財産です。',
  SPROUT: '小さな芽吹きを積み重ねた月でした。着実に育っています。',
  CLOUDY: 'ぼんやりした日も、それがあなたの正直な気持ちです。',
  WHIRLWIND: '忙しく動き回った月でしたね。少し立ち止まって深呼吸を。',
  FOG: '霧の中でも前に進めた自分を認めてあげてください。',
  RAIN: '悲しみや寂しさを感じた月でした。それも大切な感情です。',
  SNOW: '静かな時間を過ごせましたか。自分をいたわれましたか？',
  STORM: '嵐のような月でしたね。それでも記録し続けたあなたはすごい。',
};

function computeMainMood(defs: PostDef[]): string {
  const counts: Record<string, number> = {};
  defs.forEach((p) => { const m = resolveMood(p.score); counts[m] = (counts[m] ?? 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

async function main() {
  console.log('🌱 Seeding Habitora...');

  // Clear all data in dependency order
  await prisma.notification.deleteMany();
  await prisma.thank.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.feelingAnalysis.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.moodForecast.deleteMany();
  await prisma.mBTIDiagnosis.deleteMany();
  await prisma.attributeLog.deleteMany();
  await prisma.avatar.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash('password123', 10);

  // ── Users ──────────────────────────────────────────────────────────────────
  const [haruka, taichi, miori, kento, aoi] = await Promise.all([
    prisma.user.create({ data: { email: 'haruka@example.com', password: pw, nickname: 'はるか', mbtiType: 'INFJ', level: 3, kindnessTotal: 15 } }),
    prisma.user.create({ data: { email: 'taichi@example.com', password: pw, nickname: 'たいち', mbtiType: 'ENTP', level: 2, kindnessTotal: 8  } }),
    prisma.user.create({ data: { email: 'miori@example.com',  password: pw, nickname: 'みおり', mbtiType: 'ISFP', level: 4, kindnessTotal: 22 } }),
    prisma.user.create({ data: { email: 'kento@example.com',  password: pw, nickname: 'けんと', mbtiType: 'ESTJ', level: 2, kindnessTotal: 5  } }),
    prisma.user.create({ data: { email: 'aoi@example.com',    password: pw, nickname: 'あおい', mbtiType: 'ENFP', level: 3, kindnessTotal: 12 } }),
  ]);
  console.log('✅ Users (5)');

  // ── MBTI Diagnoses ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.mBTIDiagnosis.create({ data: { userId: haruka.id, diagnosisType: 'INITIAL', resultType: 'INFJ', resultVectorJson: JSON.stringify({ IE: -3, SN: 2, TF: 3, JP: -2 }) } }),
    prisma.mBTIDiagnosis.create({ data: { userId: taichi.id, diagnosisType: 'INITIAL', resultType: 'ENTP', resultVectorJson: JSON.stringify({ IE: 3, SN: 2, TF: -2, JP: -1 }) } }),
    prisma.mBTIDiagnosis.create({ data: { userId: miori.id,  diagnosisType: 'INITIAL', resultType: 'ISFP', resultVectorJson: JSON.stringify({ IE: -2, SN: -3, TF: 2, JP: -2 }) } }),
    prisma.mBTIDiagnosis.create({ data: { userId: kento.id,  diagnosisType: 'INITIAL', resultType: 'ESTJ', resultVectorJson: JSON.stringify({ IE: 2, SN: -2, TF: -3, JP: 3 }) } }),
    prisma.mBTIDiagnosis.create({ data: { userId: aoi.id,    diagnosisType: 'INITIAL', resultType: 'ENFP', resultVectorJson: JSON.stringify({ IE: 3, SN: 2, TF: 2, JP: -2 }) } }),
  ]);
  console.log('✅ MBTI diagnoses (5)');

  // ── Posts ──────────────────────────────────────────────────────────────────
  const [hPosts, tPosts, mPosts, kPosts, aPosts] = await Promise.all([
    createUserPosts(haruka.id, harukaPostDefs),
    createUserPosts(taichi.id, taichiPostDefs),
    createUserPosts(miori.id,  mioriPostDefs),
    createUserPosts(kento.id,  kentoPostDefs),
    createUserPosts(aoi.id,    aoiPostDefs),
  ]);
  const allPosts = [...hPosts, ...tPosts, ...mPosts, ...kPosts, ...aPosts];
  const publicPosts = allPosts.filter((p) => p.isVisible);
  console.log(`✅ Posts (${allPosts.length}) + FeelingAnalysis`);

  // ── Avatars ────────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.avatar.create({ data: { userId: haruka.id, fixedType: 'INFJ', mood: 'RAINBOW', expression: 'GENTLE',    commentStyle: 'GENTLE'   } }),
    prisma.avatar.create({ data: { userId: taichi.id, fixedType: 'ENTP', mood: 'SPROUT',  expression: 'CURIOUS',   commentStyle: 'LOGICAL'  } }),
    prisma.avatar.create({ data: { userId: miori.id,  fixedType: 'ISFP', mood: 'STAR',    expression: 'DREAMY',    commentStyle: 'WARM'     } }),
    prisma.avatar.create({ data: { userId: kento.id,  fixedType: 'ESTJ', mood: 'SUNNY',   expression: 'DETERMINED',commentStyle: 'DIRECT'   } }),
    prisma.avatar.create({ data: { userId: aoi.id,    fixedType: 'ENFP', mood: 'SUNNY',   expression: 'CHEERFUL',  commentStyle: 'ENERGETIC'} }),
  ]);
  console.log('✅ Avatars (5)');

  // ── Comments ───────────────────────────────────────────────────────────────
  const users = [haruka, taichi, miori, kento, aoi];

  const commentTemplates = [
    '気持ちを共有してくれてありがとうございます。一緒に乗り越えましょう！',
    'その気持ち、よく分かります。無理せず自分のペースで。',
    '読んでいて、すごく伝わってきました。ゆっくり休んでね。',
    '素直に表現できるって、とても素晴らしいことだと思います。',
    'いつも応援しています。あなたの感情は大切なものです。',
    '今日も一歩一歩、着実に進んでいますね。',
    '同じような気持ちになることあります。一人じゃないよ。',
    'この投稿を見て、自分も勇気をもらいました。ありがとう。',
    '感情を言葉にするって難しいのに、上手く伝わりました。',
    '今日の気持ちを大切にしてね。明日はきっと違う風景が見えるはず。',
    'あなたの正直な気持ちが、読んでいて心に刺さりました。',
    '一緒に少しずつ前に進みましょう。応援しています！',
  ];

  let commentCount = 0;
  let thankCount = 0;
  const createdComments: Array<{ id: number; postId: number; userId: number }> = [];

  for (const post of publicPosts) {
    const commenters = users.filter((u) => u.id !== post.userId);
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments && i < commenters.length; i++) {
      const commenter = commenters[i];
      const template = commentTemplates[(commentCount) % commentTemplates.length];
      const createdAt = daysAgo(Math.floor(Math.random() * 4) + 1);
      const comment = await prisma.comment.create({
        data: { postId: post.id, userId: commenter.id, text: template, isHidden: false, createdAt },
      });
      createdComments.push({ id: comment.id, postId: post.id, userId: commenter.id });
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'COMMENT',
          title: 'コメントが届きました',
          message: `${commenter.nickname} さんがコメントしました。`,
          relatedObjectId: comment.id,
          relatedObjectType: 'COMMENT',
          isRead: Math.random() > 0.5,
          createdAt,
        },
      });
      commentCount++;
    }
  }
  console.log(`✅ Comments (${commentCount})`);

  // ── Thanks & Notifications ─────────────────────────────────────────────────
  // 投稿主のみ、自分の投稿についたコメントにありがとうを送れる仕様
  for (const post of publicPosts) {
    const postAuthor = users.find((u) => u.id === post.userId)!;
    const commentsOnPost = createdComments.filter(
      (c) => c.postId === post.id && c.userId !== post.userId,
    );
    for (const c of commentsOnPost) {
      const createdAt = daysAgo(Math.floor(Math.random() * 3) + 1);
      const thank = await prisma.thank.create({
        data: { commentId: c.id, fromUserId: post.userId, toUserId: c.userId, kindnessScore: 3, createdAt },
      });
      await prisma.notification.create({
        data: {
          userId: c.userId,
          type: 'THANK',
          title: 'ありがとうが届きました',
          message: `${postAuthor.nickname} さんからありがとうをもらいました。`,
          relatedObjectId: thank.id,
          relatedObjectType: 'Thank',
          isRead: Math.random() > 0.5,
          createdAt,
        },
      });
      await prisma.user.update({ where: { id: c.userId }, data: { kindnessTotal: { increment: 3 } } });
      thankCount++;
    }
  }
  console.log(`✅ Thanks (${thankCount}) + Notifications`);

  // ── MoodForecasts ──────────────────────────────────────────────────────────
  const today = new Date();
  const forecastStart = new Date(today);
  forecastStart.setDate(forecastStart.getDate() - 30);

  const allUserDefs = [
    { user: haruka, defs: harukaPostDefs },
    { user: taichi, defs: taichiPostDefs },
    { user: miori,  defs: mioriPostDefs  },
    { user: kento,  defs: kentoPostDefs  },
    { user: aoi,    defs: aoiPostDefs    },
  ];

  for (const { user, defs } of allUserDefs) {
    const mainMood = computeMainMood(defs);
    const moodTrend: Record<string, string> = {};
    defs.slice(0, 7).forEach((p) => {
      const key = daysAgo(p.days).toISOString().split('T')[0];
      moodTrend[key] = resolveMood(p.score);
    });
    await prisma.moodForecast.create({
      data: {
        userId: user.id,
        startDate: forecastStart,
        endDate: today,
        mainMood,
        moodTrendJson: JSON.stringify(moodTrend),
        emotionSummary: FORECAST_SUMMARIES[mainMood] ?? '',
        avatarComment: FORECAST_COMMENTS[mainMood] ?? '',
      },
    });
  }
  console.log('✅ MoodForecasts (5)');

  // ── Monthly Reviews ────────────────────────────────────────────────────────
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  for (const { user, defs } of allUserDefs) {
    const mainMood = computeMainMood(defs);
    const avgScore = Math.round(defs.reduce((s, p) => s + p.score, 0) / defs.length);
    const moodCounts: Record<string, number> = {};
    defs.forEach((p) => { const m = resolveMood(p.score); moodCounts[m] = (moodCounts[m] ?? 0) + 1; });
    const levelChange = defs.length >= 10 ? 1 : 0;
    await prisma.review.create({
      data: {
        userId: user.id,
        periodStart,
        periodEnd,
        summaryText: `今月は${defs.length}回記録しました。平均スコアは${avgScore}点で、いちばん多かった天気は「${mainMood}」でした。`,
        selectedPostIdsJson: JSON.stringify([]),
        highlightFeelingJson: JSON.stringify({ avg: avgScore, moodCounts }),
        avatarComment: REVIEW_COMMENTS[mainMood] ?? 'よく記録してくれました。',
        levelChange,
      },
    });
  }
  console.log('✅ Reviews (5)');

  // ── Consultations ──────────────────────────────────────────────────────────
  const consultations = [
    {
      userId: haruka.id,
      content: '最近、職場での人間関係がうまくいっていない気がして、毎日が少しだけ憂鬱です。',
      selectedTheme: '悩み', guidanceType: 'WORRY',
      guidanceStepsJson: JSON.stringify(['今、一番つらいと感じていることは何ですか？', 'その悩みはいつ頃から続いていますか？', '自分を責めていることはありますか？', 'もし親友が同じ悩みを抱えていたら、どんな言葉をかけますか？']),
      insightSummary: '悩みを言葉にすることで、少し軽くなることがあります。あなたは一人ではありません。',
      avatarReaction: 'あなたの悩みを受け止めました。ゆっくり一緒に考えていきましょう。',
      isArchived: false, submittedAt: daysAgo(5),
    },
    {
      userId: miori.id,
      content: '将来のことを考えると不安で眠れない夜があります。このままでいいのかなって。',
      selectedTheme: '不安', guidanceType: 'ANXIETY',
      guidanceStepsJson: JSON.stringify(['今、ここにある確かなものを3つ挙げてみてください。', '最悪の場合を想像してみました。その確率はどのくらいだと思いますか？', '不安を感じている自分に「それはどんなメッセージですか？」と聞いてみてください。', '一歩だけやるとしたら、どんな小さなことができますか？']),
      insightSummary: '不安は「備えよ」というサインです。小さな一歩が不安を和らげます。',
      avatarReaction: '不安な気持ち、伝わりました。深呼吸して、一歩ずつ進みましょう。',
      isArchived: false, submittedAt: daysAgo(3),
    },
    {
      userId: aoi.id,
      content: '自分が何をしたいのかわからなくなってきた。やりたいことがたくさんあったはずなのに。',
      selectedTheme: '自己理解', guidanceType: 'SELF',
      guidanceStepsJson: JSON.stringify(['最近うれしかった、または充実していたのはいつですか？', '自分の強みだと思うことは何ですか？苦手な自分もあわせて教えてください。', '1年後の自分に手紙を書くとしたら、どんな言葉をかけますか？']),
      insightSummary: '自己理解は比較ではなく、自分との対話から生まれます。',
      avatarReaction: '自分と向き合おうとしているんですね。それはとても大切なことです。',
      isArchived: false, submittedAt: daysAgo(2),
    },
    {
      userId: taichi.id,
      content: '最近イライラすることが多い。なぜこんなに感情的になるのか自分でもわからない。',
      selectedTheme: '感情整理', guidanceType: 'EMOTION',
      guidanceStepsJson: JSON.stringify(['今の気持ちに名前をつけるとしたら何でしょう？', 'その感情を体のどこで感じていますか？', 'その感情に何かメッセージがあるとしたら、何を伝えたいでしょうか？', 'その感情を持っていてもいい、と自分に言ってあげてください。何か変わりましたか？']),
      insightSummary: '感情に名前をつけることで、感情に飲み込まれにくくなります。',
      avatarReaction: '感情を整理しようとしているんですね。その勇気、素晴らしいです。',
      isArchived: false, submittedAt: daysAgo(7),
    },
    {
      userId: kento.id,
      content: '仕事のペースが落ちている。何か根本的な原因があるのかを整理したい。',
      selectedTheme: 'その他', guidanceType: 'OTHER',
      guidanceStepsJson: JSON.stringify(['今、頭の中にあることを自由に書き出してみてください。', '今の自分に必要なのは「行動」「休息」「誰かに話す」のどれだと思いますか？', '今日、自分を少し喜ばせることができるとしたら何をしますか？']),
      insightSummary: '自分の気持ちに気づいて、言葉にしようとしたこと、それだけで十分です。',
      avatarReaction: '今の気持ちを言葉にしてくれてありがとう。',
      isArchived: false, submittedAt: daysAgo(4),
    },
    {
      userId: haruka.id,
      content: 'なんとなく自分のことがわかってきたような気もするし、全然わかっていない気もする。',
      selectedTheme: '自己理解', guidanceType: 'SELF',
      guidanceStepsJson: JSON.stringify(['最近うれしかった、または充実していたのはいつですか？', '自分の強みだと思うことは何ですか？', '1年後の自分に手紙を書くとしたら、どんな言葉をかけますか？']),
      insightSummary: '自己理解は比較ではなく、自分との対話から生まれます。',
      avatarReaction: '自分と向き合おうとしているんですね。それはとても大切なことです。',
      isArchived: true, submittedAt: daysAgo(14),
    },
  ];

  for (const data of consultations) {
    await prisma.consultation.create({ data });
  }
  console.log(`✅ Consultations (${consultations.length})`);

  console.log('\n🎉 Seed complete!\n');
  console.log('Test accounts (password: password123):');
  console.log('  haruka@example.com  — はるか (INFJ, Lv.3)');
  console.log('  taichi@example.com  — たいち (ENTP, Lv.2)');
  console.log('  miori@example.com   — みおり (ISFP, Lv.4)');
  console.log('  kento@example.com   — けんと (ESTJ, Lv.2)');
  console.log('  aoi@example.com     — あおい (ENFP, Lv.3)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
