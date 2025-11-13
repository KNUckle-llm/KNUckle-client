"use client";

import { signIn } from "next-auth/react";
import { Github, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Header from "@/app/entities/common/Header";
import Footer from "@/app/entities/common/Footer";
import KakaoLoginButton from "@/app/entities/common/KakaoLoginButton";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(provider);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error("로그인 실패:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-white overflow-hidden">
      <div className={"max-w-4xl w-full mx-auto flex items-center justify-between  "}>
        <Header
          title="로그인"
          subTitle="KNUckle을 시작하기 위해 로그인해주세요"
          onBackClick={handleBack}
        />
      </div>

      <div className={" flex-grow mx-auto w-full flex justify-center items-center"}>
        <div className="w-full max-w-md px-8 flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="/assets/logo.png"
              width={80}
              height={80}
              alt="KNUckle 로고"
              className="rounded-full bg-neutral-300 mb-4"
            />
            <h1 className="text-2xl font-light text-center mb-2">KNUckle에 오신 것을 환영합니다</h1>
            <p className="text-neutral-500 text-center text-sm">
              계정에 로그인하고 공주대의 모든 정보를 편리하게 이용하세요
            </p>
          </div>

          <div className="w-full space-y-4">
            <KakaoLoginButton />
          </div>

          <div className="mt-8 text-xs text-center text-neutral-500">
            <p>
              계속 진행하면 KNUckle의{" "}
              <a href="#" className="underline">
                서비스 약관
              </a>
              과{" "}
              <a href="#" className="underline">
                개인정보 보호정책
              </a>
              에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignInPage;
