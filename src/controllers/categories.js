import {
    getAllProjectsCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js'

import { getProjectDetails } from '../models/projects.js';


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


export {
    categoriesPage,
    getCategoryDetails,
    processAssignCategoriesForm,
    showAssignCategoriesForm
 };