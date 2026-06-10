import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useSignout } from "@/features/auth/api/signout";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
// import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	BarChart3,
	Box,
	Home,
	Layers,
	LayoutDashboard,
	LogOut,
	Package,
	Search,
	Settings,
	ShoppingCart,
	Star,
	Users,
	X,
} from "lucide-react";

const navigationItems = [
	{ title: "Dashboard", url: "/", icon: Home },
	{ title: "Products", url: "/products", icon: Package },
	{ title: "Orders", url: "/orders", icon: ShoppingCart },
	{ title: "Customers", url: "/customers", icon: Users },
	{ title: "Categories", url: "/categories", icon: Layers },
	{ title: "Analytics", url: "/analytics", icon: BarChart3 },
	{ title: "Reviews", url: "/reviews", icon: Star },
	{ title: "Inventory", url: "/inventory", icon: Box },
	{ title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
	const navigate = useNavigate();
	// const queryClient = useQueryClient();
	const { setUser } = useAuth();
	const { mutate: signout } = useSignout({
		mutationConfig: {
			onSuccess: () => {
				// console.log("signout success");
				// queryClient.invalidateQueries({ queryKey: ["verify-user"] });
				setUser(null);	
				navigate({ to: "/signin" });
			},
		},
	});
	const { state } = useSidebar();
	const { user } = useAuth();
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar collapsible="icon">
			{/* <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                        >
                            <Link to="/" className="flex items-center space-x-3">
                                <LayoutDashboard className="h-6 w-6" />
                                <span className="text-lg font-semibold">
                                    Bytemart
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader> */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="space-y-2">
						{navigationItems.map((item) => (
							<SidebarMenuItem
								key={item.url}
								className={cn("transition-colors")}
							>
								<SidebarMenuButton
									asChild
									className="w-full justify-start"
									tooltip={isCollapsed ? item.title : undefined}
								>
									<Link to={item.url} className="flex items-center space-x-3">
										<item.icon className="h-4 w-4" />
										<span className="text-sm font-medium">{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="">
				{state === "expanded" ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-sidebar-muted"
							>
								<Avatar className="size-8">
									<AvatarImage src="/avatars/user.png" alt="Admin" />
									<AvatarFallback>
										{user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-1 flex-col items-start text-left">
									<span className="text-sm font-medium leading-none">
										{user?.firstName} {user?.lastName}
									</span>
									<span className="text-xs text-sidebar-muted-foreground">
										{user?.email}
									</span>
								</div>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem onClick={() => signout(undefined)}>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<div className="flex justify-center items-center">
						<Avatar className="size-7">
							<AvatarImage src="/avatars/user.png" alt="Admin" />
							<AvatarFallback>
								{user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
							</AvatarFallback>
						</Avatar>
					</div>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
