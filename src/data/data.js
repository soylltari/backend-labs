let users = {
  d1asd1: { id: "d1asd1", name: "Test1" },
  a1sd5d: { id: "a1sd5d", name: "Test2" },
};
let categories = {
  eec9a34b: { id: "eec9a34b", name: "Food" },
};

const { v4: uuidv4 } = require("uuid");

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

const createCategory = (name) => {
  const id = uuidv4();
  const newCategory = { id, name };
  users[id] = newCategory;
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

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  deleteUser,
  createCategory,
  getCategories,
  getCategoryByID,
  deleteCategory,
};
