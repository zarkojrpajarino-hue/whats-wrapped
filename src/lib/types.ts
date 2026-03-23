export interface ParsedMessage {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  mediaType?: 'photo' | 'video' | 'audio' | 'sticker' | 'document' | 'gif';
}

export interface ParsedChat {
  messages: ParsedMessage[];
  participants: string[];
  startDate: Date;
  endDate: Date;
  format: 'ios' | 'android';
}

export interface Era {
  start: Date;
  end: Date;
  label: string;
  description: string;
  messageCount: number;
  avgPerDay: number;
}

export interface InflectionPoint {
  weekStart: Date;
  count: number;
  previousCount: number;
  jump: number;
}

export interface WrappedData {
  firstMessages: ParsedMessage[];
  totalMessages: number;
  totalDays: number;
  longestStreak: { days: number; start: Date; end: Date };
  peakDay: { date: Date; count: number };
  responseTimes: { name: string; avgMinutes: number }[];
  hourlyDistribution: number[];
  nightPercentage: number;
  messageSplit: { name: string; count: number; percentage: number }[];
  topWords: { name: string; words: { word: string; count: number }[] }[];
  mediaCount: { photos: number; videos: number; audios: number; stickers: number };
  eras: Era[];
  inflectionPoint: InflectionPoint;
  longestMessage: ParsedMessage;
  participants: string[];
  contactName: string;
}
