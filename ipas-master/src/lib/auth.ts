import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { createServerClient } from "@/lib/supabase/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return true;
      const supabase = createServerClient();
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          avatar_url: user.image ?? "",
          provider: account?.provider ?? "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      return true;
    },
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
