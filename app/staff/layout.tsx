import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ExtendedUser } from '@/types';
import Sidebar from '@/components/staff/Sidebar';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const role = (session?.user as ExtendedUser | undefined)?.role;

    if (!role || !['staff', 'admin'].includes(role)) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar for navigation between Queue and Scan */}
            <Sidebar />
            <main className="flex-1 p-8 pt-20 lg:pt-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
