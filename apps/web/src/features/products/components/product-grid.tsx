import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { ProductResponse, ProductFilters } from "@bytemart/types";
import { Link } from "@tanstack/react-router";
import { Heart, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "../api/get-products";
import { useState } from "react";
import { ProductSort } from "./product-sort";

interface ProductGridProps {
	filters?: ProductFilters;
}

const sortProducts = (products: ProductResponse[], sortBy: string) => {
	if (!products) return products;
	
	const sortedProducts = [...products];
	
	switch (sortBy) {
		case 'price_asc':
			return sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
		case 'price_desc':
			return sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
		case 'name_asc':
			return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
		case 'name_desc':
			return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
		case 'featured':
		default:
			return sortedProducts;
	}
};

export function ProductGrid({ filters }: ProductGridProps) {
	const [filtersState, setFilters] = useState<ProductFilters>({
		page: 1,
		limit: 12,
		sortBy: 'featured'
	});

	const { data: products, isLoading } = useProducts({ filters: filters || filtersState });
	const {
		addItem: addToCart,
		removeItem: removeFromCart,
		items: cartItems,
	} = useCartStore();
	const { toggleItem, items: wishlistItems } = useWishlistStore();

	const handleToggleWishlist = (product: ProductResponse) => {
		toggleItem({
			id: product.id,
			productId: product.id,
			name: product.name,
			price: Number(product.price),
			imageUrl: product.image_url || "/placeholder.svg",
			category: product.category.name,
			inStock: product.stock_quantity > 0,
		});
		toast.success(
			isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
		);
	};

	const isInWishlist = (productId: string) => {
		return wishlistItems.some((item) => item.id === productId);
	};

	const isInCart = (productId: string) => {
		return cartItems.some((item) => item.productId === productId);
	};

	const handleCartAction = (product: ProductResponse) => {
		if (isInCart(product.id)) {
			removeFromCart(product.id);
			toast.success("Removed from cart");
		} else {
			addToCart({
				id: product.id,
				productId: product.id,
				name: product.name,
				price: Number(product.price),
				quantity: 1,
				maxQuantity: product.stock_quantity,
				imageUrl: product.image_url || "/placeholder.svg",
			});
			toast.success("Added to cart");
		}
	};

	const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
		setFilters(prev => ({
			...prev,
			sortBy,
			page: 1
		}));
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const sortedProducts = sortProducts(products?.data?.items || [], filtersState.sortBy || 'featured');

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center mb-6">
				<ProductSort 
					value={filtersState.sortBy} 
					onValueChange={handleSortChange} 
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{sortedProducts.map((product) => (
					<Card
						key={product.id}
						className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
					>
						<CardHeader className="p-0 relative">
							<Link to="/product/$productId" params={{ productId: product.id }}>
								<div className="relative h-48 w-full overflow-hidden">
									<img
										src={product.image_url || "/placeholder.svg"}
										alt={product.name}
										className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
									/>
								</div>
							</Link>
							<Button
								variant="ghost"
								size="icon"
								className={`absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full ${
									isInWishlist(product.id) ? "text-red-500" : ""
								}`}
								onClick={() => handleToggleWishlist(product)}
								aria-label="Toggle wishlist"
							>
								<Heart
									className="h-5 w-5"
									fill={isInWishlist(product.id) ? "currentColor" : "none"}
								/>
							</Button>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="text-sm text-gray-500 mb-1">
								{product.category.name}
							</div>
							<Link
								to="/product/$productId"
								params={{ productId: product.id }}
								className="hover:underline"
							>
								<CardTitle className="text-lg font-semibold">
									{product.name.length > 30
										? `${product.name.slice(0, 30)}...`
										: product.name}
								</CardTitle>
							</Link>
							<div className="mt-2 font-bold text-lg">
								Rs {Number(product.price).toFixed(2)}
							</div>
							<div className="text-sm text-gray-500 mt-1">
								{product.rating} ★ ({product.reviews} reviews)
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline" size="sm" asChild>
								<Link to="/product/$productId" params={{ productId: product.id }}>
									View Details
								</Link>
							</Button>
							<Button
								size="sm"
								variant={isInCart(product.id) ? "destructive" : "default"}
								onClick={() => handleCartAction(product)}
							>
								{isInCart(product.id) ? (
									<>
										<Minus className="h-4 w-4 mr-2" />
										Remove
									</>
								) : (
									<>
										<ShoppingCart className="h-4 w-4 mr-2" />
										Add to Cart
									</>
								)}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
