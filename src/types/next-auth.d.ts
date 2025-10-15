import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      /** ID admin dari database Anda. */
      id: string; // Gunakan string karena authorize mengembalikan user.id.toString()
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** ID admin dari database Anda. */
    id: string;
  }
}