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

export interface UserResponse {
  id: number;
  email: string;
  nickname: string | null;
  mbtiType: string | null;
  level: number;
  kindnessTotal: number;
  registeredAt: Date;
}

export interface PostResponse {
  id: number;
  userId: number;
  text: string;
  feelingScore: number;
  mood: WeatherMood;
  emotionKeywords: string[];
  isVisible: boolean;
  createdAt: Date;
}

export interface ThankResponse {
  id: number;
  postId: number;
  fromUserId: number;
  toUserId: number;
  message: string | null;
  kindnessScore: number;
  createdAt: Date;
}

export interface MBTIDiagnosisResponse {
  id: number;
  userId: number;
  diagnosisType: string;
  resultType: string;
  resultVectorJson: string;
  diagnosedAt: Date;
}

export interface NotificationResponse {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedObjectId: number | null;
  createdAt: Date;
}

export interface AvatarResponse {
  id: number;
  userId: number;
  fixedType: string | null;
  level: number;
  mood: string;
  expression: string;
  itemsJson: string;
  commentStyle: string;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  periodStart: Date;
  periodEnd: Date;
  summaryText: string | null;
  selectedPostIdsJson: string;
  highlightFeelingJson: string;
  avatarComment: string | null;
  levelChange: number;
  reviewedAt: Date;
}

export interface MoodForecastResponse {
  id: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  mainMood: string;
  moodTrendJson: string;
  emotionSummary: string | null;
  avatarComment: string | null;
  forecastedAt: Date;
}

export interface ConsultationResponse {
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
  submittedAt: Date;
}

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
