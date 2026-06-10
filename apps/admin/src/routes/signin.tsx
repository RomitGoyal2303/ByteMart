import { SigninForm } from "@/features/auth/components/signin-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
	beforeLoad: ({ context }) => {
		console.log("context.auth", context.auth);
		if (context.auth.isAuthenticated && context.auth.isAdmin) {
			throw redirect({
				to: "/",
			});
		}
	},
	component: SignIn,
});

function SignIn() {
	return (
		<div className="flex min-h-dvh items-center justify-center">
			<div className="w-full max-w-sm">
				<SigninForm />
			</div>
		</div>
	);
}
