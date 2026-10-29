"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function NoAuthWrapper({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  (useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }),
    [router, status]);

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (status === "unauthenticated") {
    return <>{children}</>;
  }
  return null;
}
