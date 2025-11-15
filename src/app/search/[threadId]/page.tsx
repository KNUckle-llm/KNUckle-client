"use client";

import QuestionThread from "@/app/entities/thread/QuestionThread";
import React, { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useScrollStore } from "@/app/store/useScrollStore";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import InThreadQuestionInput from "@/app/entities/thread/InThreadQuestionInput";
import ErrorBox from "@/app/entities/error/ErrorBox";
import useStreaming from "@/app/hooks/chat/useStreaming";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "react-query";
import { getThreadData } from "@/app/lib/api/chat/thread";
import { IThreadResponse } from "@/app/lib/types/thread";
import useSearchStore from "@/app/store/useSearchStore";

interface SearchPageProps {}

interface IData {
  question: string;
}

const SearchPage = ({}: SearchPageProps) => {
  const [copyComplete, setCopyComplete] = useState(false);
  const [result, setResult] = useState<IThreadResponse | null>(null);
  const { searchQuery, isSearching, setIsSearching } = useSearchStore();

  // Form
  const {
    handleSubmit,
    register,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm();

  const inputText = useRef("");
  inputText.current = watch("question") || "";
  const mainRef = useScrollStore((state) => state.mainRef);
  const params = useParams();
  const threadId = params.threadId;

  const { data, isLoading } = useQuery(
    ["threadData", threadId],
    () => getThreadData(threadId as string),
    {
      enabled: !!threadId,
    }
  );

  useEffect(() => {
    if (data) {
      setResult(data);
    }
  }, [data]);

  const scrollToBottom = () => {
    if (mainRef && mainRef.current) {
      mainRef.current?.children[0]?.children[0].scrollTo({
        top: mainRef.current?.children[0]?.children[0].scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const onCompleteStreaming = () => {
    scrollToBottom();
  };

  const { onSubmit, streamingState, isThinking } = useStreaming({
    scrollToBottom,
    resetForm,
    setResult,
    threadId: threadId as string,
    onCompleteStreaming,
  });

  useEffect(() => {
    if (isSearching && searchQuery) {
      onSubmit({ question: searchQuery });
      setIsSearching(false);
    }
  }, [isSearching, searchQuery, onSubmit, setIsSearching]);

  const scrollToEnd = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content || "").then(() => {
      setCopyComplete(true);
    });
    setCopyComplete(true);
    setTimeout(() => {
      setCopyComplete(false);
    }, 2000);
  };

  const onClickRelative = (e: FormEvent, relativeQuestion: string) => {
    e.preventDefault();
    if (!relativeQuestion) return;

    onSubmit({ question: relativeQuestion });
  };

  if (isLoading) {
    return (
      <div
        className={
          "max-w-5xl mx-auto w-full flex flex-1 flex-col items-start justify-start p-10 overflow-y-scroll"
        }
      >
        <Skeleton className={"h-10 w-1/3 mb-4 mt-8"} />
        <hr className={"w-full mb-8"} />
        <Skeleton className={"h-4 w-1/2 mb-6 pb-8"} />
        <Skeleton className={"h-4 w-2/3 mb-6 pb-8"} />
        <Skeleton className={"h-4 w-1/4 mb-6 pb-8"} />
      </div>
    );
  }

  if (streamingState.error) {
    return <ErrorBox error={streamingState.error} />;
  }

  return (
    <section
      suppressHydrationWarning={true}
      className={"relative flex flex-col h-full mx-auto max-w-5xl w-full"}
    >
      <QuestionThread
        result={result!}
        copyComplete={copyComplete}
        onClick={copyToClipboard}
        onClickRelative={onClickRelative}
        scrollToEnd={scrollToEnd}
        isStreaming={streamingState.isStreaming}
      />

      <InThreadQuestionInput
        isThinking={isThinking || streamingState.isStreaming}
        handleSubmit={handleSubmit(onSubmit as SubmitHandler<any>)}
        register={register}
      />
    </section>
  );
};

export default SearchPage;
