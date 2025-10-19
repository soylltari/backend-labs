let users = {
  "1d1asd1": { id: "1d1asd1", name: "Test1" },
  "2a1sd5d": { id: "2a1sd5d", name: "Test2" },
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

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  deleteUser,
};
