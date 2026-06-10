import { AuthContextType } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext<{
	auth: AuthContextType;
}>()({
	component: () => (
		<ThemeProvider>
			<Outlet />
			<TanStackRouterDevtools />
		</ThemeProvider>
	),
});
