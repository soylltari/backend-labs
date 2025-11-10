const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const data = require("../data/data.js");

const validate = require("../middlewares/validation.middleware.js");
const { RecordCreateSchema } = require("../schemas/api.schemas.js");

router.use(authMiddleware);

router.post("/", validate(RecordCreateSchema), async (req, res) => {
  const { categoryId, amount } = req.body;
  const userId = req.userId;

  try {
    const newRecord = await data.createRecord(userId, categoryId, amount);

    res.status(201).json(newRecord);
  } catch (error) {
    if (error.message.includes("Insufficient funds.")) {
      return res.status(400).json({ error: error.message });
    }

    console.error("Error creating record:", error);
    res.status(500).json({
      error: "Server error when creating a record.",
      details: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const user_id = req.userId;
    const { category_id } = req.query;

    const records = await data.getFilteredRecords(user_id, category_id);

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Server error when filtering records." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const authenticatedUserId = req.userId;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid record ID." });

    const record = await data.getRecordByID(id, authenticatedUserId);

    if (!record) {
      return res.status(404).json({ error: "No record found." });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: "Error while receiving a record." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const authenticatedUserId = req.userId;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid record ID." });

    const wasDeleted = await data.deleteRecord(id, authenticatedUserId);

    if (!wasDeleted) {
      return res.status(404).json({ error: "No record found." });
    } else {
      res.json({ message: "The record was successfully deleted." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting a record.", details: error.message });
  }
});
module.exports = router;
