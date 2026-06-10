import { useAddCategory } from "@/features/category/api/add-category";
import { useDeleteCategory } from "@/features/category/api/delete-category";
import { useCategories } from "@/features/category/api/get-category";
import type { Category, CategoryResponse } from "@bytemart/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/categories")({
	component: CategoriesPage,
});

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CategoryDialog } from "@/features/category/components/category-dialog";
import { DeleteCategoryDialog } from "@/features/category/components/delete-category.dialog";
import { cn } from "@/lib/utils";
import {
	ChevronDown,
	ChevronRight,
	Edit,
	Folder,
	FolderPlus,
	MoreHorizontal,
	Plus,
	Search,
	Trash,
} from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
	const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<
		CategoryResponse["allCategories"][number] | null
	>(null);
	const [editMode, setEditMode] = useState(false);

	const { data: categoriesData, isLoading } = useCategories({});
	const addCategoryMutation = useAddCategory({});
	const deleteCategoryMutation = useDeleteCategory({});

	console.log(categoriesData);

	// const categories = categoriesData?.data?.allCategories.map(transformCategory) || []
	const categories = categoriesData?.data?.allCategories || [];
	const parentCategories = categoriesData?.data?.parentCategories || [];

	// Function to toggle category expansion
	const toggleCategory = (categoryId: string) => {
		if (expandedCategories.includes(categoryId)) {
			setExpandedCategories(
				expandedCategories.filter((id) => id !== categoryId),
			);
		} else {
			setExpandedCategories([...expandedCategories, categoryId]);
		}
	};

	const handleCreateCategory = async (category: {
		name: string;
		parentId?: string;
	}) => {
		try {
			await addCategoryMutation.mutateAsync({ category });
			setCategoryDialogOpen(false);
		} catch (error) {
			console.error("Failed to create category:", error);
		}
	};

	// Function to handle category update
	// const handleUpdateCategory = async (updatedCategory: Omit<CategoryWithUI, "children">) => {
	//   try {
	//     // TODO: Implement when edit mutation is ready
	//     // await editCategoryMutation.mutateAsync({
	//     //   categoryId: updatedCategory.id,
	//     //   category: updatedCategory
	//     // })
	//     setCategoryDialogOpen(false)
	//     setEditMode(false)
	//     setSelectedCategory(null)
	//   } catch (error) {
	//     console.error('Failed to update category:', error)
	//     // TODO: Add error handling UI
	//   }
	// }

	// Function to handle category deletion
	const handleDeleteCategory = async (categoryId: string) => {
		try {
			await deleteCategoryMutation.mutateAsync({ categoryId });
			setDeleteDialogOpen(false);
			setSelectedCategory(null);
		} catch (error) {
			console.error("Failed to delete category:", error);
			// TODO: Add error handling UI
		}
	};

	// Function to open edit dialog
	// const openEditDialog = (category: CategoryWithUI) => {
	//   setSelectedCategory(category)
	//   setEditMode(true)
	//   setCategoryDialogOpen(true)
	// }

	// Function to open delete dialog
	// const openDeleteDialog = (category: CategoryWithUI) => {
	//   setSelectedCategory(category)
	//   setDeleteDialogOpen(true)
	// }

	// Function to open add subcategory dialog
	const openAddSubcategoryDialog = (
		parentCategory: CategoryResponse["allCategories"][number],
	) => {
		setSelectedCategory(parentCategory);
		setEditMode(false);
		setCategoryDialogOpen(true);
	};

	// Function to render category tree
	const renderCategoryTree = (
		categoryList: CategoryResponse["allCategories"],
		level = 0,
	) => {
		return categoryList.map((category) => {
			const isExpanded = expandedCategories.includes(category.id);
			const hasChildren = category.children.length > 0;

			return (
				<div key={category.id} className="category-item">
					<div
						className={cn(
							"flex items-center py-2 px-4 hover:bg-muted rounded-md transition-colors",
							level > 0 && "ml-6",
						)}
					>
						{hasChildren ? (
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 mr-1"
								onClick={() => toggleCategory(category.id)}
							>
								{isExpanded ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>
						) : (
							<div className="w-7" />
						)}
						<Folder className="h-5 w-5 mr-2 text-muted-foreground" />
						<div className="flex-1">
							<div className="font-medium">{category.name}</div>
						</div>
						<Badge variant="outline" className="mr-2">
							{category.productCount} products
						</Badge>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{/* <DropdownMenuItem onClick={() => openEditDialog(category)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Category
                </DropdownMenuItem> */}
								<DropdownMenuItem
									onClick={() => openAddSubcategoryDialog(category)}
								>
									<FolderPlus className="h-4 w-4 mr-2" />
									Add Subcategory
								</DropdownMenuItem>
								{/* <DropdownMenuItem
                  onClick={() => openDeleteDialog(category)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Category
                </DropdownMenuItem> */}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{isExpanded && hasChildren && (
						<div className="ml-4 border-l pl-2 mt-1 mb-1">
							{renderCategoryTree(category.children, level + 1)}
						</div>
					)}
				</div>
			);
		});
	};

	const filterCategories = (
		cats: CategoryResponse["allCategories"],
		query: string,
	): CategoryResponse["allCategories"] => {
		if (!query) return cats;

		return cats
			.filter((cat) => cat.name.toLowerCase().includes(query.toLowerCase()))
			.map((cat) => ({
				...cat,
				children: filterCategories(cat.children, query),
			}))
			.filter(
				(cat) =>
					cat.children.length > 0 ||
					cat.name.toLowerCase().includes(query.toLowerCase()),
			);
	};

	const filteredCategories = filterCategories(categories, searchQuery);

	if (isLoading) {
		return <div>Loading categories...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="relative w-full sm:w-[300px]">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search categories..."
						className="w-full pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Button
					onClick={() => {
						setSelectedCategory(null);
						setEditMode(false);
						setCategoryDialogOpen(true);
					}}
					className="gap-1"
				>
					<Plus className="h-4 w-4" />
					Add Category
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Categories</CardTitle>
					<CardDescription>
						Manage your product categories and subcategories
					</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredCategories.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No categories found. Try adjusting your search or create a new
							category.
						</div>
					) : (
						<div className="space-y-1">
							{renderCategoryTree(filteredCategories)}
						</div>
					)}
				</CardContent>
			</Card>

			<CategoryDialog
				open={categoryDialogOpen}
				onOpenChange={setCategoryDialogOpen}
				categories={categories}
				selectedCategory={selectedCategory}
				editMode={editMode}
				onSave={handleCreateCategory}
			/>

			<DeleteCategoryDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				category={selectedCategory}
				onDelete={handleDeleteCategory}
			/>
		</div>
	);
}
