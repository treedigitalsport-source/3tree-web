import React from 'react';

export function RumbleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      aria-hidden="true"
    >
      {/* Official Rumble Brand Shape */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.5V7.5l6.5 4.5-6.5 4.5z" opacity="0" />
      <path d="M21.4 8.2c-.8-1.5-2.3-2.4-4-2.4-.6 0-1.2.1-1.8.4L5.8 10.9c-1.6.7-2.6 2.2-2.6 3.9 0 1.7 1 3.2 2.6 3.9l9.8 4.7c.6.3 1.2.4 1.8.4 1.7 0 3.2-.9 4-2.4 1.1-2.1.4-4.7-1.7-5.8l-5.6-3 5.6-3c2.1-1.1 2.8-3.7 1.7-5.8z" />
    </svg>
  );
}
