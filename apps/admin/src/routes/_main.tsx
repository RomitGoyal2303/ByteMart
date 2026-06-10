import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_main")({
	beforeLoad: ({ context, location }) => {
		console.log("context", context);
		console.log("AuthLayout");
		if (!context.auth.isAuthenticated || !context.auth.isAdmin) {
			throw redirect({
				to: "/signin",
				search: {
					redirect: location.pathname,
				},
			});
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
					<div className="flex h-14 w-full items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1.5" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<AppHeader />
					</div>
				</header>
				<main className="p-6">
					<Outlet />
				</main>
			</SidebarInset>
			<Toaster/>
		</SidebarProvider>
	);
}
