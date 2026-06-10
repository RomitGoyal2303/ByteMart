import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";

export const validateQuery = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedQuery = await schema.parseAsync(req.query);
			req.query = validatedQuery;
			next();
		} catch (error) {
			res.status(400).json({
				success: false,
				error: "Invalid query parameters",
				details: error,
			});
		}
	};
}; 