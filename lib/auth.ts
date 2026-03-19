import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb-client";
import dbConnect from "./mongodb";
import User from "@/models/User";
import { Role } from "@/types";

// Type augmentation for NextAuth v5
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: Role;
            strikes: number;
            suspendedUntil: Date | null;
        };
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            // In NextAuth v5 with an adapter, the "user" object passed here is the DB user
            if (session.user) {
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    session.user.id = user.id;
                    session.user.role = dbUser.role;
                    session.user.strikes = dbUser.strikes;
                    session.user.suspendedUntil = dbUser.suspendedUntil;
                }
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await dbConnect();
                const existingUser = await User.findOne({ email: user.email });

                // If it's a new user, the adapter creates it. 
                // But we want to ensure default fields or handle role assignment here.
                if (existingUser && existingUser.suspendedUntil && new Date(existingUser.suspendedUntil) > new Date()) {
                    // Block sign in if suspended
                    throw new Error("ACCOUNT_SUSPENDED");
                }
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect errors back to login
    },
    session: {
        strategy: "database", // Since using an adapter
    },
});
