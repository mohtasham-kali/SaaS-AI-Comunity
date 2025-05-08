import Link from 'next/link';
import { Github, Twitter, Copyright } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground mb-4 md:mb-0">
            <Copyright className="h-4 w-4 mr-1" />
            {new Date().getFullYear()} CodeAssist. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link href="#" passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" aria-label="CodeAssist GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" aria-label="CodeAssist Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Powered by AI & the Developer Community</p>
          <p className="mt-1">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link> | 
            <Link href="/terms-of-service" className="hover:text-primary transition-colors ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
