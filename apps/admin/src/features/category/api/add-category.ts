import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import type { ApiResponse, Category } from "@bytemart/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "./get-category";

export const addCategory = ({
	category,
}: {
	category: Partial<Category>;
}): Promise<ApiResponse<Category>> => {
	return api.post("/category", category);
};

export const useAddCategory = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof addCategory> }) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restConfig } = mutationConfig || {};
	return useMutation({
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: getCategoriesQueryOptions().queryKey,
			});
			onSuccess?.(...args);
		},
		mutationFn: addCategory,
		...restConfig,
	});
};
