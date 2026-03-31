import express from 'express';

import { homePage } from './index.js';
import {
    organizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './organizations.js';

import { projectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './projects.js';

import {
    categoriesPage,
    getCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategoryForm,
    processCreateCategoryForm,
    categoryValidationRules,
    processEditCategoryForm,
    DisplayEditCategoryForm
} from './categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
} from './users.js'

import { testErrorPage } from './errors.js';


const router = express.Router();

router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/projects', projectsPage);
router.get('/categories', categoriesPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Route for category details page
router.get('/category/:id', getCategoryDetails);

// error-handling routes
router.get('/test-error', testErrorPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Show edit form
router.get('/edit-project/:projectId', showEditProjectForm);

// Process edit form
router.post('/edit-project/:projectId', processEditProjectForm);

// Routes to handle new categoories formm
router.get('/new-category', showCreateCategoryForm);
router.post('/new-category', categoryValidationRules, processCreateCategoryForm);

router.get('/edit-category/:id', DisplayEditCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, processEditCategoryForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);

export default router;