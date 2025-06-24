export interface ApiResponse<T> {
  timestamp: string;
  statusCode: number;
  status: string;
  message: string;
  payload: T | null;
  errorDetails?: Record<string, string[]>;
}
