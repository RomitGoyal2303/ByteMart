import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useCategories } from "@/features/category/api/get-category";
import type { ProductFilters } from "@bytemart/types";
import { useState } from "react";

interface ProductFiltersProps {
	initialFilters?: ProductFilters;
	onFiltersChange: (filters: ProductFilters) => void;
}

const CategoryItem = ({ category, selectedCategories, onToggle }: {
	category: any;
	selectedCategories: string[];
	onToggle: (id: string) => void;
}) => (
	<div className="space-y-2">
		<div className="flex items-center space-x-2">
			<Checkbox
				id={`category-${category.id}`}
				checked={selectedCategories.includes(category.id)}
				onCheckedChange={() => onToggle(category.id)}
			/>
			<Label htmlFor={`category-${category.id}`}>{category.name}</Label>
		</div>
		{category.children && (
			<div className="ml-4 space-y-2">
				{category.children.map((child: any) => (
					<div key={child.id} className="flex items-center space-x-2">
						<Checkbox
							id={`category-${child.id}`}
							checked={selectedCategories.includes(child.id)}
							onCheckedChange={() => onToggle(child.id)}
						/>
						<Label htmlFor={`category-${child.id}`}>{child.name}</Label>
					</div>
				))}
			</div>
		)}
	</div>
);

export function ProductFilters({ initialFilters, onFiltersChange }: ProductFiltersProps) {
	const [priceRange, setPriceRange] = useState([0, 20000]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const { data: categoriesResponse } = useCategories({});
	const categories = categoriesResponse?.data?.allCategories ?? [];
	console.log(categories);

	const handleCategoryToggle = (categoryId: string) => {
		setSelectedCategories(prev =>
			prev.includes(categoryId)
				? prev.filter(id => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	const handleReset = () => {
		setPriceRange([0, 20000]);
		setSelectedCategories([]);
		onFiltersChange({});
	};

	const handleApply = () => {
		onFiltersChange({
			minPrice: priceRange[0],
			maxPrice: priceRange[1],
			categoryId: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
		});
	};

	return (
		<div className="bg-white p-4 rounded-lg border">
			<h2 className="font-semibold text-lg mb-4">Filters</h2>

			<Accordion type="multiple" defaultValue={["price", "categories"]}>
				<AccordionItem value="price">
					<AccordionTrigger>Price Range</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-4">
							<Slider
								defaultValue={[0, 20000]}
								max={20000}
								step={10}
								value={priceRange}
								onValueChange={setPriceRange}
							/>
							<div className="flex items-center justify-between">
								<span>Rs {priceRange[0]}</span>
								<span>Rs {priceRange[1]}</span>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Category Filter */}
				<AccordionItem value="categories">
					<AccordionTrigger>Categories</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-4">
							{categories.map((category) => (
								<CategoryItem
									key={category.id}
									category={category}
									selectedCategories={selectedCategories}
									onToggle={handleCategoryToggle}
								/>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<div className="mt-6 space-x-2 flex">
				<Button variant="outline" className="flex-1" onClick={handleReset}>
					Reset
				</Button>
				<Button className="flex-1" onClick={handleApply}>
					Apply
				</Button>
			</div>
		</div>
	);
}
