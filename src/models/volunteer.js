import db from './db.js'

const addVolunteer = async (user_id, project_id) => {
    const query = `
        INSERT INTO volunteers (user_id, project_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const query_params = [user_id, project_id]
    const result = await db.query(query, query_params);
    return result.rows[0];
};

const removeVolunteer = async (user_id, project_id) => {
    const query = `
        DELETE FROM volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING *;
    `;

    const query_params = [user_id, project_id]
    const result = await db.query(query, query_params);
    return result.rows[0]; // null if nothing deleted
};

const getUserProjects = async (user_id) => {
    const query = `
        SELECT p.*
        FROM service_projects p
        JOIN volunteers v ON p.project_id = v.project_id
        WHERE v.user_id = $1
        ORDER BY v.volunteered_at DESC;
    `;

    const query_params = [user_id]
    const result = await db.query(query, query_params);
    return result.rows;
   
};

const isUserVolunteer = async (user_id, project_id) => {
    const query = `
        SELECT 1 FROM volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [user_id, project_id]);
    return result.rows.length > 0;
};

export {
    addVolunteer,
    removeVolunteer,
    getUserProjects,
    isUserVolunteer
}