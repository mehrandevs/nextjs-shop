"use client";
import { useSession } from "next-auth/react";

export default function useAuth() {
  const { data: session, status } = useSession();

  return {
    isLoading: status === "loading",
    isLoggedIn: status === "authenticated",
    isAdmin: session?.user?.isAdmin === true,
  };
}
