import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT sp.title, sp.location, sp.date, o.name AS organization
      FROM public.service_projects sp
      JOIN public.organization o
      ON sp.organization_id = o.organization_id
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects};  
