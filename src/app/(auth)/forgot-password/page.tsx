'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/components/auth/supabase-auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { resetPassword } = useSupabaseAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await resetPassword(email);

            if (error) {
                throw error;
            }

            setIsSubmitted(true);
            toast({
                title: "Email Sent",
                description: "If an account exists with this email, you will receive a password reset link.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center mb-2">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                {isSubmitted ? (
                    <CardContent className="space-y-4">
                        <div className="rounded-md bg-primary/10 p-4">
                            <p className="text-sm text-primary">
                                Check your email for a link to reset your password. If it doesn&apos;t appear within a few minutes, check your spam folder.
                            </p>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="/login">Return to Login</Link>
                        </Button>
                    </CardContent>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="name@example.com"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}
