import { api } from "@/utils/api-client";
import type { QueryConfig } from "@/utils/react-query";
import type { ApiResponse, Category, ProductFilters, ProductResponse } from "@bytemart/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

interface ProductsApiResponse {
	items: ProductResponse[];
	total: number;
	page: number;
	limit: number;
}

export const getProducts = (filters?: ProductFilters): Promise<ApiResponse<ProductsApiResponse>> => {
	const params = new URLSearchParams();
	if (filters) {
		if (filters.categoryId) params.append('categoryId', filters.categoryId);
		if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
		if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
		if (filters.sortBy) params.append('sortBy', filters.sortBy);
	}

	const queryString = params.toString();
	return api.get(`/product${queryString ? `?${queryString}` : ''}`);
};

type CategoryGG = {
	id: string;
} & Category;

export const getParentCategories = (): Promise<ApiResponse<CategoryGG[]>> => {
	return api.get("/category/parent");
};

export const getProductsQueryOptions = (filters?: ProductFilters) => {
	return queryOptions({
		queryKey: ['products', filters],
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

const getParentCategoriesOptions = () => {
	return queryOptions({
		queryKey: ["parentCategories"],
		queryFn: getParentCategories,
	});
};

export const useParentCategories = ({}: {
	queryConfig?: QueryConfig<typeof getParentCategories>;
}) => {
	return useQuery({
		...getParentCategoriesOptions(),
	});
};
