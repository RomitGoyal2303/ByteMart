import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryResponse } from "@bytemart/types";
import { AlertTriangle } from "lucide-react";

interface DeleteCategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category: CategoryResponse["allCategories"][number] | null;
	onDelete: (categoryId: string) => void;
}

export function DeleteCategoryDialog({
	open,
	onOpenChange,
	category,
	onDelete,
}: DeleteCategoryDialogProps) {
	if (!category) return null;

	const hasChildren = category.children.length > 0;
	const hasProducts = category.productCount > 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						Delete Category
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the category "{category.name}"?
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					{hasChildren && (
						<div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-md border border-amber-200 dark:border-amber-800">
							<p className="text-sm font-medium">
								Warning: This category has subcategories
							</p>
							<p className="text-xs mt-1">
								Deleting this category will also delete all its subcategories.
							</p>
						</div>
					)}
					{hasProducts && (
						<div className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 rounded-md border border-red-200 dark:border-red-800">
							<p className="text-sm font-medium">
								Warning: This category contains products
							</p>
							<p className="text-xs mt-1">
								This category has {category.productCount} products. Deleting it
								may affect these products.
							</p>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={() => onDelete(category.id)}>
						Delete Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
