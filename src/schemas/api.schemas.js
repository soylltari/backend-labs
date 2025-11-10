const { z } = require("zod");

const AuthRegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address format." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
});

const AuthLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address format." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const RecordCreateSchema = z.object({
  amount: z
    .number()
    .min(0.01, { message: "The amount must be a positive number." }),

  categoryId: z.number().int().positive(),
});

const CategoryCreateSchema = z.object({
  name: z.string().min(3).max(128),
});

const AccountDepositSchema = z.object({
  amount: z
    .number()
    .min(0.01, { message: "The amount must be a positive number." }),
});

module.exports = {
  AuthRegisterSchema,
  AuthLoginSchema,
  RecordCreateSchema,
  CategoryCreateSchema,
  AccountDepositSchema,
};
