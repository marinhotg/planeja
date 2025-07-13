import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Helper function to check if a JWT is expired
function isJwtExpired(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode payload
    const exp = decoded.exp; // Expiration timestamp in seconds
    return Date.now() >= exp * 1000; // Compare with current time in milliseconds
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return true; // Assume expired if decoding fails
  }
}

// Helper function to refresh token
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      return { accessToken: data.token, refreshToken: data.refreshToken };
    }
    return null;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

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
          user.refreshToken = backendUser.refreshToken; // Assign refreshToken to user
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
        token.refreshToken = user.refreshToken; // Propagate refreshToken from signIn
      }

      // Check if access token is expired or about to expire (e.g., within 5 minutes)
      // For simplicity, let's just check if it's expired for now.
      if (token.accessToken && isJwtExpired(token.accessToken)) {
        console.log("Access token expired, attempting to refresh...");
        if (token.refreshToken) {
          const refreshedTokens = await refreshAccessToken(token.refreshToken);
          if (refreshedTokens) {
            token.accessToken = refreshedTokens.accessToken;
            token.refreshToken = refreshedTokens.refreshToken;
            console.log("Access token refreshed successfully.");
          } else {
            console.error("Failed to refresh access token, invalidating token.");
            return { ...token, accessToken: undefined, refreshToken: undefined }; // Invalidate tokens
          }
        } else {
          console.error("No refresh token available, invalidating token.");
          return { ...token, accessToken: undefined, refreshToken: undefined }; // Invalidate tokens
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.accessToken) {
        // If there's no access token, the session is invalid
        return Promise.resolve({ ...session, user: undefined, accessToken: undefined, refreshToken: undefined });
      }

      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.accessToken = token.accessToken; // Add accessToken to session
        session.refreshToken = token.refreshToken; // Add refreshToken to session
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