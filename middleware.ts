import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Role } from "@/types";

interface ExtendedUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
    strikes: number;
    suspendedUntil: Date | null;
}

export default auth((req) => {
    const { auth: session } = req;
    const isLoggedIn = !!session;
    const { pathname } = req.nextUrl;

    const isStaffRoute = pathname.startsWith("/staff");
    const isAdminRoute = pathname.startsWith("/admin");
    const isProtectedUserRoute = pathname.startsWith("/checkout") || pathname.startsWith("/order");

    // Authentication check
    if ((isStaffRoute || isAdminRoute || isProtectedUserRoute) && !isLoggedIn) {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authorization check
    if (isLoggedIn && session?.user) {
        // Use type cast to get the augmented properties
        const user = session.user as ExtendedUser;
        const role = user.role;

        if (isAdminRoute && role !== "admin") {
            return NextResponse.redirect(new URL("/", req.nextUrl.origin));
        }

        if (isStaffRoute && !(role === "staff" || role === "admin")) {
            return NextResponse.redirect(new URL("/", req.nextUrl.origin));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/staff/:path*", "/checkout/:path*", "/order/:path*"],
};
