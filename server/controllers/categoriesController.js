const Category = require("../models/Category");

// Obtenir toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Ajouter une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const newCategory = new Category({ name, subcategories });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mettre à jour une catégorie (ajouter un groupe ou un item)
exports.updateCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const categoryId = req.params.id;

    // Trouver la catégorie par ID et la mettre à jour
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, subcategories },
      { new: true, runValidators: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category: updatedCategory });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { group, items } = req.body;

    // Validate input
    if (!group?.trim() || !items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Group and items are required" });
    }

    // Filter out empty strings and ensure items is non-empty
    const validItems = items.filter(item => item?.trim());
    if (validItems.length === 0) {
      return res.status(400).json({ success: false, message: "At least one valid item is required" });
    }

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if the group already exists
    const existingGroup = category.subcategories.find(sub => sub.group === group);
    if (existingGroup) {
      // Add new items to the existing group's items array, avoiding duplicates
      existingGroup.items = [...new Set([...existingGroup.items, ...validItems])];
    } else {
      // Add a new group with the provided items
      category.subcategories.push({ group, items: validItems });
    }

    await category.save();

    res.status(200).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
