const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

router.post("/", (req, res) => {
  const { userId, categoryId, amount } = req.body;
  try {
    const newRecord = data.createRecord(userId, categoryId, amount);
    if (!newRecord) {
      return res
        .status(400)
        .json({ error: "Error creating record. Please check the data." });
    }
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Server error while creating a record." });
  }
});

router.get("/", (req, res) => {
  const { user_id, category_id } = req.query;
  const record = data.getFilteredRecords(user_id, category_id);
  if (!user_id && !category_id) {
    return res
      .status(404)
      .json({
        error:
          "At least one parameter must be specified for filtering: user_id and/or category_id.",
      });
  }
  res.status(200).json(record);
});

router.get("/:id", (req, res) => {
  const record = data.getRecordByID(req.params.id);
  if (!record) {
    return res.status(404).json({ error: "Record is not found" });
  }
  res.status(200).json(record);
});

router.delete("/:id", async (req, res) => {
  const wasDeleted = data.deleteRecord(req.params.id);

  if (!wasDeleted) {
    return res.status(404).json({ error: "Record is not found" });
  } else {
    res.json({ message: "Record was deleted successfully" });
  }
});

module.exports = router;
