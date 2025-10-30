const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// === USER & ACCOUNT ===

const createUser = async (name) => {
  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name } });
    await tx.account.create({ data: { balance: 0, userId: user.id } });
    return user;
  });
  return newUser;
};

const getUsers = () => {
  return prisma.user.findMany();
};

const getUserByID = (id) => {
  return prisma.user.findUnique({ where: { id: parseInt(id) } });
};

const deleteUser = (id) => {
  const uId = parseInt(id);

  return prisma.$transaction(async (tx) => {
    await tx.record.deleteMany({
      where: { userId: uId },
    });

    await tx.account.delete({
      where: { userId: uId },
    });

    const deletedUser = await tx.user.delete({
      where: { id: uId },
    });

    return deletedUser;
  });
};

const getAccountBalance = (userId) => {
  return prisma.account.findUnique({
    where: { userId: parseInt(userId) },
    select: { balance: true },
  });
};

// === INCOME ACCOUNTING (Deposit) ===

const depositToAccount = async (userId, amount) => {
  const depositAmount = parseFloat(amount);
  const id = parseInt(userId);

  if (depositAmount <= 0) {
    throw new Error("The deposit amount must be positive.");
  }

  return prisma.account.update({
    where: { userId: id },
    data: { balance: { increment: depositAmount } },
  });
};

// === CATEGORY ===

const createCategory = (name) => {
  return prisma.category.create({ data: { name } });
};

const getCategories = () => {
  return prisma.category.findMany();
};

const deleteCategory = async (id) => {
  const cId = parseInt(id);

  const recordUsingCategory = await prisma.record.findFirst({
    where: { categoryId: cId },
  });

  if (recordUsingCategory) {
    throw new Error(
      "You cannot delete a category because it is used in records."
    );
  }

  return prisma.category.delete({
    where: { id: cId },
  });
};

// === RECORD ===

const createRecord = async (userId, categoryId, amount) => {
  const expenseAmount = parseFloat(amount);
  const uId = parseInt(userId);
  const cId = parseInt(categoryId);

  if (expenseAmount <= 0) {
    throw new Error("The amount of the expense must be positive.");
  }

  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({ where: { userId: uId } });
    if (!account) throw new Error("User account not found.");

    const newBalance = account.balance - expenseAmount;
    if (newBalance < 0) {
      throw new Error(
        "Insufficient funds on the account. The operation is canceled."
      );
    }

    await tx.account.update({
      where: { userId: uId },
      data: { balance: newBalance },
    });

    return tx.record.create({
      data: { userId: uId, categoryId: cId, sum: expenseAmount },
    });
  });
};

const getFilteredRecords = (userId, categoryId) => {
  const uId = userId ? parseInt(userId) : undefined;
  const cId = categoryId ? parseInt(categoryId) : undefined;

  const where = {};
  if (uId) where.userId = uId;
  if (cId) where.categoryId = cId;

  return prisma.record.findMany({ where });
};

const getRecordByID = (id) => {
  return prisma.record.findUnique({
    where: {
      id: id,
    },
  });
};

const deleteRecord = (id) => {
  const recordId = parseInt(id);

  if (isNaN(recordId)) {
    throw new Error("Invalid record ID.");
  }

  return prisma.$transaction(async (tx) => {
    const record = await tx.record.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      return null;
    }
    await tx.record.delete({
      where: { id: recordId },
    });
    await tx.account.update({
      where: { userId: record.userId },
      data: { balance: { increment: record.sum } },
    });

    return true;
  });
};

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  deleteUser,
  getAccountBalance,
  depositToAccount,
  createCategory,
  getCategories,
  deleteCategory,
  createRecord,
  getFilteredRecords,
  getRecordByID,
  deleteRecord,
};
