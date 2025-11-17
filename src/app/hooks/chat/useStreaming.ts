import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IThreadResponse, Message } from "@/app/lib/types/thread";
import { SubmitHandler } from "react-hook-form";

interface StreamingMessage {
  type: "start" | "chunk" | "end" | "error";
  content?: string;
  message?: string;
  timestamp: string;
}

interface IData {
  question: string;
}

interface useStreamingProps {
  setResult: Dispatch<SetStateAction<IThreadResponse | null>>;
  scrollToBottom: () => void;
  threadId: string | null;
  resetForm: () => void;
  onCompleteStreaming?: () => void;
}

const useStreaming = ({
  setResult,
  scrollToBottom,
  threadId,
  resetForm,
  onCompleteStreaming,
}: useStreamingProps) => {
  const [isThinking, setIsThinking] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const serverUrl = process.env.NEXT_PUBLIC_AI_SERVER_URL || "http://localhost:8000";

  const [streamingState, setStreamingState] = useState({
    isStreaming: false,
    currentResponse: "",
    streamingMessageId: "",
    error: null as string | null,
  });

  useEffect(() => {
    if (streamingState.streamingMessageId && streamingState.currentResponse) {
      setResult((prev) => {
        if (!prev) return prev;

        const updatedMessages = [...prev.messages];
        const streamingMessageIndex = updatedMessages.findIndex(
          (msg) => msg.id === streamingState.streamingMessageId
        );

        if (streamingMessageIndex >= 0) {
          updatedMessages[streamingMessageIndex] = {
            ...updatedMessages[streamingMessageIndex],
            content: streamingState.currentResponse,
          };
        } else {
          const newStreamingMessage: Message = {
            id: streamingState.streamingMessageId,
            thread_id: threadId as string,
            role: "ai",
            content: streamingState.currentResponse,
            timestamp: new Date().toISOString(),
          };
          updatedMessages.push(newStreamingMessage);
        }

        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    }

    if (!streamingState.isStreaming && streamingState.streamingMessageId) {
      // 스트리밍 상태 초기화
      setStreamingState({
        isStreaming: false,
        currentResponse: "",
        streamingMessageId: "",
        error: null,
      });
    }
  }, [
    streamingState.isStreaming,
    streamingState.currentResponse,
    streamingState.streamingMessageId,
    threadId,
  ]);

  const onSubmit: SubmitHandler<IData> = async (data: IData) => {
    const { question } = data;

    if (!question || !question.trim()) return;

    resetForm();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    resetForm();
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      thread_id: threadId as string,
      role: "user",
      content: question.trim(),
      timestamp: new Date().toISOString(),
    };
    setIsThinking(true);
    setResult((prev) => {
      const updatedMessages = prev?.messages || [];
      updatedMessages.push(userMessage);
      return {
        ...(prev || {
          thread_id: threadId as string,
          summarization: null,
          language: "ko",
        }),
        messages: updatedMessages,
      };
    });
    setTimeout(scrollToBottom, 100);

    try {
      const response = await fetch(`${serverUrl}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          thread_id: threadId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("응답 스트림을 읽을 수 없습니다");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: StreamingMessage = JSON.parse(line.slice(6));
              switch (data.type) {
                case "start":
                  setStreamingState({
                    isStreaming: true,
                    currentResponse: "",
                    streamingMessageId: `ai_${Date.now()}`,
                    error: null,
                  });
                  setIsThinking(false);
                  break;
                case "chunk":
                  if (data.content) {
                    setStreamingState((prev) => ({
                      ...prev,
                      currentResponse: prev.currentResponse + data.content,
                    }));
                  }
                  break;
                case "end":
                  setStreamingState((prev) => ({
                    ...prev,
                    isStreaming: false,
                  }));
                  break;
                case "error":
                  setStreamingState((prev) => ({
                    ...prev,
                    isStreaming: false,
                    error: data.message || "알 수 없는 오류가 발생했습니다",
                  }));
                  break;
              }
            } catch (parseError) {
              console.error("JSON 파싱 오류:", parseError);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("스트리밍 오류:", error);

      if (error.name === "AbortError") {
        // 요청이 취소되었습니다
      } else {
        setStreamingState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error.message || "네트워크 오류가 발생했습니다",
        }));
      }
    } finally {
      setIsThinking(false);
      if (onCompleteStreaming) onCompleteStreaming();
    }
  };

  useEffect(() => {
    if (streamingState.currentResponse) {
      setTimeout(scrollToBottom, 100);
    }
  }, [streamingState.currentResponse, scrollToBottom]);

  return { isThinking, onSubmit, streamingState };
};

export default useStreaming;
