"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

// Add public routes that don't require authentication
const publicRoutes = ["/login", "/register", "/", "/about"];

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Check if the current route is public
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    }

    // If user is authenticated and trying to access login/register
    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show loading state while checking auth
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
} 