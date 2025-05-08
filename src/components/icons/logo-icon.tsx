import type { SVGProps } from 'react';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="120"
    height="30"
    role="img"
    aria-labelledby="codeAssistLogoTitle"
    {...props}
  >
    <title id="codeAssistLogoTitle">CodeAssist Logo</title>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--primary) / 0.7)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="200" height="50" rx="5" fill="transparent" />
    <path d="M25 10 L15 25 L25 40" stroke="url(#grad1)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 10 L50 25 L40 40" stroke="url(#grad1)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text
      x="60"
      y="35"
      fontFamily="var(--font-geist-mono, Menlo, Monaco, 'Courier New', monospace)"
      fontSize="30"
      fontWeight="bold"
      fill="hsl(var(--foreground))"
    >
      CodeAssist
    </text>
  </svg>
);

export default LogoIcon;
