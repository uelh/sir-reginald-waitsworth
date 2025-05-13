export interface WaitLogEntry {
  reason: string;
  timestamp: string;
}

export interface WaitData {
  [userId: string]: {
    count: number;
    logs: WaitLogEntry[];
  };
}
