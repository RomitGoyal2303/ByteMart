import { useAuth } from "@/hooks/use-auth";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

import { useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function App() {
	const [email, setEmail] = useState("");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			toast.success("Subscribed successfully!");
			setEmail("");
		}
	};

	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				<section className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10" />
					<div
						className="h-[500px] sm:h-[600px] lg:h-[700px] bg-cover bg-center"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
						}}
					/>
					<div className="container absolute inset-0 flex items-center z-20">
						<div className="max-w-xl">
							<Badge className="mb-4 px-3 py-1 text-sm">New Release</Badge>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
								The Future of Tech is Here
							</h1>
							<p className="text-base sm:text-lg text-white/90 mb-8 max-w-md">
								Experience the next generation of innovation with our latest
								flagship devices. Cutting-edge technology that transforms how
								you live, work, and play.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									size="lg"
									className="font-medium rounded-full hover:cursor-pointer"
									onClick={() => navigate({ to: "/explore" })}
								>
									Shop Now
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full"
								>
									Learn More
								</Button>
							</div>
						</div>
					</div>
				</section>
				<section className="py-16 sm:py-20 bg-muted/30">
					<div className="container">
						<h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
							Shop by Category
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{[
								{
									name: "Smartphones",
									icon: "smartphone",
									image:
										"https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
								},
								{
									name: "Laptops",
									icon: "laptop",
									image:
										"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
								},
								{
									name: "Audio",
									icon: "headphones",
									image:
										"https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
								},
								{
									name: "Accessories",
									icon: "mouse",
									image:
										"https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
								},
							].map((category, index) => (
								<div
									key={index}
									className="group relative overflow-hidden rounded-xl shadow-md"
								>
									<div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all z-10" />
									<img
										src={category.image}
										alt={category.name}
										className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-110"
									/>
									<div className="absolute inset-0 flex flex-col items-center justify-center z-20">
										<h3 className="text-xl font-medium text-white mb-3">
											{category.name}
										</h3>
										<Button
											variant="secondary"
											size="sm"
											className="rounded-full"
										>
											View All
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
				<section className="py-16 sm:py-20">
					<div className="container">
						<div className="flex justify-between items-center mb-10">
							<h2 className="text-2xl sm:text-3xl font-bold">
								Featured Products
							</h2>
							<Button variant="outline" className="rounded-full">
								View All
							</Button>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
							{[
								{
									name: "Ultra Pro Smartphone",
									price: 999,
									image:
										"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
									rating: 4.8,
									reviews: 124,
									sale: true,
								},
								{
									name: "PowerBook Air",
									price: 1299,
									image:
										"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
									rating: 4.9,
									reviews: 89,
									sale: false,
								},
								{
									name: "Noise Cancelling Headphones",
									price: 349,
									image:
										"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
									rating: 4.7,
									reviews: 215,
									sale: false,
								},
								{
									name: "Smart Watch Pro",
									price: 299,
									image:
										"https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
									rating: 4.6,
									reviews: 178,
									sale: true,
								},
							].map((product, index) => (
								<Card
									key={index}
									className="overflow-hidden group border-0 shadow-lg rounded-xl"
								>
									<div className="relative h-64 bg-muted overflow-hidden">
										<img
											src={product.image}
											alt={product.name}
											className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										{product.sale && (
											<Badge className="absolute top-3 right-3 bg-destructive hover:bg-destructive">
												Sale
											</Badge>
										)}
									</div>
									<CardContent className="p-5">
										<div className="flex items-center text-sm text-muted-foreground mb-2">
											<div className="flex items-center">
												{Array(5)
													.fill(0)
													.map((_, i) => (
														<svg
															key={i}
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill={
																i < Math.floor(product.rating)
																	? "currentColor"
																	: "none"
															}
															stroke="currentColor"
															className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-yellow-500" : "text-muted-foreground"}`}
														>
															<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
														</svg>
													))}
											</div>
											<span className="ml-1">{product.rating}</span>
											<span className="mx-1">·</span>
											<span>{product.reviews} reviews</span>
										</div>
										<h3 className="font-medium text-lg mb-1 line-clamp-1">
											{product.name}
										</h3>
										<p className="font-bold text-lg mb-4">${product.price}</p>
										<Button className="w-full rounded-full transition-all hover:shadow-md">
											Add to Cart
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section className="py-16 sm:py-20 bg-muted/20">
					<div className="container">
						<h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
							What Our Customers Say
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[
								{
									name: "Alex Johnson",
									role: "Tech Enthusiast",
									image:
										"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
									quote:
										"The customer service is exceptional. They helped me find the perfect laptop for my needs and the delivery was super fast!",
								},
								{
									name: "Sarah Williams",
									role: "Professional Photographer",
									image:
										"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
									quote:
										"I've been buying my camera equipment from TechHub for years. Their products are always authentic and their prices are competitive.",
								},
								{
									name: "Michael Chen",
									role: "Software Developer",
									image:
										"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
									quote:
										"The smartphone I purchased exceeded my expectations. The specs are exactly as advertised and the performance is outstanding.",
								},
							].map((testimonial, index) => (
								<Card
									key={index}
									className="relative border-0 shadow-md rounded-xl"
								>
									<CardContent className="pt-12 pb-6 px-6">
										<div className="absolute -top-6 left-6">
											<Avatar className="h-12 w-12 border-4 border-background shadow-md">
												<AvatarImage
													src={testimonial.image}
													alt={testimonial.name}
												/>
												<AvatarFallback>
													{testimonial.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
										</div>
										<div className="mb-4 text-muted-foreground">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-6 w-6 opacity-50"
											>
												<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
												<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
											</svg>
										</div>
										<p className="mb-4 text-base leading-relaxed">
											{testimonial.quote}
										</p>
										<div>
											<p className="font-medium">{testimonial.name}</p>
											<p className="text-sm text-muted-foreground">
												{testimonial.role}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section className="py-16 sm:py-20">
					<div className="container">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
							{[
								{
									title: "Free Shipping",
									description: "Free shipping on all orders over $50",
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="h-12 w-12 mb-5 text-primary"
										>
											<circle cx="13" cy="18" r="2"></circle>
											<circle cx="7" cy="18" r="2"></circle>
											<path d="M2 8h1.5c1 0 1.5.5 1.5 1.5v4c0 1 .5 1.5 1.5 1.5H10"></path>
											<path d="M10 6h6.5c1 0 1.5.5 1.5 1.5v7c0 1 .5 1.5 1.5 1.5H22"></path>
											<path d="M7 18h8"></path>
										</svg>
									),
								},
								{
									title: "30-Day Returns",
									description: "Easy returns within 30 days of purchase",
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="h-12 w-12 mb-5 text-primary"
										>
											<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
											<path d="M3 3v5h5"></path>
										</svg>
									),
								},
								{
									title: "Secure Payment",
									description: "Multiple secure payment methods accepted",
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="h-12 w-12 mb-5 text-primary"
										>
											<rect width="20" height="14" x="2" y="5" rx="2"></rect>
											<line x1="2" x2="22" y1="10" y2="10"></line>
										</svg>
									),
								},
							].map((feature, index) => (
								<div
									key={index}
									className="text-center p-8 rounded-xl transition-all hover:shadow-md"
								>
									<div className="flex justify-center">{feature.icon}</div>
									<h3 className="text-xl font-medium mb-3">{feature.title}</h3>
									<p className="text-muted-foreground">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="py-16 sm:py-20 bg-primary text-primary-foreground">
					<div className="container">
						<div className="max-w-2xl mx-auto text-center">
							<h2 className="text-2xl sm:text-3xl font-bold mb-4">
								Stay Updated
							</h2>
							<p className="mb-8 text-primary-foreground/90">
								Subscribe to our newsletter for exclusive deals, new product
								announcements, and tech tips.
							</p>
							<form
								onSubmit={handleSubscribe}
								className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
							>
								<div className="flex-1 relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
									<Input
										type="email"
										placeholder="Enter your email"
										className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-full"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<Button
									type="submit"
									variant="secondary"
									className="rounded-full"
								>
									Subscribe
								</Button>
							</form>
						</div>
					</div>
				</section>
			</main>

			<footer className="bg-muted py-12 sm:py-16">
				<div className="container">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
						<div>
							<div className="flex items-center space-x-2 mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-6 w-6"
								>
									<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
									<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
								</svg>
								<span className="font-bold text-lg">TechHub</span>
							</div>
							<p className="text-muted-foreground mb-6">
								Your one-stop shop for all things tech. Quality products,
								competitive prices, and exceptional service.
							</p>
							<div className="flex space-x-4">
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-5 w-5"
									>
										<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
									</svg>
								</Link>
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-5 w-5"
									>
										<rect
											width="20"
											height="20"
											x="2"
											y="2"
											rx="5"
											ry="5"
										></rect>
										<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
										<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
									</svg>
								</Link>
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-5 w-5"
									>
										<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
									</svg>
								</Link>
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-5 w-5"
									>
										<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
										<rect width="4" height="12" x="2" y="9"></rect>
										<circle cx="4" cy="4" r="2"></circle>
									</svg>
								</Link>
							</div>
						</div>
						<div className="mt-4 sm:mt-0">
							<h3 className="font-medium text-lg mb-4">Shop</h3>
							<ul className="space-y-3">
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Smartphones
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Laptops
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Audio
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Accessories
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Wearables
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-medium text-lg mb-4">Support</h3>
							<ul className="space-y-3">
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Contact Us
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										FAQs
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Shipping
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Returns
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Warranty
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-medium text-lg mb-4">Company</h3>
							<ul className="space-y-3">
								<li>
									<Link
										to="/about"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										to="#"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Press
									</Link>
								</li>
								<li>
									<Link
										to="/"
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<Separator className="mb-8" />
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-muted-foreground mb-4 md:mb-0">
							© 2025 ByteMart. All rights reserved.
						</p>
						<div className="flex flex-wrap justify-center gap-4 md:gap-6">
							<Link
								to="/tos"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Terms of Service
							</Link>
							<Link
								to="/policy"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Privacy Policy
							</Link>
						</div>
					</div>
				</div>
			</footer>
			<Toaster />
		</div>
	);
}

export default App;
