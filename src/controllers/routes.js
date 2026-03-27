import express from 'express';

import { homePage } from './index.js';
import { organizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { projectsPage, showProjectDetailsPage } from './projects.js';
import { categoriesPage, getCategoryDetails } from './categories.js';
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

export default router;