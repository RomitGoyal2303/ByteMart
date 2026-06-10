import { addresses, db, eq, and } from "@bytemart/database";
import type { Request, Response } from "express";
import { z } from "zod";
import { handleError } from "../utils";
import ApiError from "../utils/api-error";

const AddressSchema = z.object({
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional().default(false),
});

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userAddresses = await db.query.addresses.findMany({
      where: eq(addresses.customer_id, req.user.id),
      orderBy: (addresses, { desc }) => [desc(addresses.is_default)],
    });

    res.json({
      success: true,
      data: userAddresses,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;
    if(!addressId) {
        throw ApiError.badRequest("Address ID is required");
    }
    
    const address = await db.query.addresses.findFirst({
      where: and(
        eq(addresses.id, addressId),
        eq(addresses.customer_id, req.user.id)
      ),
    });

    if (!address) {
      throw ApiError.notFound("Address not found");
    }

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const validatedData = AddressSchema.parse(req.body);
    
    // If this address is being set as default, unset any existing default
    if (validatedData.isDefault) {
      await db
        .update(addresses)
        .set({ is_default: false })
        .where(eq(addresses.customer_id, req.user.id));
    }
    
    // If this is the user's first address, make it default regardless of input
    const existingAddresses = await db.query.addresses.findMany({
      where: eq(addresses.customer_id, req.user.id),
    });
    
    const isFirstAddress = existingAddresses.length === 0;
    
    const [result] = await db
      .insert(addresses)
      .values({
        customer_id: req.user.id,
        address_line1: validatedData.addressLine1,
        address_line2: validatedData.addressLine2 || null,
        city: validatedData.city,
        state: validatedData.state,
        postal_code: validatedData.postalCode,
        country: validatedData.country,
        is_default: isFirstAddress ? true : validatedData.isDefault,
      })
      .$returningId();
    
    if (!result) {
      throw ApiError.badRequest("Failed to create address");
    }
    
    const createdAddress = await db.query.addresses.findFirst({
      where: eq(addresses.id, result.id),
    });
    
    res.status(201).json({
      success: true,
      data: createdAddress,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;
    const validatedData = AddressSchema.partial().parse(req.body);

    if(!addressId) {
        throw ApiError.badRequest("Address ID is required");
    }
    
    // Check if address exists and belongs to user
    const existingAddress = await db.query.addresses.findFirst({
      where: and(
        eq(addresses.id, addressId),
        eq(addresses.customer_id, req.user.id)
      ),
    });
    
    if (!existingAddress) {
      throw ApiError.notFound("Address not found");
    }
    
    // If this address is being set as default, unset any existing default
    if (validatedData.isDefault) {
      await db
        .update(addresses)
        .set({ is_default: false })
        .where(eq(addresses.customer_id, req.user.id));
    }
    
    // Update the address
    await db
      .update(addresses)
      .set({
        address_line1: validatedData.addressLine1 !== undefined 
          ? validatedData.addressLine1 
          : existingAddress.address_line1,
        address_line2: validatedData.addressLine2 !== undefined 
          ? validatedData.addressLine2 || null 
          : existingAddress.address_line2,
        city: validatedData.city || existingAddress.city,
        state: validatedData.state || existingAddress.state,
        postal_code: validatedData.postalCode || existingAddress.postal_code,
        country: validatedData.country || existingAddress.country,
        is_default: validatedData.isDefault !== undefined 
          ? validatedData.isDefault 
          : existingAddress.is_default,
      })
      .where(eq(addresses.id, addressId));
    
    const updatedAddress = await db.query.addresses.findFirst({
      where: eq(addresses.id, addressId),
    });
    
    res.json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;

    if(!addressId) {
        throw ApiError.badRequest("Address ID is required");
    }
    
    // Check if address exists and belongs to user
    const existingAddress = await db.query.addresses.findFirst({
      where: and(
        eq(addresses.id, addressId),
        eq(addresses.customer_id, req.user.id)
      ),
    });
    
    if (!existingAddress) {
      throw ApiError.notFound("Address not found");
    }
    
    await db.delete(addresses).where(eq(addresses.id, addressId));
    
    // If the deleted address was default, set another address as default if available
    if (existingAddress.is_default) {
      const remainingAddresses = await db.query.addresses.findMany({
        where: eq(addresses.customer_id, req.user.id),
        orderBy: (addresses, { desc }) => [desc(addresses.created_at)],
        limit: 1,
      })
      
      if (remainingAddresses.length > 0 && remainingAddresses[0]) {
        await db
          .update(addresses)
          .set({ is_default: true })
          .where(eq(addresses.id, remainingAddresses[0].id));
      }
    }
    
    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id;

    if(!addressId) {    
        throw ApiError.badRequest("Address ID is required");
    }
    
    // Check if address exists and belongs to user
    const existingAddress = await db.query.addresses.findFirst({
      where: and(
        eq(addresses.id, addressId),
        eq(addresses.customer_id, req.user.id)
      ),
    });
    
    if (!existingAddress) {
      throw ApiError.notFound("Address not found");
    }
    
    // Unset any existing default
    await db
      .update(addresses)
      .set({ is_default: false })
      .where(eq(addresses.customer_id, req.user.id));
    
    // Set this address as default
    await db
      .update(addresses)
      .set({ is_default: true })
      .where(eq(addresses.id, addressId));
    
    res.json({
      success: true,
      message: "Default address updated successfully",
    });
  } catch (error) {
    handleError(error, res);
  }
};
