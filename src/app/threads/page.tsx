"use client";

import React from "react";
import { Search, MoreHorizontal, Plus, Clock, Book } from "lucide-react";
import Header from "@/app/entities/common/Header";
import Link from "next/link";
import useDataFetch, { useDataFetchConfig } from "@/app/hooks/common/useDataFetch";
import SVGLoadingSpinner from "@/app/entities/loading/SVGLoadingSpinner";
import { Session } from "@/app/lib/types/thread";
import { exampleSessions } from "@/app/threads/data";
import ServerErrorFallback from "@/app/entities/error/ServerErrorFallback";
import { useQuery } from "react-query";
import { getAllThreads } from "../lib/api/chat/thread";

const LibraryPage = () => {
  const serverURL = process.env.NEXT_PUBLIC_AI_SERVER_URL;

  if (!serverURL) {
    console.error("서버 URL 환경변수가 설정되지 않았습니다!!");
  }

  const { data, error, isLoading } = useQuery("threads", getAllThreads);

  const threads = data?.threads ?? exampleSessions;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SVGLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className={"max-w-4xl mx-auto flex items-center justify-between  "}>
        <Header
          title={"라이브러리"}
          subTitle={"이전에 나눈 대화를 모아보세요"}
          icon={<Book size={20} />}
        />
        <div className="relative w-80 flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="스레드 검색..."
          />
        </div>
      </div>

      {/* 탭 바 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button className="px-4 py-3 text-sm font-medium text-gray-800 border-b-2 border-gray-800">
                스레드
              </button>
            </div>
            <div className="flex items-center">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <MoreHorizontal size={18} />
              </button>
              <button className="p-2 ml-1 text-gray-500 hover:bg-gray-100 rounded-full">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {data && threads.length > 0 ? (
            threads.map((thread) => (
              <Link
                href={"/search/" + thread.thread_id}
                key={thread.thread_id}
                className="w-full h-full bg-white "
              >
                <div className="p-4 border border-gray-200 rounded-lg  overflow-hidden hover:shadow-sm transition-shadow duration-200">
                  <h2 className="text-base font-medium text-gray-900 mb-1">
                    {thread.last_message}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{thread.last_message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{thread.updated_at || new Date().toLocaleDateString()}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Book size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 스레드가 없습니다</h3>
              <p className="text-sm text-gray-500">새로운 대화를 시작해보세요</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
