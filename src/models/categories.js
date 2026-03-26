import db from './db.js'

const getAllProjectsCategories = async() => {
    const query = `
      SELECT c.name AS category, ARRAY_AGG(sp.title) AS projects
      FROM public.categories c
      JOIN public.project_categories pc ON c.category_id = pc.category_id
      JOIN public.service_projects sp ON sp.project_id = pc.project_id
      GROUP BY c.name;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjectsCategories};  

