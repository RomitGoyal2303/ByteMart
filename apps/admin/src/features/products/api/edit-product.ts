import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import type { ApiResponse, Product, ProductResponse } from "@bytemart/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsQueryOptions } from "./get-products";

export const editProduct = ({
	productId,
	product,
}: { productId: ProductResponse["id"]; product: Product }): Promise<
	ApiResponse<Product>
> => {
	return api.put(`/product/${productId}`, product);
};

export const useEditProduct = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof editProduct> }) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restConfig } = mutationConfig || {};
	return useMutation({
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: getProductsQueryOptions().queryKey,
			});
			onSuccess?.(...args);
		},
		mutationFn: editProduct,
		...restConfig,
	});
};
