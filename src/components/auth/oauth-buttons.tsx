'use client';

import { Button } from '@/components/ui/button';
import { Github, ChromeIcon } from 'lucide-react'; // Using ChromeIcon as a placeholder for Google
import { useAuth } from './auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export function OAuthButtons() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    // Mock OAuth login. In a real app, this would redirect to Firebase OAuth.
    // For demo, we'll try to log in with a predefined mock user.
    let success = false;
    if (provider === 'github') {
       // Try logging in with a mock user that might represent a GitHub user.
       // Assuming 'user1' is our mock GitHub user for demo.
      success = await login('user1'); 
    } else if (provider === 'google') {
      // Assuming 'user2' is our mock Google user for demo.
      success = await login('user2');
    }

    if (success) {
      toast({ title: `Logged in with ${provider}`, description: "Redirecting..." });
      router.push('/');
    } else {
      toast({ title: 'OAuth Login Failed', description: `Could not log in with ${provider}.`, variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={() => handleOAuthLogin('google')}>
        <ChromeIcon className="mr-2 h-4 w-4" /> {/* Placeholder for Google Icon */}
        Google
      </Button>
      <Button variant="outline" onClick={() => handleOAuthLogin('github')}>
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}
