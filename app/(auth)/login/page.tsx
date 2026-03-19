// FIX: Wrapped useSearchParams() in Suspense boundary to fix Next.js 16 build error
'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function LoginForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const isSuspended = error === 'ACCOUNT_SUSPENDED' || error === 'OAuthCallbackError';

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
                            Sign in to your CoffeeHybrid account to continue ordering.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isSuspended && (
                            <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 text-center">
                                Your account is currently suspended. Please try again later or contact support.
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full h-11 transition-all hover:bg-primary/5 border-border/60"
                            onClick={() => signIn('google', { callbackUrl })}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign in with Google
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center space-y-2 text-center text-sm text-muted-foreground">
                        <p>Admin or Staff? Use your authorized Google email.</p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

function LoginLoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}
