import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import type { ApiResponse, Product } from "@bytemart/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsQueryOptions } from "./get-products";
import { useUploadThing } from "./uploadthing";

type CreateProductDTO = {
	name: string;
	description: string;
	price: number;
	stock_quantity: number;
	category_id: string;
	image_url?: string;
};

type CreateProductParams = {
	product: CreateProductDTO;
	imageFile?: File;
};

export const createProduct = async ({
	product,
	imageFile,
	imageUrl = "",
}: {
	product: CreateProductDTO;
	imageUrl?: string;
	imageFile?: File;
}): Promise<ApiResponse<Product>> => {
	const formData = {
		name: product.name,
		description: product.description,
		price: product.price,
		stockQuantity: product.stock_quantity,
		categoryId: product.category_id,
		imageUrl: imageUrl || product.image_url || "",
	};
	
	return api.post("/product", formData);
};

export const useCreateProduct = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof createProduct> } = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, ...restConfig } = mutationConfig || {};
	
	return useMutation({
		mutationFn: createProduct,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: getProductsQueryOptions().queryKey,
			});
			onSuccess?.(...args);
		},
		...restConfig,
	});
};

export const useCreateProductWithImage = ({
	mutationConfig,
}: { mutationConfig?: MutationConfig<typeof createProduct> } = {}) => {
	const queryClient = useQueryClient();
	const uploadThingMutation = useUploadThing("imageUploader");

	return useMutation({
		mutationFn: async ({ product, imageFile }: CreateProductParams) => {
			let imageUrl = "";
			if (imageFile) {
				const uploadResponse = await uploadThingMutation.startUpload([imageFile]);
				if (uploadResponse?.[0]) {
					imageUrl = uploadResponse[0].url;
				}
			}
			return createProduct({ product: { ...product, image_url: imageUrl }, imageUrl });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProductsQueryOptions().queryKey });
		},
		...mutationConfig
	});
};

//
