'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isSuspended = error === 'ACCOUNT_SUSPENDED' || error === 'OAuthCallbackError';

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
                callbackUrl,
            });

            if (res?.error) {
                toast.error('Invalid email or password');
            } else {
                toast.success('Signed in successfully');
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            toast.error('Something went wrong during sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signIn('google', { callbackUrl });
        } catch (error) {
            console.error("Login failed", error);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-border/40 bg-card/60 backdrop-blur-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Coffee className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to continue your coffee journey.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isSuspended && (
                            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 text-center">
                                Your account is currently suspended. Please try again later or contact support.
                            </div>
                        )}

                        <form onSubmit={handleCredentialsLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    suppressHydrationWarning
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-11 transition-all hover:bg-primary/5 border-border/60"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Google
                        </Button>

                        {/* Development Helper */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 space-y-3 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground border border-border/40">
                                <div>
                                    <p className="font-semibold mb-1">Dev Mode: Mock Admin</p>
                                    <div className="flex justify-between items-center bg-background p-2 rounded border border-border/20 mb-1">
                                        <code>admin@coffee.com</code>
                                        <span className="text-muted-foreground/50">|</span>
                                        <code>admin123</code>
                                    </div>
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 text-xs w-full justify-end text-primary"
                                        onClick={() => {
                                            setEmail('admin@coffee.com');
                                            setPassword('admin123');
                                        }}
                                    >
                                        Auto-fill Admin
                                    </Button>
                                </div>
                                <Separator />
                                <div>
                                    <p className="font-semibold mb-1">Dev Mode: Mock Customer</p>
                                    <div className="flex justify-between items-center bg-background p-2 rounded border border-border/20 mb-1">
                                        <code>customer@coffee.com</code>
                                        <span className="text-muted-foreground/50">|</span>
                                        <code>customer123</code>
                                    </div>
                                    <Button 
                                        variant="link" 
                                        className="h-auto p-0 text-xs w-full justify-end text-primary"
                                        onClick={() => {
                                            setEmail('customer@coffee.com');
                                            setPassword('customer123');
                                        }}
                                    >
                                        Auto-fill Customer
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col items-center space-y-2 text-center text-sm text-muted-foreground">
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}
