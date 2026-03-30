import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT sp.title, sp.location, sp.date, o.name AS organization
      FROM public.service_projects sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.service_projects 
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const query_params = [organizationId];
      const result = await db.query(query, query_params);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM public.service_projects p
    JOIN public.organization o
      ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;
  const query_params = [number_of_projects];
  const result = await db.query(query, query_params);

  // Return rows as an array of project objects
  return result.rows;
};

// Function to get details of a single project by its ID
const getProjectDetails = async (projectId) => {
    const query = `
      SELECT 
        p.project_id,
        p.title,
        p.description,
        p.date,
        p.location,
        p.organization_id,
        o.name AS organization_name
      FROM public.service_projects p
      JOIN public.organization o
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1;
    `;
      const query_params = [projectId];
      const result = await db.query(query, query_params);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO service_projects (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const query_params = [title, description, location, date, organizationId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (
  projectId,
  { title, description, date, organization_id }
) => {
  const query = `
    UPDATE public.service_projects
    SET 
      title = $1,
      description = $2,
      date = $3,
      organization_id = $4
    WHERE project_id = $5
    RETURNING *;
  `;

  const query_params = [title, description, date, organization_id, projectId];

  const result = await db.query(query, query_params);

  // If nothing was updated
  if (result.rows.length === 0) {
    throw new Error('Project not found or update failed');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated Projects with ID:', projectId);
  }

  return result.rows[0];
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject
};  
