import db from './db.js'

const getAllProjectsCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
}

// Get a single category be Id
const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.categories
        WHERE category_id = $1;
    `;
    const query_params = [id];
    const result = await db.query(query, query_params);
    return result.rows[0];
};

// Get all categories for a projects
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.categories c
        JOIN public.project_categories pc 
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const query_params = [projectId];
    const result = await db.query(query, query_params);
    return result.rows;
};

// Get all projects for a category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.date
        FROM public.service_projects sp
        JOIN public.project_categories pc 
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1;
    `;
    const query_params = [categoryId];
    const result = await db.query(query, query_params);
     return result.rows;
};

export {getAllProjectsCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId};  

