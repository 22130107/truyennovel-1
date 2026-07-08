"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";

function SessionSync({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      return;
    }
    if (status !== "authenticated" || !data?.user) return;
    const user = data.user as {
      id?: string;
      username?: string;
      name?: string;
      email?: string;
      avatarUrl?: string | null;
      coins?: number;
      role?: string;
      createdAt?: string | null;
    };

    const payload = {
      id: user.id,
      username: user.username || user.email || "",
      name: user.name || user.username || user.email || "",
      email: user.email || "",
      avatarUrl: user.avatarUrl || null,
      coins: user.coins ?? 0,
      role: user.role || "USER",
      createdAt: user.createdAt || null,
    };

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(payload));
  }, [data, status]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  );
}
