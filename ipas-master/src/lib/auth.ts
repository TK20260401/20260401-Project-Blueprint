import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  trustHost: true,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id?.toString() ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      try {
        const { createServerClient } = await import("@/lib/supabase/server");
        const supabase = createServerClient();
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",
            avatar_url: user.image ?? "",
            provider: account?.provider ?? "",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch {
        // Supabase error should not block sign-in
      }
    },
  },
});
