import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ProductFilters } from "@bytemart/types";

interface ProductSortProps {
	value?: ProductFilters['sortBy'];
	onValueChange: (value: ProductFilters['sortBy']) => void;
}

export function ProductSort({ value = 'featured', onValueChange }: ProductSortProps) {
	return (
		<div className="flex items-center space-x-2">
			<span className="text-sm text-gray-500">Sort by:</span>
			<Select value={value} onValueChange={(value) => onValueChange(value as ProductFilters['sortBy'])}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="featured">Featured</SelectItem>
					<SelectItem value="price_asc">Price: Low to High</SelectItem>
					<SelectItem value="price_desc">Price: High to Low</SelectItem>
					<SelectItem value="name_asc">Name: A to Z</SelectItem>
					<SelectItem value="name_desc">Name: Z to A</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
