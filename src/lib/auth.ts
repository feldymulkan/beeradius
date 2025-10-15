import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 1800, // 30 menit
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                const user = await prisma.admin.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                if (passwordMatch) {
                    // Pastikan ID dikembalikan sebagai string
                    return {
                        id: user.id.toString(),
                        name: user.username,
                    };
                }
                return null;
            },
        }),
    ],

    // --- INI BAGIAN PENTING YANG DITAMBAHKAN ---
    callbacks: {
        // Callback ini menambahkan ID ke token JWT setelah login
        jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Ambil 'id' dari objek user dan masukkan ke token
            }
            return token;
        },
        // Callback ini menambahkan ID ke objek sesi dari token
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string; // Ambil 'id' dari token dan masukkan ke sesi
            }
            return session;
        },
    },
    // ---------------------------------------------

    pages: {
        signIn: "/login",
    },
};

// Bagian ini mungkin berbeda jika Anda menggunakan NextAuth v5.
// Jika Anda punya `export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);`, itu tidak masalah.
// Yang terpenting adalah objek `authOptions` di atas.