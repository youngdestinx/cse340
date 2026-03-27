import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import {  getCategoriesByProjectId } from '../models/categories.js';

const projectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });

};

const showProjectDetailsPage = async (req, res) => {
    // Extract ID from URL
    const projectId = req.params.id;

    // Get project from database
    const project = await getProjectDetails(projectId);
    // Get category from database
    const categories = await getCategoriesByProjectId(projectId);

    // Render the project details page
    res.render('project', {
        title: project.title,
        project,
        categories
    });
};

export { projectsPage, showProjectsPage, showProjectDetailsPage };