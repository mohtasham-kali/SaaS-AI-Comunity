import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - CodeAssist',
  description: 'Login to your CodeAssist account.',
};

export default function LoginPage() {
  return (
    <div className="container flex h-[calc(100vh-10rem)] items-center justify-center py-12">
      <AuthForm mode="login" />
    </div>
  );
}
