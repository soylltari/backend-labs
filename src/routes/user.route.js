const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

const validate = require("../middlewares/validation.middleware.js");
const {
  UserCreateSchema,
  AccountDepositSchema,
} = require("../schemas/api.schemas.js");

router.post("/", validate(UserCreateSchema), async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = await data.createUser(name);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A user with this name already exists." });
    }
    res
      .status(500)
      .json({ error: "Internal server error.", details: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const userList = await data.getUsers();
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve the list of users." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Incorrect user ID." });

    const user = await data.getUserByID(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error receiving user data." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Incorrect user ID." });

    const wasDeleted = await data.deleteUser(id);

    if (!wasDeleted) {
      return res.status(404).json({ error: "User not found." });
    } else {
      res.json({ message: "The user has been successfully removed" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error when deleting a user.",
      details: error.message,
    });
  }
});

router.post(
  "/:userId/deposit",
  validate(AccountDepositSchema),
  async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { amount } = req.body;

      if (isNaN(userId))
        return res.status(400).json({ error: "Incorrect user ID." });

      const updatedAccount = await data.depositToAccount(userId, amount);

      res.status(200).json({
        message: `The account has been successfully replenished by ${amount}`,
        balance: updatedAccount.balance,
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: "User or account not found." });
      }
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/:id/account", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Incorrect user ID." });
    }

    const account = await data.getAccountBalance(userId);

    if (!account) {
      return res.status(404).json({ error: "User account not found." });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error getting account balance:", error);
    res.status(500).json({ error: "Error getting account balance." });
  }
});
module.exports = router;
