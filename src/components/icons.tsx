/**
 * icons.tsx — Small inline SVG icons used by the mock UI panels.
 */

import React from 'react';

export const MicIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6c7076" strokeWidth="1.9" strokeLinecap="round">
    <rect x="9.4" y="3.5" width="5.2" height="10" rx="2.6" />
    <path d="M6 11.5a6 6 0 0 0 12 0" />
    <path d="M12 17.5v3" />
  </svg>
);

export const ClipIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6c7076" strokeWidth="1.9" strokeLinecap="round">
    <path d="M8.5 12.5l6.2-6.2a3.2 3.2 0 0 1 4.5 4.5l-7.6 7.6a5 5 0 0 1-7.1-7.1l7.3-7.3" />
  </svg>
);

export const GearIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.4 13a7.6 7.6 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5c-.6.2-1.2.6-1.7 1l-2.4-1-2 3.5L6.5 12a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.5 2.4-1c.5.4 1.1.8 1.7 1l.4 2.5h4l.4-2.5c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1zM12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z" />
  </svg>
);

export const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15.2 15.2 20 20" />
  </svg>
);

export const FormatIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
    <path d="M13.5 16.7h6.5M16.7 13.5v6.5" />
  </svg>
);
