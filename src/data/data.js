let users = {};

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

module.exports = {
  createUser,
  getUsers,
};
