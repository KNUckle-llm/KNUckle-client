// "use client";
// import React, { useEffect, useState } from "react";
// import {
// import PromptComparisonTable from './page';
// ChevronDown,
//   ChevronUp,
//   Clock,
//   Hash,
//   CheckCircle,
//   XCircle,
//   Database,
//   Calendar,
// } from "lucide-react";

// interface DatasetInfo {
//   id: string;
//   label: string;
//   data: any;
//   filename: string;
//   timestamp?: string;
// }

// const PromptComparisonTable = () => {
//   const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
//   const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(0);
//   const [expandedRows, setExpandedRows] = useState({});

//   // useEffect(() => {
//   //   // loadDatasets();
//   // }, []);

//   // const loadDatasets = () => {
//   //   // Webpack의 require.context를 사용하여 data 폴더의 모든 JSON 파일 가져오기
//   //   const dataContext = require.context("./data", false, /\.json$/);

//   //   const loadedDatasets: DatasetInfo[] = dataContext
//   //     .keys()
//   //     .map((key, index) => {
//   //       const data = dataContext(key);
//   //       const filename = key.replace("./", ""); // './filename.json' → 'filename.json'
//   //       const cleanFilename = filename.replace(".json", "");

//   //       // 파일명에서 시간 정보 추출 (예: prompt_comparison_20250606_220424.json)
//   //       const timeMatch = filename.match(/(\d{8}_\d{6})/);
//   //       const timeStr = timeMatch ? timeMatch[1] : "";
//   //       const formattedTime = timeStr
//   //         ? `${timeStr.slice(6, 8)}:${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}`
//   //         : `Dataset ${index + 1}`;

//   //       return {
//   //         id: `dataset_${index}`,
//   //         label: `${cleanFilename} (${formattedTime})`,
//   //         data: data.default || data, // ES6 모듈과 CommonJS 호환성
//   //         filename: filename,
//   //         timestamp: timeStr,
//   //       };
//   //     });

//   //   // 파일명 또는 시간순으로 정렬
//   //   loadedDatasets.sort((a, b) => a.filename.localeCompare(b.filename));

//   //   setDatasets(loadedDatasets);
//   // };

//   // 현재 선택된 데이터 (안전하게 접근)
//   const currentData = datasets.length > 0 ? datasets[selectedDatasetIndex]?.data : null;

//   // 데이터셋 변경 시 확장된 행들 초기화
//   const handleDatasetChange = (index: number) => {
//     setSelectedDatasetIndex(index);
//     setExpandedRows({});
//   };

//   // const toggleExpanded = (promptKey: string) => {
//   //   setExpandedRows((prev) => ({
//   //     ...prev,
//   //     [promptKey]: !prev[promptKey],
//   //   }));
//   // };

//   const formatTimestamp = (timestamp: Date | number | string) => {
//     return new Date(timestamp).toLocaleString("ko-KR");
//   };

//   const truncateText = (text: string, maxLength = 100) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };

//   const getResponseQualityColor = (charCount: number, responseTime: number) => {
//     if (charCount < 50) return "text-red-600 bg-red-50";
//     if (charCount > 400 && responseTime < 3) return "text-green-600 bg-green-50";
//     if (charCount > 200) return "text-blue-600 bg-blue-50";
//     return "text-yellow-600 bg-yellow-50";
//   };

//   if (!currentData) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-gray-500">데이터를 로딩 중...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white">
//       {/* 헤더 정보 */}
//       <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
//             🔍 프롬프트 비교 분석 결과
//           </h1>

//           {/* 데이터셋 선택 드롭다운 */}
//           <div className="flex items-center gap-3">
//             <Database className="w-5 h-5 text-gray-600" />
//             <select
//               value={selectedDatasetIndex}
//               onChange={(e) => handleDatasetChange(Number(e.target.value))}
//               className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {datasets.map((dataset, index) => (
//                 <option key={dataset.id} value={index}>
//                   {dataset.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <h3 className="font-semibold text-gray-700 mb-2">📝 질문</h3>
//             <p className="text-gray-800 text-lg">{currentData.question}</p>
//           </div>

//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <h3 className="font-semibold text-gray-700 mb-2">⏰ 실행 시간</h3>
//             <p className="text-gray-600">{formatTimestamp(currentData.timestamp)}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-lg p-3 text-center shadow-sm">
//             <div className="text-2xl font-bold text-blue-600">
//               {currentData.summary.total_variants}
//             </div>
//             <div className="text-sm text-gray-600">총 프롬프트 수</div>
//           </div>
//           <div className="bg-white rounded-lg p-3 text-center shadow-sm">
//             <div className="text-2xl font-bold text-green-600">
//               {currentData.summary.successful_responses}
//             </div>
//             <div className="text-sm text-gray-600">성공 응답</div>
//           </div>
//           <div className="bg-white rounded-lg p-3 text-center shadow-sm">
//             <div className="text-2xl font-bold text-red-600">
//               {currentData.summary.failed_responses}
//             </div>
//             <div className="text-sm text-gray-600">실패 응답</div>
//           </div>
//           <div className="bg-white rounded-lg p-3 text-center shadow-sm">
//             <div className="text-2xl font-bold text-purple-600">
//               {currentData.summary.success_rate}%
//             </div>
//             <div className="text-sm text-gray-600">성공률</div>
//           </div>
//         </div>
//       </div>

//       {/* 비교 테이블 */}
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   프롬프트 타입
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <Clock className="w-4 h-4 inline mr-1" />
//                   응답 시간
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <Hash className="w-4 h-4 inline mr-1" />
//                   문자 수
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   상태
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   응답 미리보기
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   액션
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {Object.entries(currentData.responses).map(([promptKey, response]) => (
//                 <React.Fragment key={promptKey}>
//                   <tr className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col">
//                         <div className="text-sm font-medium text-gray-900">{response.name}</div>
//                         <div className="text-xs text-gray-500">({promptKey})</div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <Clock className="w-4 h-4 text-gray-400 mr-1" />
//                         <span className="text-sm text-gray-900">
//                           {response.response_time.toFixed(2)}초
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResponseQualityColor(response.character_count, response.response_time)}`}
//                       >
//                         {response.character_count.toLocaleString()}자
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         {response.success ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
//                         ) : (
//                           <XCircle className="w-5 h-5 text-red-500 mr-1" />
//                         )}
//                         <span
//                           className={`text-sm ${response.success ? "text-green-800" : "text-red-800"}`}
//                         >
//                           {response.success ? "성공" : "실패"}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 max-w-md">
//                       <div className="text-sm text-gray-900">
//                         {truncateText(response.response, 80)}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => toggleExpanded(promptKey)}
//                         className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//                       >
//                         {expandedRows[promptKey] ? (
//                           <>
//                             <ChevronUp className="w-4 h-4 mr-1" />
//                             접기
//                           </>
//                         ) : (
//                           <>
//                             <ChevronDown className="w-4 h-4 mr-1" />
//                             전체보기
//                           </>
//                         )}
//                       </button>
//                     </td>
//                   </tr>

//                   {/* 확장된 응답 내용 */}
//                   {expandedRows[promptKey] && (
//                     <tr>
//                       <td colSpan={6} className="px-6 py-4 bg-gray-50">
//                         <div className="bg-white rounded-lg p-4 shadow-sm">
//                           <h4 className="text-lg font-semibold text-gray-800 mb-3">
//                             📄 {response.name} - 전체 응답
//                           </h4>
//                           <div className="prose max-w-none">
//                             <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border overflow-x-auto">
//                               {response.response}
//                             </pre>
//                           </div>
//                           <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
//                             <span>실행 시간: {formatTimestamp(response.timestamp)}</span>
//                             <span>문자 수: {response.character_count.toLocaleString()}자</span>
//                             <span>응답 시간: {response.response_time.toFixed(3)}초</span>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 성능 비교 차트 영역 */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ 응답 시간 비교</h3>
//           <div className="space-y-3">
//             {Object.entries(currentData.responses)
//               .sort(([, a], [, b]) => a.response_time - b.response_time)
//               .map(([key, response]) => (
//                 <div key={key} className="flex items-center">
//                   <div className="w-32 text-sm text-gray-600 truncate">{response.name}</div>
//                   <div className="flex-1 mx-3">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                         style={{
//                           width: `${(response.response_time / Math.max(...Object.values(currentData.responses).map((r) => r.response_time))) * 100}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-700 w-16 text-right">
//                     {response.response_time.toFixed(2)}s
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 응답 길이 비교</h3>
//           <div className="space-y-3">
//             {Object.entries(currentData.responses)
//               .sort(([, a], [, b]) => b.character_count - a.character_count)
//               .map(([key, response]) => (
//                 <div key={key} className="flex items-center">
//                   <div className="w-32 text-sm text-gray-600 truncate">{response.name}</div>
//                   <div className="flex-1 mx-3">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                         style={{
//                           width: `${(response.character_count / Math.max(...Object.values(currentData.responses).map((r) => r.character_count))) * 100}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-700 w-16 text-right">
//                     {response.character_count}자
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PromptComparisonTable;

const PromptComparisonTable = () => {
  return <div>Prompt Comparison Table Placeholder</div>;
};

export default PromptComparisonTable;
