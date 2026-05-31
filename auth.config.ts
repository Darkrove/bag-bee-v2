import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { env } from "@/env.mjs";

// import { siteConfig } from "@/config/site"
// import { getUserByEmail } from "@/lib/user";
// import MagicLinkEmail from "@/emails/magic-link-email"
// import { prisma } from "@/lib/db"

export default {
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: "Famous Bag <famous-bag@resend.dev>",
    }),
  ],
} satisfies NextAuthConfig;
