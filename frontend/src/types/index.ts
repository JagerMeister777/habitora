export type WeatherMood =
  | 'SUNNY'
  | 'CLOUDY'
  | 'RAIN'
  | 'STORM'
  | 'RAINBOW'
  | 'FOG'
  | 'WHIRLWIND'
  | 'SNOW'
  | 'STAR'
  | 'SPROUT';

export interface User {
  id: number;
  email: string;
  nickname: string | null;
  mbtiType: string | null;
  level: number;
  kindnessTotal: number;
  registeredAt: string;
}

export interface Post {
  id: number;
  userId: number;
  text: string;
  feelingScore: number;
  mood: WeatherMood;
  emotionKeywords: string[];
  isVisible: boolean;
  createdAt: string;
}

export interface Thank {
  id: number;
  postId: number;
  fromUserId: number;
  toUserId: number;
  message: string | null;
  kindnessScore: number;
  createdAt: string;
}

export interface MBTIDiagnosis {
  id: number;
  userId: number;
  diagnosisType: string;
  resultType: string;
  resultVectorJson: string;
  diagnosedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedObjectId: number | null;
  createdAt: string;
}

export interface Review {
  id: number;
  userId: number;
  periodStart: string;
  periodEnd: string;
  summaryText: string | null;
  selectedPostIdsJson: string;
  highlightFeelingJson: string;
  avatarComment: string | null;
  levelChange: number;
  reviewedAt: string;
}

export interface MoodForecast {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  mainMood: string;
  moodTrendJson: string;
  emotionSummary: string | null;
  avatarComment: string | null;
  forecastedAt: string;
}

export interface Consultation {
  id: number;
  userId: number;
  title: string | null;
  content: string;
  selectedTheme: string | null;
  guidanceType: string | null;
  guidanceStepsJson: string;
  insightSummary: string | null;
  avatarReaction: string | null;
  isArchived: boolean;
  submittedAt: string;
}
