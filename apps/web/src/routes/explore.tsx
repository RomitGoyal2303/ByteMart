import { Skeleton } from "@/components/ui/skeleton";
import { ProductFilters } from "@/features/products/components/product-filters";
import { Pagination } from "@/features/products/components/pagination";
import { ProductGrid } from "@/features/products/components/product-grid";
import type { ProductFilters as ProductFiltersType } from "@bytemart/types";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";

export const Route = createFileRoute("/explore")({
	component: ExplorePage,
});

export default function ExplorePage() {
	const [filters, setFilters] = useState<ProductFiltersType>({});

	const handleFiltersChange = (newFilters: ProductFiltersType) => {
		setFilters(newFilters);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Explore Products</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
				<div>
					<ProductFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />
				</div>
				
				<div>
					<Suspense fallback={<ProductGridSkeleton />}>
						<ProductGrid filters={filters} />
					</Suspense>

					<div className="mt-8">
						<Pagination totalPages={4} currentPage={1} />
					</div>
				</div>
			</div>
		</div>
	);
}

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 9 }).map((_, i) => (
				<div key={i} className="border rounded-lg p-4">
					<Skeleton className="h-48 w-full mb-4" />
					<Skeleton className="h-4 w-3/4 mb-2" />
					<Skeleton className="h-6 w-1/2 mb-4" />
					<Skeleton className="h-10 w-full" />
				</div>
			))}
		</div>
	);
}
