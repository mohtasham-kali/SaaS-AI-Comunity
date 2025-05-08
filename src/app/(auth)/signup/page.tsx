import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - CodeAssist',
  description: 'Create a new CodeAssist account.',
};

export default function SignupPage() {
  return (
    <div className="container flex h-[calc(100vh-10rem)] items-center justify-center py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
