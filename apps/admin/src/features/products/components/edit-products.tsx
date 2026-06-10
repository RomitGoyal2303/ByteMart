import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category, ProductResponse } from "@bytemart/types";
import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCategories } from "@/features/category/api/get-category";

type CategoryGG = {
	id: string;
} & Category;
interface ProductDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: ProductResponse;
	onSave: (product: Partial<ProductResponse>, imageFile?: File) => void;
	isSubmitting?: boolean;
}

export function ProductDialog({
	open,
	onOpenChange,
	product,
	onSave,
	isSubmitting = false,
}: ProductDialogProps) {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState(0);
	const [status, setStatus] = useState("Active");
	const [image, setImage] = useState("/placeholder.svg");
	const [description, setDescription] = useState("");
	const [imageFile, setImageFile] = useState<File | undefined>(undefined);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({});

	const isEditMode = !!product;

	useEffect(() => {
		if (open && product) {
			setName(product.name);
			setCategory(product.category_id || "");
			setPrice(`${product.price}` || "");
			setStock(product.stock_quantity || 0);
			setStatus(product.stock_quantity ? "Active" : "Out of Stock");
			setImage(product.image_url || "/placeholder.svg");
			setDescription(product.description || "");
			setImageFile(undefined);
		} else if (open) {
			setName("");
			setCategory("");
			setPrice("");
			setStock(0);
			setStatus("Active");
			setImage("/placeholder.svg");
			setDescription("");
			setImageFile(undefined);
		}
	}, [open, product]);

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const previewUrl = URL.createObjectURL(file);
			setImage(previewUrl);
		}
	};

	const handleSubmit = () => {
		if (!name || !category || !price) return;
		
		const productData = {
			name,
			description,
			price,
			stock_quantity: Number(stock),
			category_id: category,
			image_url: image === "/placeholder.svg" ? undefined : image,
		};

		onSave(productData, imageFile);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Edit Product" : "Add Product"}
					</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update the details of this product."
							: "Fill in the details to create a new product."}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Product Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Product name"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="category">Category</Label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger id="category">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{isLoadingCategories ? (
										<SelectItem value="loading" disabled>
											Loading categories...
										</SelectItem>
									) : categoriesData?.data?.allCategories ? (
										categoriesData.data.allCategories.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.name}
											</SelectItem>
										))
									) : (
										<SelectItem value="none" disabled>
											No categories available
										</SelectItem>
									)}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="price">Price</Label>
							<div className="relative">
								<span className="absolute left-3 top-2.5">$</span>
								<Input
									id="price"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="0.00"
									className="pl-7"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="stock">Stock</Label>
							<Input
								id="stock"
								type="number"
								value={stock}
								onChange={(e) => setStock(Number.parseInt(e.target.value) || 0)}
								min={0}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="status">Status</Label>
							<Select value={status} onValueChange={setStatus}>
								<SelectTrigger id="status">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Low Stock">Low Stock</SelectItem>
									<SelectItem value="Out of Stock">Out of Stock</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Product description"
							rows={3}
						/>
					</div>

					<div className="grid gap-2">
						<Label>Product Image</Label>
						<div className="flex items-center gap-4">
							<div className="border rounded-md w-24 h-24 flex items-center justify-center overflow-hidden">
								<img
									src={image || "/placeholder.svg"}
									alt="Product preview"
									className="max-w-full max-h-full object-contain"
								/>
							</div>
							<Button
								variant="outline"
								type="button"
								className="h-10 gap-2"
								onClick={handleImageClick}
							>
								<ImagePlus className="h-4 w-4" />
								Upload Image
							</Button>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={handleImageChange}
							/>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Recommended size: 800x800px. Max file size: 5MB.
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!name || !category || !price || isSubmitting || isLoadingCategories}
					>
						{isSubmitting
							? "Saving..."
							: isEditMode
								? "Save Changes"
								: "Create Product"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
