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
import type { CategoryResponse } from "@bytemart/types";
import { useEffect, useState } from "react";

interface CategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: CategoryResponse["allCategories"];
	selectedCategory: CategoryResponse["allCategories"][number] | null;
	editMode: boolean;
	onSave: (category: {
		name: string;
		parentId?: string;
	}) => void | Promise<void>;
}

export function CategoryDialog({
	open,
	onOpenChange,
	categories,
	selectedCategory,
	editMode,
	onSave,
}: CategoryDialogProps) {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [parentId, setParentId] = useState<string | null>(null);
	const [productCount, setProductCount] = useState(0);

	useEffect(() => {
		if (open && selectedCategory && editMode) {
			setName(selectedCategory.name);
			setSlug(selectedCategory.slug);
			setParentId(selectedCategory.parentId);
			setProductCount(selectedCategory.productCount);
		} else if (open && selectedCategory && !editMode) {
			setName("");
			setSlug("");
			setParentId(selectedCategory.id);
			setProductCount(0);
		} else if (open) {
			setName("");
			setSlug("");
			setParentId(null);
			setProductCount(0);
		}
	}, [open, selectedCategory, editMode]);

	const handleNameChange = (value: string) => {
		setName(value);
		setSlug(
			value
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, ""),
		);
	};

	const handleSubmit = () => {
		if (!name) return;
		onSave({
			name,
			parentId: parentId || undefined,
		});

		onOpenChange(false);
	};

	const flattenCategories = (
		cats: CategoryResponse["allCategories"],
		level = 0,
	): { id: string; name: string; level: number }[] => {
		return cats.reduce(
			(acc, cat) => {
				return [
					...acc,
					{ id: cat.id, name: cat.name, level },
					...flattenCategories(cat.children, level + 1),
				];
			},
			[] as { id: string; name: string; level: number }[],
		);
	};

	const flatCategories = flattenCategories(categories);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{editMode
							? "Edit Category"
							: selectedCategory
								? "Add Subcategory"
								: "Add Category"}
					</DialogTitle>
					<DialogDescription>
						{editMode
							? "Update the details of this category."
							: "Fill in the details to create a new category."}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="Category name"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="slug">Slug</Label>
						<Input
							id="slug"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							placeholder="category-slug"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="parent">Parent Category</Label>
						<Select
							value={parentId || ""}
							onValueChange={(value) => setParentId(value || null)}
							disabled={editMode && selectedCategory?.parentId === null}
						>
							<SelectTrigger id="parent">
								<SelectValue placeholder="Select a parent category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None (Top Level)</SelectItem>
								{flatCategories
									.filter((cat) => !editMode || cat.id !== selectedCategory?.id)
									.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{Array(cat.level).fill("—").join("")}{" "}
											{cat.level > 0 && "› "}
											{cat.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
					{editMode && (
						<div className="grid gap-2">
							<Label htmlFor="productCount">Product Count</Label>
							<Input
								id="productCount"
								type="number"
								value={productCount}
								onChange={(e) =>
									setProductCount(Number.parseInt(e.target.value) || 0)
								}
								min={0}
							/>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!name}>
						{editMode ? "Save Changes" : "Create Category"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
