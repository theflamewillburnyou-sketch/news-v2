export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface UserSettings {
  screenshotProtection: boolean;
  inactivityTimeout: number; // minutes
  burnOnReadDefault: boolean;
}

export interface UserProfile {
  uid: string;
  shadowId: string;
  mainPinHash: string;
  decoyPinHash?: string;
  failedAttempts: number;
  settings: UserSettings;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string; // Encrypted
  type: 'text' | 'media';
  timestamp: any;
  burnOnRead: boolean;
  readAt?: any;
  expiresAt?: any;
}

export interface ChatSession {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: any;
}
