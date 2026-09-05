import React from 'react';

export function BlueskyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      aria-hidden="true"
    >
      {/* Official Bluesky Butterfly Logo */}
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.5 1.999 1.5 5.058c0 .8.2 5.5 1.7 9.1 1.5 3.6 4.2 4.6 7.8 4-3.5 1.7-7 4-7 7.4 0 2.9 2.4 2.9 4.1 1.7 4.1-2.7 5.3-9.9 5.9-14.8.6 4.9 1.8 12.1 5.9 14.8 1.7 1.2 4.1 1.2 4.1-1.7 0-3.4-3.5-5.7-7-7.4 3.6.6 6.3-.4 7.8-4 1.5-3.6 1.7-8.3 1.7-9.1 0-3.059-1.066-4.114-3.702-2.253C16.046 4.747 13.087 8.686 12 10.8Z" />
    </svg>
  );
}
