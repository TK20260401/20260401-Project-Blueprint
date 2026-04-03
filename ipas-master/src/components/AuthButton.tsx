"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === "loading") {
    return (
      <div className="px-4 py-2 rounded-xl bg-white/20 text-white text-sm animate-pulse">
        ...
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-8 h-8 rounded-full border-2 border-white/50"
          />
        )}
        <span className="text-white text-sm font-bold hidden sm:inline">
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold
                     hover:bg-white/30 transition-all"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((p) => !p)}
        className="px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-bold
                   hover:bg-white/30 backdrop-blur-sm transition-all"
      >
        ログイン
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl p-2 z-50 min-w-[180px]">
          <button
            onClick={() => signIn("github")}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-gray-800
                       hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHubでログイン
          </button>
        </div>
      )}
    </div>
  );
}
