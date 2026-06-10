import { api } from "@/utils/api-client";
import type { QueryConfig } from "@/utils/react-query";
import type { ApiResponse, CategoryResponse } from "@bytemart/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getCategories = (): Promise<ApiResponse<CategoryResponse>> => {
	return api.get("/category");
};

export const getCategoriesQueryOptions = () => {
	return queryOptions({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});
};

export const useCategories = ({
	queryConfig = {},
}: { queryConfig?: QueryConfig<typeof getCategoriesQueryOptions> }) => {
	return useQuery({
		...getCategoriesQueryOptions(),
		...queryConfig,
	});
};
