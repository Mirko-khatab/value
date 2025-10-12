"use client";

import { Audio } from "@/app/lib/definitions";
import { useActionState } from "react";
import { createAudio, updateAudio, AudioState } from "@/app/lib/actions";
import { useState, useEffect } from "react";
import AudioUpload from "./audio-upload";
import { useRouter } from "next/navigation";

export default function AudioForm({ audio }: { audio?: Audio }) {
  const router = useRouter();
  const initialState: AudioState = { message: null, errors: {} };

  const updateAudioWithId = audio ? updateAudio.bind(null, audio.id) : null;

  const [state, dispatch] = useActionState(
    updateAudioWithId || createAudio,
    initialState
  );

  const [audioUrl, setAudioUrl] = useState(audio?.audio_url || "");
  const [isActive, setIsActive] = useState(audio?.is_active ?? true);
  const [useFor, setUseFor] = useState<"landing" | "intro" | "both">(
    audio?.use_for || "landing"
  );

  useEffect(() => {
    if (state?.message && !state?.errors) {
      router.push("/dashboard/audios");
    }
  }, [state, router]);

  return (
    <form action={dispatch} className="space-y-6">
      {/* Title in Kurdish */}
      <div>
        <label
          htmlFor="title_ku"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Title (Kurdish)
        </label>
        <input
          id="title_ku"
          name="title_ku"
          type="text"
          defaultValue={audio?.title_ku}
          placeholder="Enter title in Kurdish"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          aria-describedby="title_ku-error"
        />
        {state?.errors?.title_ku && (
          <div id="title_ku-error" className="text-red-500 text-sm mt-1">
            {state.errors.title_ku}
          </div>
        )}
      </div>

      {/* Title in English */}
      <div>
        <label
          htmlFor="title_en"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Title (English)
        </label>
        <input
          id="title_en"
          name="title_en"
          type="text"
          defaultValue={audio?.title_en}
          placeholder="Enter title in English"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          aria-describedby="title_en-error"
        />
        {state?.errors?.title_en && (
          <div id="title_en-error" className="text-red-500 text-sm mt-1">
            {state.errors.title_en}
          </div>
        )}
      </div>

      {/* Title in Arabic */}
      <div>
        <label
          htmlFor="title_ar"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Title (Arabic)
        </label>
        <input
          id="title_ar"
          name="title_ar"
          type="text"
          defaultValue={audio?.title_ar}
          placeholder="Enter title in Arabic"
          dir="rtl"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          aria-describedby="title_ar-error"
        />
        {state?.errors?.title_ar && (
          <div id="title_ar-error" className="text-red-500 text-sm mt-1">
            {state.errors.title_ar}
          </div>
        )}
      </div>

      {/* Audio Upload */}
      <AudioUpload onUploadComplete={setAudioUrl} currentAudio={audioUrl} />
      <input type="hidden" name="audio_url" value={audioUrl} />
      {state?.errors?.audio_url && (
        <div className="text-red-500 text-sm">{state.errors.audio_url}</div>
      )}

      {/* Use For */}
      <div>
        <label
          htmlFor="use_for"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Use For
        </label>
        <select
          id="use_for"
          name="use_for"
          value={useFor}
          onChange={(e) =>
            setUseFor(e.target.value as "landing" | "intro" | "both")
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="landing">Landing Page Only</option>
          <option value="intro">Intro Only</option>
          <option value="both">Both</option>
        </select>
        {state?.errors?.use_for && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.use_for}
          </div>
        )}
      </div>

      {/* Is Active */}
      <div className="flex items-center gap-3">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          value={isActive ? "true" : "false"}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Active
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!audioUrl}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {audio ? "Update Audio" : "Create Audio"}
        </button>
      </div>

      {state?.message && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {state.message}
        </div>
      )}
    </form>
  );
}
