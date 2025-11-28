// // // "use client";

// // // import { Button } from "./ui/button";

// // // interface WelcomePageProps {
// // //   onGetStarted: () => void;
// // //   onDemoMode: () => void;
// // // }

// // // export default function WelcomePage({ onGetStarted, onDemoMode }: WelcomePageProps) {
// // //   return (
// // //     <div className="flex flex-col justify-between min-h-screen px-6 pt-20 pb-10 text-center">

// // //       {/* Top section with spacing */}
// // //       <div>
// // //         <h1 className="text-4xl font-bold mb-8">Welcome to OnTrack!</h1>

// // //         <p className="text-lg text-gray-700 max-w-xl mx-auto mb-16">
// // //           OnTrack helps you stay organized, focused, and confident as you 
// // //           navigate tasks, goals, and daily routines. Let’s walk you through 
// // //           a quick setup to get everything tuned to your needs.
// // //         </p>
// // //       </div>

// // //       {/* Buttons pinned at bottom */}
// // //       <div className="flex flex-col items-center w-full">
// // //         <Button
// // //           onClick={onGetStarted}
// // //           className="w-full py-4 mb-4 rounded-xl text-white text-lg shadow transition"
// // //           style={{ backgroundColor: "#37A6B2" }}
// // //         >
// // //           Get Started
// // //         </Button>
    
// // //         <button
// // //           onClick={onDemoMode}
// // //           className="underline hover:text-blue-800 transition"
// // //           style={{color: "#37A6B2"}}
// // //         >
// // //           Try Demo Mode
// // //         </button>

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { Button } from "./ui/button";

// // interface WelcomePageProps {
// //   onGetStarted: () => void;
// //   onDemoMode: () => void;
// // }

// // export default function WelcomePage({ onGetStarted, onDemoMode }: WelcomePageProps) {
// //   return (
// //     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-center px-6">
// //       <div className="w-full max-w-md rounded-3xl p-8 shadow-lg border border-blue-200 text-center space-y-6">
// //         <h1 className="text-[#312E81] text-2xl font-bold">
// //           Welcome to OnTrack!
// //         </h1>
// //         <p className="text-[#4C4799] text-sm max-w-md mx-auto">
// //           OnTrack helps you stay organized, focused, and confident as you 
// //           navigate tasks, goals, and daily routines. Let’s walk you through 
// //           a quick setup to get everything tuned to your needs.
// //         </p>

// //         <div className="flex flex-col gap-4">
// //           <Button
// //             onClick={onGetStarted}
// //             className="w-full h-12 bg-[#312E81] text-[#F8FAFC] hover:bg-[#4338CA] rounded-xl text-lg shadow transition"
// //           >
// //             Get Started
// //           </Button>
// //           <Button
// //             onClick={onDemoMode}
// //             variant="outline"
// //             className="w-full h-12 border-[#312E81] text-[#312E81] hover:bg-[#312E81]/10 rounded-xl"
// //           >
// //             Try Demo Mode
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { Button } from "./ui/button";

// interface WelcomePageProps {
//   onGetStarted: () => void;
//   onDemoMode: () => void;
// }

// export default function WelcomePage({ onGetStarted, onDemoMode }: WelcomePageProps) {
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col justify-between px-6 pt-20 pb-10">
//       {/* Top section */}
//       <div className="text-center space-y-4">
//         <h1 className="text-[#312E81] text-2xl font-bold">
//           Welcome to OnTrack!
//         </h1>
//         <p className="text-[#4C4799] text-sm max-w-md mx-auto">
//           OnTrack helps you stay organized, focused, and confident as you 
//           navigate tasks, goals, and daily routines. Let’s walk you through 
//           a quick setup to get everything tuned to your needs.
//         </p>
//       </div>

//       {/* Buttons pinned at bottom */}
//       <div className="flex flex-col items-center w-full gap-6">
//         <Button
//           onClick={onGetStarted}
//           className="w-full h-12 bg-white text-[#312E81] hover:bg-gray-100 rounded-xl text-lg transition"
//         >
//           Get Started
//         </Button>
//         <button
//           onClick={onDemoMode}
//           className="underline text-[#312E81] hover:text-[#4338CA] transition text-sm font-medium"
//         >
//           Try Demo Mode
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "./ui/button";

interface WelcomePageProps {
  onGetStarted: () => void;
  onDemoMode: () => void;
}

export default function WelcomePage({ onGetStarted, onDemoMode }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col justify-between px-6 pt-20 pb-10">
      {/* Centered text section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
        <h1 className="text-[#312E81] text-2xl font-bold">
          Welcome to OnTrack!
        </h1>
        <p className="text-[#4C4799] text-sm max-w-md">
          OnTrack helps you stay organized, focused, and confident as you 
          navigate tasks, goals, and daily routines. Let’s walk you through 
          a quick setup to get everything tuned to your needs.
        </p>
      </div>

      {/* Buttons pinned at bottom */}
      <div className="flex flex-col items-center w-full gap-10">
        <Button
          onClick={onGetStarted}
          className="w-full h-12 bg-white text-[#312E81] hover:bg-gray-100 rounded-xl text-lg transition border border-blue-200"
        >
          Get Started
        </Button>
        <Button
          onClick={onDemoMode}
          className="w-full h-12 bg-transparent text-[#312E81] hover:bg-gray-100 rounded-xl text-sm transition"
        >
          Try Demo Mode
        </Button>
      </div>
    </div>
  );
}
