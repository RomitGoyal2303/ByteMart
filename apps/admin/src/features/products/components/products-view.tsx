import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DeleteProductDialog } from "@/features/products/components/delete-products";
import { ProductDialog } from "@/features/products/components/edit-products";
import type { Product, ProductFilters, ProductResponse } from "@bytemart/types";
import {
	Download,
	Edit,
	MoreHorizontal,
	Plus,
	Search,
	Trash,
} from "lucide-react";
import { useState } from "react";
import { useCreateProductWithImage } from "../api/add-product";
import { useDeleteProduct } from "../api/delete.product";
import { useEditProduct } from "../api/edit-product";
import { useParentCategories, useProducts } from "../api/get-products";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductView() {

	const queryClient = useQueryClient();

	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [productDialogOpen, setProductDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] =
		useState<ProductResponse | null>(null);
	const [filters, setFilters] = useState<ProductFilters>({
		sortBy: 'featured',
		categoryId: undefined,
		minPrice: undefined,
		maxPrice: undefined
	});
	const { data, isLoading, error } = useProducts({
		filters
	});

	const {
		mutate: createProductWithImage,
		isPending: isCreating,
		isError: isCreateError,
		error: createError,
	} = useCreateProductWithImage({
		mutationConfig: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["products"],
				});
				setProductDialogOpen(false);
				setSelectedProduct(null);
				console.log("Product created successfully");
			},
		},
	});

	const {
		data: parentCategories,
		isLoading: isParentCategoriesLoading,
		error: parent,
	} = useParentCategories({});

	//TODO: implement editProduct and deleteProduct
	// const {
	// 	mutate: editProduct,
	// 	isLoading: isEditing,
	// 	error: editError,
	// 	data: editData,
	// } = useEditProduct({
	// 	mutationConfig: {
	// 		onSuccess: () => {
	// 			queryClient.invalidateQueries({
	// 				queryKey: ["products"],
	// 			});
	// 			setProductDialogOpen(false);
	// 			toast.success("Product updated successfully");
	// 		},
	// 	}
	// });

	const {
		mutate: deleteProduct,
		error: deleteError,
		data: deleteData,
	} = useDeleteProduct({
		mutationConfig: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["products"],
				});
				setDeleteDialogOpen(false);
				toast.success("Product deleted successfully");
			},
		}
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				Loading..........
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-96">
				<p className="text-red-500">
					Failed to load products: {data?.error || (error as Error)?.message}
				</p>
			</div>
		);
	}

	const filteredProducts = data?.data?.items || [];

	const getProductStatus = (stockQuantity: number) => {
		if (stockQuantity <= 0) return "Out of Stock";
		if (stockQuantity < 20) return "Low Stock";
		return "Active";
	};

	const displayedProducts = filteredProducts.filter((product) => {
		const matchesSearch = product.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesStatus =
			statusFilter === "all" ||
			getProductStatus(product.stock_quantity) === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const toggleProductSelection = (productId: string) => {
		if (selectedProducts.includes(productId)) {
			setSelectedProducts(selectedProducts.filter((id) => id !== productId));
		} else {
			setSelectedProducts([...selectedProducts, productId]);
		}
	};

	const toggleAllProducts = () => {
		if (selectedProducts.length === displayedProducts.length) {
			setSelectedProducts([]);
		} else {
			setSelectedProducts(displayedProducts.map((product) => product.id));
		}
	};

	const handleAddProduct = () => {
		setSelectedProduct(null);
		setProductDialogOpen(true);
	};

	const handleEditProduct = (product: ProductResponse) => {
		setSelectedProduct(product);
		setProductDialogOpen(true);
	};

	const handleDeleteProduct = (product: ProductResponse) => {
		setSelectedProduct(product);
		setDeleteDialogOpen(true);
	};

	const handleSaveProduct = async (
		productData: Partial<ProductResponse>,
		imageFile?: File
	) => {
		try {
			await createProductWithImage({
				product: {
					name: productData.name!,
					description: productData.description || "",
					price: Number(productData.price),
					stock_quantity: Number(productData.stock_quantity),
					category_id: productData.category_id!,
					image_url: productData.image_url || "",
				},
				imageFile,
			});

			setProductDialogOpen(false);
			toast.success("Product created successfully");
		} catch (error) {
			console.error("Failed to create product:", error);
			toast.error("Failed to create product");
		}
	};

	const handleDeleteConfirm = (productId: string) => {
		console.log("Deleted product:", productId);
		deleteProduct({ productId });
		setDeleteDialogOpen(false);
	};

	const handleCategoryFilterChange = (categoryId: string) => {
		setCategoryFilter(categoryId);
		setFilters(prev => ({
			...prev,
			categoryId: categoryId === 'all' ? undefined : categoryId
		}));
	};

	const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
		setFilters(prev => ({
			...prev,
			sortBy
		}));
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex w-full sm:w-auto items-center gap-2">
					<div className="relative w-full sm:w-[300px]">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products..."
							className="w-full pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{parentCategories?.data?.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={filters.sortBy} onValueChange={(value) => handleSortChange(value as ProductFilters['sortBy'])}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="featured">Featured</SelectItem>
							<SelectItem value="price-asc">Price: Low to High</SelectItem>
							<SelectItem value="price-desc">Price: High to Low</SelectItem>
							{/* <SelectItem value="name_asc">Name: A to Z</SelectItem> */}
							{/* <SelectItem value="name_desc">Name: Z to A</SelectItem> */}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-full sm:w-auto items-center gap-2">
					{selectedProducts.length > 0 && (
						<>
							<Button variant="outline" size="sm" className="h-8 gap-1">
								<Trash className="h-4 w-4" />
								Delete
							</Button>
							<Button variant="outline" size="sm" className="h-8 gap-1">
								<Download className="h-4 w-4" />
								Export
							</Button>
						</>
					)}
					<Button
						size="sm"
						className="h-8 gap-1 ml-auto"
						onClick={handleAddProduct}
						disabled={isCreating}
					>
						<Plus className="h-4 w-4" />
						{isCreating ? "Adding..." : "Add Product"}
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]">
									<Checkbox
										checked={
											selectedProducts.length === displayedProducts.length &&
											displayedProducts.length > 0
										}
										onCheckedChange={toggleAllProducts}
									/>
								</TableHead>
								<TableHead className="w-[80px]">Image</TableHead>
								<TableHead className="w-[100px]">ID</TableHead>
								<TableHead>Product</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Stock</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="w-[100px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{displayedProducts.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={9}
										className="text-center py-8 text-muted-foreground"
									>
										No products found. Try adjusting your filters.
									</TableCell>
								</TableRow>
							) : (
								displayedProducts.map((product) => (
									<TableRow key={product.id}>
										<TableCell>
											<Checkbox
												checked={selectedProducts.includes(product.id)}
												onCheckedChange={() =>
													toggleProductSelection(product.id)
												}
											/>
										</TableCell>
										<TableCell>
											<Avatar className="h-10 w-10">
												<AvatarImage
													src={product.image_url}
													alt={product.name}
												/>
												<AvatarFallback>
													{product.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell className="font-medium">{product.id}</TableCell>
										<TableCell>{product.name.slice(0, 20)}</TableCell>
										<TableCell>{product.category.name}</TableCell>
										<TableCell>{product.price}</TableCell>
										<TableCell>{product.stock_quantity}</TableCell>
										<TableCell>
											<Badge
												variant={
													getProductStatus(product.stock_quantity) === "Active"
														? "default"
														: getProductStatus(product.stock_quantity) ===
															"Low Stock"
															? "secondary"
															: "destructive"
												}
											>
												{getProductStatus(product.stock_quantity)}
											</Badge>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">Actions</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleEditProduct(product)}
													>
														<Edit className="h-4 w-4 mr-2" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteProduct(product)}
														className="text-destructive focus:text-destructive"
													>
														<Trash className="h-4 w-4 mr-2" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<ProductDialog
				open={productDialogOpen}
				onOpenChange={setProductDialogOpen}
				product={selectedProduct || undefined}
				onSave={handleSaveProduct}
				isSubmitting={isCreating}
			/>

			<DeleteProductDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				product={selectedProduct}
				onDelete={handleDeleteConfirm}
			/>
		</div>
	);
}
