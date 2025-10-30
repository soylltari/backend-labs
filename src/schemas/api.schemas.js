const { z } = require("zod");

const UserCreateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The name must contain at least 3 characters" })
    .max(128, { message: "The name cannot exceed 128 characters." }),
});

const CategoryCreateSchema = z.object({
  name: z.string().min(3).max(128),
});

const RecordCreateSchema = z.object({
  amount: z
    .number()
    .min(0.01, { message: "The amount must be a positive number." }),

  userId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
});

const AccountDepositSchema = z.object({
  amount: z
    .number()
    .min(0.01, { message: "The amount must be a positive number." }),
});

module.exports = {
  UserCreateSchema,
  RecordCreateSchema,
  CategoryCreateSchema,
  AccountDepositSchema,
};
