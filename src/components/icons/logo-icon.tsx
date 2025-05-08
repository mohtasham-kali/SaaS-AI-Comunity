import type { SVGProps } from 'react';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50" // Adjusted viewBox for new logo
    role="img"
    aria-labelledby="codeAssistLogoTitle"
    {...props}
  >
    <title id="codeAssistLogoTitle">CodeAssist Logo</title>
    {/* Symbol ">_" */}
    <text
      x="10" // Adjusted position
      y="35" // Adjusted position
      fontFamily="var(--font-geist-mono, Menlo, Monaco, 'Courier New', monospace)"
      fontSize="32" // Adjusted size
      fontWeight="bold"
      fill="hsl(var(--primary))" // Use primary color for the symbol
    >
      &gt;_
    </text>
    {/* Text "CodeAssist" */}
    <text
      x="55" // Adjusted position to follow symbol
      y="35" // Adjusted position
      fontFamily="var(--font-geist-sans, system-ui, sans-serif)" // Using Geist Sans for text part
      fontSize="28" // Adjusted size
      fontWeight="bold"
      fill="hsl(var(--foreground))" // Use foreground color for the text
    >
      CodeAssist
    </text>
  </svg>
);

export default LogoIcon;
