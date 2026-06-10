import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type SignupInput, SignupSchema } from "@bytemart/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useForm } from "react-hook-form";
import { useSignup } from "../api/signup";
import { toast } from "sonner";

export function SignupForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupInput>({
		resolver: zodResolver(SignupSchema),
	});

	const navigate = useNavigate();
	const { mutate, status } = useSignup({
		mutationConfig: {
			onSuccess: () => {
				navigate({
					to: "/signin",
				});
			},
			onError: (error) => {	
				toast.error(
					//@ts-ignore
					(error as { error: string }).error ||
						"Something went wrong. Please try again.",
				);
			}
		},
	});

	async function onSubmit(data: SignupInput) {
		mutate({ user: data });
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Create an account</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Enter your details below to create your account
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="grid gap-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input
							{...register("firstName")}
							id="firstName"
							placeholder="John"
						/>
						{errors.firstName && (
							<p className="text-sm text-destructive">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input {...register("lastName")} id="lastName" placeholder="Doe" />
						{errors.lastName && (
							<p className="text-sm text-destructive">
								{errors.lastName.message}
							</p>
						)}
					</div>
				</div>
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
					<Label htmlFor="phone">Phone</Label>
					<Input
						{...register("phone")}
						id="phone"
						type="tel"
						placeholder="+91 1234567890"
					/>
					{errors.phone && (
						<p className="text-sm text-destructive">{errors.phone.message}</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Password</Label>
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
					{status === "pending" ? "Creating account..." : "Sign Up"}
				</Button>
			</div>
			<div className="text-center text-sm">
				Already have an account?{" "}
				<Link to="/signin" className="underline underline-offset-4">
					Login
				</Link>
			</div>
		</form>
	);
}
