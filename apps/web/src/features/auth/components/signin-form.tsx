import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type LoginInput, LoginSchema } from "@bytemart/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useForm } from "react-hook-form";
import { useSignin } from "../api/signin";
import { useAuth } from "@/hooks/use-auth";

export function SigninForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(LoginSchema),
	});

	const navigate = useNavigate();
	const { setUser } = useAuth();
	const { mutate, status } = useSignin({
		mutationConfig: {
			onSuccess: (data) => {
				setUser(data.data);
				navigate({
					to: "/",
				});
			},
		},
	});

	async function onSubmit(data: LoginInput) {
		mutate({ user: data });
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Enter your email below to login to your account
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						{...register("email")}
						id="email"
						type="email"
						placeholder="m@example.com"
					/>
					{errors.email && (
						<p className="text-sm text-destructive">{errors.email.message}</p>
					)}
				</div>
				<div className="grid gap-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Password</Label>
						<Link
							to="/"
							className="text-sm text-muted-foreground underline-offset-4 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
					<Input {...register("password")} id="password" type="password" />
					{errors.password && (
						<p className="text-sm text-destructive">
							{errors.password.message}
						</p>
					)}
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={status === "pending"}
				>
					{status === "pending" ? "Logging in..." : "Login"}
				</Button>
			</div>
			<div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link to="/signup" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</form>
	);
}
