const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// === USER & ACCOUNT ===

const getUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
};

const getUserByID = (id) => {
  return prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      email: true,
    },
  });
};

const deleteUser = (id) => {
  const uId = parseInt(id);

  return prisma.$transaction(async (tx) => {
    await tx.record.deleteMany({
      where: { userId: uId },
    });

    await tx.account.deleteMany({
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

const depositToAccount = (userId, amount) => {
  const uId = parseInt(userId);
  const depositAmount = parseFloat(amount);

  return prisma.$transaction(async (tx) => {
    const userAccount = await tx.account.findUnique({
      where: { userId: uId },
    });

    if (!userAccount) {
      throw new Error("User account not found.");
    }

    const newBalance = userAccount.balance + depositAmount;

    return tx.account.update({
      where: { userId: uId },
      data: { balance: newBalance },
    });
  });
};

// === RECORDS ===

const createRecord = (userId, categoryId, amount) => {
  const uId = parseInt(userId);
  const cId = parseInt(categoryId);
  const expenseAmount = parseFloat(amount);

  if (expenseAmount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  return prisma.$transaction(async (tx) => {
    const userAccount = await tx.account.findUnique({
      where: { userId: uId },
    });

    if (!userAccount) {
      throw new Error("User account not found.");
    }

    const newBalance = userAccount.balance - expenseAmount;

    if (newBalance < 0) {
      throw new Error("Insufficient funds.");
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

const getFilteredRecords = (authenticatedUserId, categoryId) => {
  const uId = parseInt(authenticatedUserId);
  const cId = categoryId ? parseInt(categoryId) : undefined;

  const where = { userId: uId };

  if (cId) {
    where.categoryId = cId;
  }

  return prisma.record.findMany({ where });
};

const getRecordByID = (id, authenticatedUserId) => {
  const recordId = parseInt(id);
  const uId = parseInt(authenticatedUserId);

  return prisma.record.findUnique({
    where: {
      id: recordId,
      userId: uId,
    },
  });
};

const deleteRecord = (id, authenticatedUserId) => {
  const recordId = parseInt(id);
  const uId = parseInt(authenticatedUserId);

  if (isNaN(recordId)) {
    throw new Error("Invalid record ID.");
  }

  return prisma.$transaction(async (tx) => {
    const record = await tx.record.findUnique({
      where: {
        id: recordId,
        userId: uId,
      },
    });

    if (!record) {
      return null;
    }

    const userAccount = await tx.account.findUnique({
      where: { userId: uId },
    });

    if (!userAccount) {
      throw new Error("User account not found during record deletion.");
    }

    const newBalance = userAccount.balance + record.sum;

    await tx.record.delete({
      where: { id: recordId },
    });

    await tx.account.update({
      where: { userId: uId },
      data: { balance: newBalance },
    });

    return true;
  });
};

// === CATEGORIES ===

const getCategories = () => {
  return prisma.category.findMany();
};

const getCategoryByID = (id) => {
  return prisma.category.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

const createCategory = (name) => {
  return prisma.category.create({
    data: {
      name: name,
    },
  });
};

const deleteCategory = async (id) => {
  const categoryId = parseInt(id);

  const relatedRecords = await prisma.record.count({
    where: { categoryId: categoryId },
  });

  if (relatedRecords > 0) {
    throw new Error(
      `Cannot delete category. ${relatedRecords} record(s) are associated with it.`
    );
  }

  const deletedCategory = await prisma.category.deleteMany({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;
};

module.exports = {
  getUsers,
  getUserByID,
  deleteUser,
  getAccountBalance,
  depositToAccount,
  createRecord,
  getFilteredRecords,
  getRecordByID,
  deleteRecord,
  getCategories,
  getCategoryByID,
  createCategory,
  deleteCategory,
};
