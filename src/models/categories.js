import db from './db.js'

const getAllProjectsCategories = async() => {
    const query = `
        SELECT sp.title AS title, c.name AS category
      FROM public.service_projects sp
      JOIN public.project_categories pc ON sp.project_id = pc.project_id
      JOIN public.categories c ON pc.category_id = c.category_id
      ORDER BY sp.project_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjectsCategories};  

