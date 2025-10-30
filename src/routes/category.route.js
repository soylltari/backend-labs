const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

const validate = require("../middlewares/validation.middleware.js");
const { CategoryCreateSchema } = require("../schemas/api.schemas.js");

router.post("/", validate(CategoryCreateSchema), async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await data.createCategory(name);

    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A category with this name already exists." });
    }
    res.status(500).json({
      error: "Server error when creating a category.",
      details: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const categoryList = await data.getCategories();

    res.status(200).json(categoryList);
  } catch (error) {
    res.status(500).json({ error: "Server error when receiving categories." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "Incorrect category ID." });

    const category = await data.getCategoryByID(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error getting a category." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ error: "Incorrect category ID." });

    const wasDeleted = await data.deleteCategory(id);

    if (!wasDeleted) {
      return res.status(404).json({ error: "Category not found." });
    } else {
      res.json({ message: "The category was successfully deleted." });
    }
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(409).json({
        error: "Cannot delete: the category is used in existing records.",
      });
    }
    res.status(500).json({
      error: "Error deleting a category.",
      details: error.message,
    });
  }
});

module.exports = router;
