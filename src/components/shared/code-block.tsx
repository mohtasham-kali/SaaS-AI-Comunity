
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      // Optionally, add a toast notification for copy failure
    });
  };

  return (
    <div className={cn("relative group rounded-lg border bg-muted/70 p-4 font-mono text-sm overflow-x-auto shadow-inner", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/70"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      {language && <span className="absolute top-2.5 left-3 text-xs text-muted-foreground uppercase font-sans tracking-wider">{language}</span>}
      <pre className="pt-5 whitespace-pre-wrap break-all">
        <code>{code}</code>
      </pre>
    </div>
  );
}
