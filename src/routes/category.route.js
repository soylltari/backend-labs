const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

router.post("/", (req, res) => {
  const { name } = req.body;
  const newCategory = data.createUser(name);
  res.status(201).json(newCategory);
});

router.get("/", (req, res) => {
  const categoryList = data.getCategories();
  res.status(200).json(categoryList);
});

router.get("/:id", (req, res) => {
  const category = data.getCategoryByID(req.params.id);
  if (!category) {
    return res.status(404).json({ error: "Category is not found" });
  }
  res.status(200).json(category);
});

router.delete("/:id", async (req, res) => {
  const wasDeleted = data.deleteCategory(req.params.id);

  if (!wasDeleted) {
    return res.status(404).json({ error: "Category is not found" });
  } else {
    res.json({ message: "Category was deleted successfully" });
  }
});

module.exports = router;
