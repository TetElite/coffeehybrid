'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ClientOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return fallback || (
            <div className="h-8 w-full bg-muted/20 animate-pulse rounded-md flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" />
            </div>
        );
    }

    return <>{children}</>;
}