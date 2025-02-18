export interface User {
  username: string;
  tasksAdded: number;
  tasksSupported: number;
  balance: number;
  walletAddress: string;
}

export interface Link {
  username: string;
  platform: 'Twitter' | 'Reddit' | 'Facebook' | 'TikTok' | 'YouTube' | 'Other';
  timestamp: string;
  url: string;
  groupInfo: {
    name: string;
    id: string;
  };
  rewards: {
    add: number;
    support: number;
  };
  reports: string[];
}

export interface Withdrawal {
  username: string;
  amount: number;
  walletAddress: string;
  timestamp: string;
}

export interface Admin {
  username: string;
}
