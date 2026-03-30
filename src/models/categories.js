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

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

// Create a new category in the database and return the created category
const createCategory = async ({ name }) => {
  const result = await db.query(
    `INSERT INTO categories (name) VALUES ($1) RETURNING *;`,
    [name]
  );
  return result.rows[0]; // returns the created category
};

const updateCategory = async (categoryId, { name }) => {
  const query = `
    UPDATE categories
    SET name = $1
    WHERE category_id = $2
    RETURNING *;
  `;
  const params = [name, categoryId];
  const result = await db.query(query, params);

  if (result.rows.length === 0) {
    throw new Error('Category not found or update failed');
  }

  return result.rows[0];
};

export {
    getAllProjectsCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};  

