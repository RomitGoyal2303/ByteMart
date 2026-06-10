//TODO: implement editCategory both on the client and server

import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import type { ApiResponse, Category, CategoryResponse } from "@bytemart/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "./get-category";

export const editCategory = ({
	category,
	categoryId,
}: {
	category: Omit<Category, "id" | "children">;
	categoryId: CategoryResponse["allCategories"][number]["id"];
}): Promise<ApiResponse<Category>> => {
	return api.put(`/category/${categoryId}`, category);
};

export const useEditCategory = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof editCategory> } = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restConfig } = mutationConfig || {};

	return useMutation({
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: getCategoriesQueryOptions().queryKey,
			});
			onSuccess?.(...args);
		},
		mutationFn: editCategory,
		...restConfig,
	});
};
