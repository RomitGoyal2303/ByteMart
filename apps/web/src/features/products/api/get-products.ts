import { api } from "@/utils/api-client";
import type { QueryConfig } from "@/utils/react-query";
import type { ApiResponse, ProductFilters, ProductResponse } from "@bytemart/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProducts = (
	filters?: ProductFilters
): Promise<ApiResponse<{
	items: ProductResponse[];
	total: number;
	page: number;
	limit: number;
}>> => {
	// Convert filters to query parameters
	const params = new URLSearchParams();
	if (filters?.search) params.append("search", filters.search);
	if (filters?.categoryId) params.append("categoryId", filters.categoryId);
	if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
	if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
	if (filters?.brands?.length) params.append("brands", filters.brands.join(","));
	if (filters?.features?.length) params.append("features", filters.features.join(","));
	if (filters?.sortBy) params.append("sortBy", filters.sortBy);
	if (filters?.page) params.append("page", filters.page.toString());
	if (filters?.limit) params.append("limit", filters.limit.toString());

	return api.get(`/product?${params.toString()}`);
};

export const getProductsQueryOptions = (filters?: ProductFilters) => {
	return queryOptions({
		queryKey: ["products", filters],
		queryFn: () => getProducts(filters),
	});
};

export const useProducts = ({
	filters,
	queryConfig = {},
}: {
	filters?: ProductFilters;
	queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
}) => {
	return useQuery({
		...getProductsQueryOptions(filters),
		...queryConfig,
	});
};
