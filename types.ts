export enum DataType {
  UNKNOWN = 'UNKNOWN',
  JSON = 'JSON',
  MARKDOWN = 'MARKDOWN',
  TEXT = 'TEXT', // Plain text with newlines
  ASCII_UNICODE = 'ASCII_UNICODE', // Strings containing \uXXXX
}

export interface ParseResult {
  type: DataType;
  content: string | object;
  formattedText?: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}
