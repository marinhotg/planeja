import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    } & DefaultSession["user"];
    accessToken?: string; // Add accessToken to Session
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken?: string; // Add accessToken to User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    accessToken?: string; // Add accessToken to JWT
  }
}