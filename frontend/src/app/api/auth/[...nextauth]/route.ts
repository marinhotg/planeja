import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

console.log("NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/google-login`;
        console.log("Attempting to call backend URL:", backendUrl);
        const res = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            googleId: account.id_token,
            imageUrl: user.image,
          }),
        });

        if (res.ok) {
          const backendUser = await res.json();
          user.id = backendUser.user.id;
          user.accessToken = backendUser.token; // Assign accessToken to user
          return true;
        }
        return false;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.accessToken = user.accessToken; // Propagate accessToken from signIn
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.accessToken = token.accessToken; // Add accessToken to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }