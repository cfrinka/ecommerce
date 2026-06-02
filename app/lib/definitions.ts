import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').trim(),
  email: z.string().email('Please enter a valid email.').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters.').trim(),
});

export const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required.').trim(),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(1, 'Price must be greater than 0.'),
  image: z.string().trim().optional(),
  category: z.string().min(1, 'Category is required.').trim(),
  sizes: z.string().min(1, 'Sizes are required.').trim(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative.'),
  active: z.coerce.number().default(1),
});

export const CheckoutSchema = z.object({
  shippingAddress: z.string().min(5, 'Please enter a valid shipping address.'),
});

export type LoginFormState =
  | { errors?: { email?: string[]; password?: string[] }; message?: string }
  | undefined;

export type SignupFormState =
  | { errors?: { name?: string[]; email?: string[]; password?: string[] }; message?: string }
  | undefined;

export type ProductFormState =
  | { errors?: { name?: string[]; price?: string[]; category?: string[]; sizes?: string[]; stock?: string[] }; message?: string }
  | undefined;
