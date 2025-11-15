import AnimatedText from "@/app/entities/common/AnimatedText";
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { IThreadResponse, Message } from "@/app/lib/types/thread";
import ChatTools from "@/app/entities/thread/ChatTools";
import RelativeQuestions from "@/app/entities/thread/RelativeQuestions";
import PulseIndicator from "@/app/entities/loading/PulseIndicator";

interface QuestionThreadProps {
  result: IThreadResponse | null;
  copyComplete: boolean;
  onClick: (content: string) => void;
  onClickRelative: (e: FormEvent, query: string) => void;
  scrollToEnd: (ref: RefObject<HTMLDivElement>) => void;
  isStreaming?: boolean;
}

const QuestionThread = ({
  result,
  copyComplete,
  onClick,
  onClickRelative,
  scrollToEnd,
  isStreaming,
}: QuestionThreadProps) => {
  const relativeQuestions = [
    "공주대는 어떻게 탄생했나요?",
    "공주대의 캠퍼스에는 어떤 것들이 있나요?",
    "공주대의 학생소식에는 무슨 소식이 올라오나요?",
  ];
  const questionEndRef = useRef<HTMLDivElement>(null);

  const isLoading = !result;

  const renderQuestion = (message: Message) => {
    return (
      message.role === "user" &&
      message.content && (
        <>
          <h2 className={"transition animate-in duration-500 fade-in text-3xl  mb-4"}>
            {message.content}
          </h2>
          <hr className={"w-full mb-8"} />
        </>
      )
    );
  };
  const renderAnswer = (message: Message, isFinished: boolean) => {
    return (
      message.role === "ai" &&
      message.content && (
        <AnimatedText text={message.content} speed={10} isFinished={isFinished || false} />
      )
    );
  };

  useEffect(() => {
    if (questionEndRef.current !== null && (result?.messages ?? []).length > 0 && isStreaming) {
      scrollToEnd(questionEndRef as RefObject<HTMLDivElement>);
    }
  }, [isStreaming, (result?.messages ?? [])?.length]);

  if (isLoading || !result) {
    return (
      <div
        className={
          "max-w-5xl mx-auto w-full flex flex-1 flex-col items-start justify-start p-10 overflow-y-scroll"
        }
      >
        <PulseIndicator />
      </div>
    );
  }

  return (
    <div
      className={
        "max-w-5xl mx-auto w-full flex flex-1 flex-col items-start justify-start p-10 overflow-y-scroll"
      }
      ref={questionEndRef}
    >
      {result.messages.map((message, idx) => {
        if (message.role !== "user" && message.role !== "ai") return null;
        return (
          <div
            key={idx}
            className={`${message.role === "user" ? "pt-8 pb-0" : "pt-0 pb-8"} w-full`}
          >
            {renderQuestion(message)}
            {renderAnswer(message, idx !== result.messages.length - 1)}
            {idx === result.messages.length - 1 && message.role === "user" && <PulseIndicator />}
            {!isStreaming && message.role === "ai" && (
              <div className={"w-full mt-8"}>
                <ChatTools
                  copyComplete={copyComplete}
                  onCopyClick={onClick}
                  content={message.content || ""}
                />
                <RelativeQuestions
                  isLast={idx === result.messages.length - 1}
                  onClickRelative={onClickRelative}
                  relativeQuestions={relativeQuestions}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionThread;
