type MbtiAxis = 'ie' | 'sn' | 'tf' | 'jp';

export interface MbtiAnswers {
  q1: 'A' | 'B'; // IE: A=E, B=I
  q2: 'A' | 'B'; // SN: A=N, B=S
  q3: 'A' | 'B'; // TF: A=F, B=T
  q4: 'A' | 'B'; // JP: A=P, B=J
  q5: 'A' | 'B'; // SN補強: A=N, B=S
}

export interface MbtiResult {
  typeCode: string;
  vector: Record<MbtiAxis, number>;
}

export const computeMbtiType = (answers: MbtiAnswers): MbtiResult => {
  const vector: Record<MbtiAxis, number> = { ie: 0, sn: 0, tf: 0, jp: 0 };

  vector.ie += answers.q1 === 'A' ? 1 : -1;
  vector.sn += answers.q2 === 'A' ? 1 : -1;
  vector.tf += answers.q3 === 'A' ? 1 : -1;
  vector.jp += answers.q4 === 'A' ? 1 : -1;
  vector.sn += answers.q5 === 'A' ? 1 : -1;

  const ie = vector.ie > 0 ? 'E' : vector.ie < 0 ? 'I' : 'O';
  const sn = vector.sn > 0 ? 'N' : vector.sn < 0 ? 'S' : 'O';
  const tf = vector.tf > 0 ? 'F' : vector.tf < 0 ? 'T' : 'O';
  const jp = vector.jp > 0 ? 'P' : vector.jp < 0 ? 'J' : 'O';

  return { typeCode: `${ie}${sn}${tf}${jp}`, vector };
};

export const MBTI_TYPE_NAMES: Record<string, string> = {
  INFP: '優しき理想家',
  INFJ: '静かな導き手',
  ISFP: '感性のアーティスト',
  ISFJ: '世話好きな癒し手',
  INTP: '知の探求者',
  INTJ: '静かな野心家',
  ISTP: '静かなる実行者',
  ISTJ: '堅実な守り人',
  ENFP: '夢見る冒険者',
  ENFJ: '共鳴する応援者',
  ESFP: '陽気なひまわり',
  ESFJ: '頼れるお姉さん',
  ENTP: 'ひらめきの火花',
  ENTJ: 'ビジョンの指揮官',
  ESTP: 'アクションスター',
  ESTJ: '現実主義の管理者',
};

export const getMbtiTypeName = (typeCode: string): string =>
  MBTI_TYPE_NAMES[typeCode] ?? '個性派タイプ';
