"use client";

import { useState } from "react";
import Intro from "@/app/ui/intro";

export default function IntroPreview() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen">
      {showIntro && <Intro onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Website</h1>
            <p className="text-gray-600 mb-6">
              The intro animation has completed!
            </p>
            <button
              onClick={() => setShowIntro(true)}
              className="px-6 py-3 bg-[#2E5A7A] text-white rounded-lg hover:bg-[#234a62] transition-colors"
            >
              Replay Intro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
