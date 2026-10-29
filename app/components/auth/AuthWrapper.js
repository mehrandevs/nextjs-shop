"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  (useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }),
    [router, status]);

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }
  return null;
}
