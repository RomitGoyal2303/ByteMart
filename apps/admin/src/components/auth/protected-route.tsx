import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function ProtectedRoute({
	children,
}: {
	children?: ReactNode;
}) {
	const { isAuthenticated, isAdmin, status } = useAuth();

	if (status === "loading") {
		return null; // AuthProvider shows loading spinner
	}

	if (!isAuthenticated || !isAdmin) {
		return <Navigate to="/signin" />;
	}

	return children || <Outlet />;
}
