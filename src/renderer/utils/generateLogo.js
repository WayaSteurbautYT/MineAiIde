import fs from 'fs';
import path from 'path';

/**
 * MineAI IDE Logo Generation (SVG for modern tech look)
 */
const logoSvg = `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" rx="40" fill="#0F172A"/>
  <path d="M60 60H140V140H60V60Z" stroke="#6366F1" stroke-width="8" stroke-linejoin="round"/>
  <path d="M80 80L120 120M120 80L80 120" stroke="#818CF8" stroke-width="6" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="20" fill="#6366F1" fill-opacity="0.2"/>
  <path d="M40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160" stroke="url(#paint0_linear)" stroke-width="4" stroke-dasharray="8 8"/>
  <defs>
    <linearGradient id="paint0_linear" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366F1"/>
      <stop offset="1" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
</svg>
`;

// Save the logo
// fs.writeFileSync('public/logo.svg', logoSvg);
