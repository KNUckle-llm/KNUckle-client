import { Button } from "@/components/ui/button";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { CircleDashed, CornerRightUp } from "lucide-react";

interface InThreadQuestionInputProps {
  handleSubmit: () => Promise<void>;
  register: UseFormRegister<any>;
  isThinking: boolean;
}

const InThreadQuestionInput = ({
  handleSubmit,
  register,
  isThinking,
}: InThreadQuestionInputProps) => {
  return (
    <div className=" mx-auto max-w-5xl w-full m-3 ">
      <div
        className={`rounded-lg bg-white p-2 border ${isThinking ? "border-emerald-600 shadow-xl shadow-emerald-600/20" : "border-black"} shadow-md focus:shadow-lg mx-3 relative overflow-hidden`}
      >
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={isThinking ? "너클이 생각 중이에요.." : "스레드에 추가 질문하기..."}
            disabled={isThinking}
            autoComplete={"off"}
            className="flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-300"
            {...register("question", {
              required: { value: true, message: "질문을 입력해주세요." },
              minLength: {
                value: 2,
                message: "질문은 최소 2글자 이상이어야 합니다.",
              },
              maxLength: {
                value: 1000,
                message: "질문은 최대 1000글자까지 입력할 수 있습니다.",
              },
            })}
          />
          <Button
            type="submit"
            className={` cursor-pointer bg-neutral-800 text-white ${isThinking ? "opacity-50 animate-pulse" : "hover:bg-neutral-700"}`}
            disabled={isThinking}
          >
            {isThinking ? (
              <CircleDashed className={"animate-spin "} size={12} />
            ) : (
              <CornerRightUp size={12} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InThreadQuestionInput;
