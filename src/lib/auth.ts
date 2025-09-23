import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import prisma from "./prisma";
import * as bcrypt from "bcrypt";

export const authOptions: NextAuthOptions  = {
    session: {
        strategy: "jwt",
        maxAge: 1800,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                const user = await prisma.admin.findUnique({
                    where: {
                        username: credentials.username,
                    },
                });
                if (!user) {
                    return null;
                }
                const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                if (!passwordMatch) {
                    return null;
                }
                if (passwordMatch){
                    return{
                        id: user.id.toString(),
                        name: user.username,
                    }
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);