const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

const validate = require("../middlewares/validation.middleware.js");
const { AccountDepositSchema } = require("../schemas/api.schemas.js");

const authMiddleware = require("../middlewares/auth.middleware");
router.use(authMiddleware);

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
    const authenticatedId = req.userId;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID." });

    if (id !== authenticatedId) {
      return res
        .status(403)
        .json({ error: "Access denied. You can only view your own profile." });
    }

    const user = await data.getUserByID(id);
    if (!user) {
      return res.status(404).json({ error: "No user found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error while receiving a user." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const authenticatedId = req.userId;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID." });

    if (id !== authenticatedId) {
      return res.status(403).json({
        error: "Access denied. You can only delete your own profile.",
      });
    }

    const wasDeleted = await data.deleteUser(id);

    if (!wasDeleted) {
      return res.status(404).json({ error: "No user found." });
    } else {
      res.json({ message: "The user was successfully deleted." });
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
      const authenticatedId = req.userId;
      const { amount } = req.body;

      if (isNaN(userId))
        return res.status(400).json({ error: "Incorrect user ID." });

      if (userId !== authenticatedId) {
        return res.status(403).json({
          error: "Access denied. You can only deposit to your own account.",
        });
      }

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
    const authenticatedId = req.userId;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Incorrect user ID." });
    }

    if (userId !== authenticatedId) {
      return res.status(403).json({
        error: "Access denied. You can only view your own account balance.",
      });
    }

    const account = await data.getAccountBalance(userId);

    if (!account) {
      return res.status(404).json({ error: "Account not found." });
    }

    res.status(200).json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: "Error while receiving account balance." });
  }
});

module.exports = router;
