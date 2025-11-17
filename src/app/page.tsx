"use client";
import { useRef, useState } from "react";
import QuestionInput from "@/app/entities/common/QuestionInput";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "@/app/entities/common/Footer";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import useSearchStore from "@/app/store/useSearchStore";

import { useSession } from "next-auth/react";

export default function Home() {
  const [isThinking, setIsThinking] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, reset } = useForm<{
    question: string;
  }>();
  const { setSearchQuery, setIsSearching, setSessionId } = useSearchStore();
  const { data: session } = useSession();
  const inputText = useRef("");
  inputText.current = watch("question") || "";

  const onSubmit = handleSubmit(async (data: { question: string }) => {
    try {
      const { question } = data;
      if (!question) return;
      setIsThinking(true);
      // 세션 아이디 생성 후 전역상태로 저장 후 이동
      const session_id = uuidv4();
      setSearchQuery(question);
      setIsSearching(true);
      setSessionId(session_id);
      reset();
      router.push("search/" + session_id);
    } catch (error) {
      console.error("채팅 전송 실패", error);
    } finally {
      setIsThinking(false);
    }
  });

  const welcomeMessages = {
    morning: {
      time: "morning",
      messages: ["좋은 아침입니다."],
    },
    afternoon: {
      time: "afternoon",
      messages: ["좋은 오후입니다."],
    },
    evening: {
      time: "evening",
      messages: ["좋은 저녁입니다."],
    },
  };

  const currentHour = new Date().getHours();

  const getWelcomeMessage = () => {
    const userName = session?.user?.name;
    const baseMessage = (() => {
      if (currentHour >= 6 && currentHour < 12) {
        return welcomeMessages.morning.messages[0];
      } else if (currentHour >= 12 && currentHour < 18) {
        return welcomeMessages.afternoon.messages[0];
      } else {
        return welcomeMessages.evening.messages[0];
      }
    })();
    return userName ? `${userName}님, ${baseMessage}` : baseMessage;
  };

  return (
    <div className={"relative h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-4xl xl:text-5xl 2xl:text-6xl font-semibold mb-8"}>
        {getWelcomeMessage() || "환영합니다."}
      </h1>
      <QuestionInput thinking={isThinking} handleSubmit={onSubmit} register={register} />
      <Footer />
    </div>
  );
}
