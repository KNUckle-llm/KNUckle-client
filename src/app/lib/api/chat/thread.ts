import { IThreadResponse, Thread } from "../../types/thread";
import api from "../axios";

export const getThreadData = async (threadId: string) => {
  try {
    const response = await api.get<IThreadResponse>(`/chat/thread/${threadId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch thread data", error);
    throw error;
  }
};

export const getAllThreads = async () => {
  try {
    const response = await api.get<{ threads: Thread[] }>(`/chat/threads`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all threads", error);
    throw error;
  }
};
