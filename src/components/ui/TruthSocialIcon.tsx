import React from "react";

export function TruthSocialIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* Truth Social T bar and stem */}
      <path d="M3 5h14v4h-5v11h-4V9H3V5z" />
      {/* Truth Social signature square dot */}
      <rect x="15" y="16" width="4" height="4" rx="0.5" />
    </svg>
  );
}
