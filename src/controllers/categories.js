import { body, validationResult } from 'express-validator';

import {
    getAllProjectsCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js'

import { getProjectDetails } from '../models/projects.js';

// Validation rules
const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters')
];


const categoriesPage = async (req, res) => {
    const categories = await getAllProjectsCategories();
    const title = 'Service Projects';

    res.render('categories', { title, categories });
};

const getCategoryDetails = async (req, res) => {
    const { id } = req.params;

    const category = await getCategoryById(id);
    const projects = await getProjectsByCategoryId(id);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllProjectsCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Show the category form
const showCreateCategoryForm = (req, res) => {
  res.render('create-category', {
    title: 'Create New Category',
    errors: [],
    formData: {}
  });
};

//Process the category form
const processCreateCategoryForm = async (req, res) => {
  // Check for validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Flash each validation error
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to the create category form
    return res.redirect('/new-category');
  }

  // Extract form data
  const { name } = req.body;

  try {
    // Create category in database
    const newCategory = await createCategory({ name });

    // Flash success message and redirect to categories list
    req.flash('success', 'New category created successfully!');
    res.redirect('/categories');
  } catch (error) {
    console.error('Error creating category:', error);
    req.flash('error', 'There was an error creating the category.');
    res.redirect('/new-category');
  }
};


const DisplayEditCategoryForm = async (req, res, next) => {
  const { id } = req.params;
  const category = await getCategoryById(id);

  if (!category) {
    req.flash('error', 'Category not found');
    return res.redirect('/categories');
  }

  res.render('edit-category', {
    title: 'Edit Category',
    category,
    formData: category // to populate the form fields
  });
};


const processEditCategoryForm = async (req, res, next) => {
  const { id } = req.params;

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-category/${id}`);
  }

  const { name } = req.body;

  try {
    await updateCategory(id, { name });
    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
  } catch (error) {
    console.error('Error updating category:', error);
    req.flash('error', 'There was an error updating the category.');
    res.redirect(`/edit-category/${id}`);
  }
};

export {
    categoriesPage,
    getCategoryDetails,
    processAssignCategoriesForm,
    showAssignCategoriesForm,
    processCreateCategoryForm,
    showCreateCategoryForm,
    categoryValidationRules,
    processEditCategoryForm,
    DisplayEditCategoryForm
 };