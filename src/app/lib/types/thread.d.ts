// types.ts
export interface Session {
  session_id: string;
  message_count: number;
  first_message: string;
  last_message: string;
  last_activity: number;
}

export interface IThreadResponse {
  thread_id: string;
  messages: Message[];
  summarization: string | null;
  language: string;
}

export interface Thread {
  thread_id: string;
  message_count: number;
  last_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Message 타입 정의
export interface Message {
  id: string;
  thread_id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string | null;
}

// API 응답 타입들
export interface ThreadListResponse {
  threads: Thread[];
}

export interface ThreadDetailResponse {
  thread_id: string;
  messages: Message[];
  summarization: string | null;
  language: string | null;
}

// 채팅 요청/응답 타입
export interface ChatRequest {
  question: string;
  thread_id?: string;
}

export interface ChatResponse {
  answer: string;
  thread_id: string;
}
