import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface DbUser {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  coins: number;
  role: string;
  createdAt: string | null;
}

function normalizeUsername(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^_+|_+$/g, "");
  return base || "user";
}

async function findUserByEmail(email: string): Promise<DbUser | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, email, username, avatarUrl, coins, role, createdAt FROM user WHERE email = ? LIMIT 1",
    [email]
  );
  if (!rows.length) return null;
  const row = rows[0];
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    avatarUrl: row.avatarUrl || null,
    coins: row.coins ?? 0,
    role: row.role,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
  };
}

async function usernameExists(username: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM user WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length > 0;
}

async function generateUniqueUsername(base: string) {
  const normalized = normalizeUsername(base);
  if (!(await usernameExists(normalized))) return normalized;
  let suffix = 1;
  while (suffix < 1000) {
    const candidate = `${normalized}${suffix}`;
    if (!(await usernameExists(candidate))) return candidate;
    suffix += 1;
  }
  return `${normalized}${crypto.randomUUID().slice(0, 6)}`;
}

async function ensureUser(params: {
  email: string;
  name: string;
  avatarUrl: string | null;
}): Promise<DbUser> {
  const existing = await findUserByEmail(params.email);
  if (existing) {
    if (params.avatarUrl && params.avatarUrl !== existing.avatarUrl) {
      await pool.query("UPDATE user SET avatarUrl = ?, updatedAt = NOW() WHERE id = ?", [
        params.avatarUrl,
        existing.id,
      ]);
      return { ...existing, avatarUrl: params.avatarUrl };
    }
    return existing;
  }

  const id = crypto.randomUUID();
  const username = await generateUniqueUsername(params.name);
  const passwordHash = crypto.randomBytes(32).toString("hex");

  await pool.query(
    "INSERT INTO user (id, email, username, passwordHash, avatarUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
    [id, params.email, username, passwordHash, params.avatarUrl]
  );

  // Query lại để lấy createdAt chính xác từ DB
  const newUser = await findUserByEmail(params.email);
  if (newUser) return newUser;

  return {
    id,
    email: params.email,
    username,
    avatarUrl: params.avatarUrl,
    coins: 0,
    role: "USER",
    createdAt: new Date().toISOString(),
  };
}

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const [users] = await pool.query<RowDataPacket[]>(
          "SELECT id, username, email, passwordHash, role, coins, avatarUrl, createdAt FROM user WHERE email = ? OR username = ? LIMIT 1",
          [credentials.identifier, credentials.identifier]
        );

        if (users.length === 0) {
          throw new Error("Tài khoản không tồn tại.");
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Mật khẩu không chính xác.");
        }

        return {
          id: user.id,
          username: user.username,
          name: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
          coins: user.coins,
          role: user.role,
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Xử lý OAuth (Google/Facebook)
      if (account && profile && account.provider !== 'credentials') {
        const rawProfile = profile as {
          email?: string | null;
          name?: string | null;
          image?: string | null;
          picture?: { data?: { url?: string } } | string | null;
          id?: string | null;
        };

        const provider = account.provider;
        const providerAccountId = account.providerAccountId || rawProfile.id || crypto.randomUUID();
        const email = rawProfile.email || `${provider}-${providerAccountId}@oauth.truyenhot.local`;
        const name = rawProfile.name || email.split("@")[0] || "user";
        const avatarUrl =
          (typeof rawProfile.picture === "string" ? rawProfile.picture : rawProfile.picture?.data?.url) ||
          rawProfile.image ||
          null;

        const dbUser = await ensureUser({ email, name, avatarUrl });
        token.userId = dbUser.id;
        token.username = dbUser.username;
        token.name = name; // tên thực từ provider (Google/Facebook)
        token.email = dbUser.email;
        token.avatarUrl = dbUser.avatarUrl;
        token.coins = dbUser.coins;
        token.role = dbUser.role;
        token.createdAt = dbUser.createdAt;
      }
      
      // Xử lý CredentialsProvider (thông tin user trả về từ authorize)
      if (user && account?.provider === 'credentials') {
        token.userId = user.id;
        token.username = (user as any).username;
        token.name = user.name;
        token.email = user.email;
        token.avatarUrl = (user as any).avatarUrl;
        token.coins = (user as any).coins;
        token.role = (user as any).role;
        token.createdAt = (user as any).createdAt;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as {
          id?: string;
          username?: string;
          name?: string;
          email?: string;
          avatarUrl?: string | null;
          coins?: number;
          role?: string;
          createdAt?: string | null;
        };
        user.id = (token.userId as string) || (token.sub as string) || user.id;
        user.username = (token.username as string) || user.username;
        user.name = (token.name as string) || user.name;
        user.email = (token.email as string) || user.email;
        user.avatarUrl = (token.avatarUrl as string) || user.avatarUrl || null;
        user.coins = (token.coins as number) ?? user.coins ?? 0;
        user.role = (token.role as string) || user.role || "USER";
        user.createdAt = (token.createdAt as string) || user.createdAt || null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
