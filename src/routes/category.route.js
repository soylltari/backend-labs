const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

const validate = require("../middlewares/validation.middleware.js");
const { CategoryCreateSchema } = require("../schemas/api.schemas.js");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const categories = await data.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ error: "Server error when retrieving categories." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    const category = await data.getCategoryByID(id);

    if (!category) {
      return res.status(404).json({ error: "No category found." });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error while receiving a category." });
  }
});

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
    console.error("Error creating category:", error);
    res.status(500).json({
      error: "Server error when creating a category.",
      details: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    const wasDeleted = await data.deleteCategory(id);

    if (!wasDeleted) {
      return res.status(404).json({ error: "No category found." });
    } else {
      res.json({ message: "The category was successfully deleted." });
    }
  } catch (error) {
    if (error.message.includes("Cannot delete category.")) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: "Error deleting a category.", details: error.message });
  }
});

module.exports = router;
