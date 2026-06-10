import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import type { ApiResponse, ProductResponse } from "@bytemart/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsQueryOptions } from "./get-products";

export const deleteProduct = ({
	productId,
}: { productId: ProductResponse["id"] }): Promise<ApiResponse<ProductResponse>> => {
	return api.delete(`/product/${productId}`);
};

export const useDeleteProduct = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof deleteProduct> }) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restConfig } = mutationConfig || {};
	return useMutation({
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: getProductsQueryOptions().queryKey,
			});
			onSuccess?.(...args);
		},
		mutationFn: deleteProduct,
		...restConfig,
	});
};
