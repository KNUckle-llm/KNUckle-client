// import dbConnect from "@/app/api/config/db";
// import { ThreadModel } from "@/app/lib/models/thread";
// import { Session } from "@/app/lib/types/thread";

// export const POST = async (req: Request) => {
//   const { inputText } = await req.json();
//   await dbConnect();

//   if (!inputText) {
//     return Response.json({ message: "입력값이 없습니다." }, { status: 400 });
//   }

//   const newThread: Omit<Session, "id"> = {
//     userId: "user123", // 예시로 고정된 값 사용
//     messages: [
//       {
//         id: "msg1",
//         content: inputText,
//         role: "user",
//         createdAt: new Date(),
//       },
//     ],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     isArchived: false,
//   };

//   const result = await ThreadModel.create(newThread);

//   console.log("생성 결과,", result);
//   return Response.json(result);
// };

export const POST = async (req: Request) => {
  return Response.json({ message: "This endpoint is under construction." }, { status: 501 });
};
