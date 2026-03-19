// FIX: Removed unused motion and AlertCircle imports
'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    ShoppingBag,
    DollarSign,
    Loader2,
    ArrowUpRight,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// FIX: Defined proper type for analytics stats instead of 'any'
interface AnalyticsStats {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    activeOrders: number;
    noShowRate: number;
    activeSuspensions: number;
    topProducts: Array<{
        name: string;
        count: number;
        revenue: number;
    }>;
    statusBreakdown?: {
        completed?: number;
        pending?: number;
        expired?: number;
        cancelled?: number;
    };
    categoryBreakdown: Array<{
        categoryId: string;
        name: string;
        count: number;
        revenue: number;
    }>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/analytics');
                const data = await res.json();
                if (data.success) setStats(data.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium uppercase tracking-[0.2em] text-xs">Aggregating Enterprise Data...</p>
            </div>
        );
    }

    // FIX: Replaced 'any' with proper type definition for StatCard
    interface StatCardProps {
        title: string;
        value: string | number;
        icon: React.ComponentType<{ className?: string }>;
        description: string;
        trend?: string;
    }

    const StatCard = ({ title, value, icon: Icon, description, trend }: StatCardProps) => (
        <Card className="bg-card/40 backdrop-blur-md border-border/40 hover:border-primary/40 transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="w-4 h-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black tracking-tighter mb-1">{value}</div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" />
                        {trend}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">{description}</span>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <header>
                <h1 className="text-4xl font-black tracking-tighter">ANALYTICS <span className="text-primary italic">OVERVIEW</span></h1>
                <p className="text-muted-foreground font-medium text-sm">Real-time performance metrics for CoffeeHybrid v2.</p>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    description="vs last period"
                    trend="+12.5%"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.totalOrders ?? 0}
                    icon={ShoppingBag}
                    description="historical total"
                    trend="+8.2%"
                />
                <StatCard
                    title="Efficiency"
                    value="94.2%"
                    icon={TrendingUp}
                    description="fulfillment rate"
                    trend="+2.1%"
                />
                <StatCard
                    title="Active Sessions"
                    value="24"
                    icon={BarChart3}
                    description="users currently"
                    trend="+4.8%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Status Breakthrough */}
                <Card className="lg:col-span-1 bg-card/40 backdrop-blur-md border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-black tracking-tight">Order Distribution</CardTitle>
                        <CardDescription>Breakdown by current fulfillment state.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { label: 'Completed', count: stats?.statusBreakdown?.completed || 0, icon: CheckCircle, color: 'text-emerald-500' },
                            { label: 'Pending', count: stats?.statusBreakdown?.pending || 0, icon: Clock, color: 'text-amber-500' },
                            { label: 'Expired', count: (stats?.statusBreakdown?.expired || 0) + (stats?.statusBreakdown?.cancelled || 0), icon: XCircle, color: 'text-destructive' },
                        ].map((item) => (
                            <div key={item.label} className="flex justify-between items-center p-4 rounded-3xl bg-muted/20 border border-border/10">
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                    <span className="font-bold text-sm">{item.label}</span>
                                </div>
                                <span className="text-xl font-black tabular-nums">{item.count}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card className="lg:col-span-2 bg-card/40 backdrop-blur-md border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-black tracking-tight">Category Performance</CardTitle>
                        <CardDescription>Sales and revenue breakdown by drink category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {/* FIX: Replaced 'any' with inline type definition */}
                            {stats?.categoryBreakdown.map((cat: { categoryId: string; name: string; count: number; revenue: number }) => (
                                <div key={cat.categoryId} className="flex items-center justify-between p-4 rounded-3xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">
                                            {cat.name.slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{cat.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">{cat.count} Units Sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-lg tracking-tighter">${cat.revenue.toFixed(2)}</p>
                                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden mt-1">
                                            <div className="h-full bg-primary" style={{ width: `${Math.min(100, (cat.revenue / stats.totalRevenue) * 500)}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
