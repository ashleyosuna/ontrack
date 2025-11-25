"use client";

import { useEffect } from "react";

interface LoadingPageProps {
  onFinishLoading: () => void;
}

export default function LoadingPage({ onFinishLoading }: LoadingPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinishLoading();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinishLoading]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>

      <p className="font-semibold mt-6 leading-relaxed">
        Smart Suggestions will highlight habits you might want to track — helping you
        discover what you don’t know yet!
      </p>
    </div>
  );
}

// "use client";

// import { useEffect } from "react";

// interface LoadingPageProps {
//   onFinishLoading: () => void;
// }

// export default function LoadingPage({ onFinishLoading }: LoadingPageProps) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onFinishLoading();
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [onFinishLoading]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen px-8 text-center">

//       {/* BIG CLEAR LOADING SPINNER */}
//       <div className="relative w-14 h-14">
//         <div className="absolute inset-0 rounded-full border-4 border-gray-300" />
//         <div className="absolute inset-0 rounded-full border-4 border-[#37A6B2] border-t-transparent animate-spin" />
//       </div>

//       <p className="text-xl font-semibold mt-8 leading-relaxed max-w-md">
//         Smart Suggestions will highlight habits you might want to track —
//         helping you discover useful things you haven’t thought of yet.
//       </p>
//     </div>
//   );
// }
