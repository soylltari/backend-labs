let users = {
  d1asd1: { id: "d1asd1", name: "Test1" },
  a1sd5d: { id: "a1sd5d", name: "Test2" },
};
let categories = {
  eec9a34b: { id: "eec9a34b", name: "Food" },
  ff53375f: { id: "ff53375f", name: "Travel" },
};
let records = [
  {
    id: "5b3bef80",
    userId: "d1asd1",
    categoryId: "eec9a34b",
    date: "2025-10-18T10:00:00Z",
    amount: 518,
  },
  {
    id: "36b6f119",
    userId: "d1asd1",
    categoryId: "ff53375f",
    date: "2025-10-18T11:00:00Z",
    amount: 250,
  },
  {
    id: "b881292c",
    userId: "a1sd5d",
    categoryId: "ff53375f",
    date: "2025-10-19T12:00:00Z",
    amount: 1000,
  },
];

const { v4: uuidv4 } = require("uuid");

// === USER ===
const createUser = (name) => {
  const id = uuidv4();
  const newUser = { id, name };
  users[id] = newUser;
  return newUser;
};

const getUsers = () => {
  return Object.values(users);
};

const getUserByID = (id) => {
  return users[id];
};

const deleteUser = (id) => {
  if (users[id]) {
    delete users[id];
    return true;
  }
  return false;
};

// === CATEGORY ===
const createCategory = (name) => {
  const id = uuidv4();
  const newCategory = { id, name };
  categories[id] = newCategory;
  return newCategory;
};

const getCategories = () => {
  return Object.values(categories);
};

const getCategoryByID = (id) => {
  return categories[id];
};

const deleteCategory = (id) => {
  if (categories[id]) {
    delete categories[id];
    return true;
  }
  return false;
};

// === RECORD ===
const createRecord = (userId, categoryId, amount) => {
  const id = uuidv4();
  const newRecord = {
    id,
    userId,
    categoryId,
    date: new Date().toISOString(),
    amount: parseFloat(amount),
  };
  records.push(newRecord);
  return newRecord;
};

const getRecordByID = (id) => {
  return records.find((record) => record.id === id);
};

const getFilteredRecords = (userId, categoryId) => {
  let filtered = records;

  if (userId) {
    filtered = filtered.filter((record) => record.userId === userId);
  }

  if (categoryId) {
    filtered = filtered.filter((record) => record.categoryId === categoryId);
  }

  return filtered;
};

const deleteRecord = (id) => {
  const initialLength = records.length;
  records = records.filter((record) => record.id !== id);
  return records.length < initialLength;
};

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  deleteUser,
  createCategory,
  getCategories,
  getCategoryByID,
  deleteCategory,
  createRecord,
  getRecordByID,
  getFilteredRecords,
  deleteRecord,
};
