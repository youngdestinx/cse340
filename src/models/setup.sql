-- =======================================
-- Organization Table
-- =======================================
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filenme VARCHAR(255) NOT NULL
);

-- =======================================
-- Insert sample data: Organizations
-- =======================================
INSERT INTO organization (name, description, contact_email, logo_filenme)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving communityinfrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'a volunteer coordination group supporting local charities and service initiatives', 'hello@unityserve.org', 'unityserve-logo.png');


-- =======================================
-- Service_Projects Table
-- =======================================
CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


-- =======================================
-- Insert sample data: Service_Projects
-- =======================================
INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
(1, 'School Renovation', 'Renovating classrooms for better learning', 'Lagos Mainland', '2026-04-10'),
(1, 'Bridge Construction', 'Building a pedestrian bridge', 'Ikorodu', '2026-05-15'),
(1, 'Water Supply Project', 'Installing clean water systems', 'Badagry', '2026-06-01'),
(1, 'Road Repair Initiative', 'Fixing damaged community roads', 'Yaba', '2026-06-20'),
(1, 'Community Housing Build', 'Constructing low-cost housing', 'Epe', '2026-07-05');

INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
(2, 'Urban Garden Setup', 'Creating community gardens', 'Surulere', '2026-04-12'),
(2, 'Farmers Training Program', 'Training locals on sustainable farming', 'Agege', '2026-05-10'),
(2, 'School Farming Project', 'Teaching students farming skills', 'Ikeja', '2026-05-25'),
(2, 'Composting Initiative', 'Promoting organic waste recycling', 'Lekki', '2026-06-18'),
(2, 'Food Distribution Drive', 'Providing fresh produce to families', 'Ajah', '2026-07-02');

INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
(3, 'Charity Outreach', 'Supporting orphanages', 'Victoria Island', '2026-04-08'),
(3, 'Medical Volunteer Program', 'Free health checkups', 'Mushin', '2026-05-05'),
(3, 'School Supplies Donation', 'Providing books and materials', 'Oshodi', '2026-05-22'),
(3, 'Community Cleanup', 'Environmental sanitation project', 'Festac', '2026-06-10'),
(3, 'Youth Mentorship Program', 'Guiding young people', 'Alimosho', '2026-07-01');



-- =======================================
-- Categories Table
-- =======================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- =======================================
-- Insert sample data: Categories
-- =======================================
INSERT INTO categories (name)
VALUES 
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');



-- =======================================
-- Project_Categories Table
-- =======================================
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);


-- =======================================
-- Insert sample data: Projects_Categories
-- =======================================
INSERT INTO project_categories (project_id, category_id)
VALUES
-- Environmental (1)
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(14, 1),
-- Educational (2)
(1, 2),
(8, 2),
(13, 2),
(15, 2),
-- Community Service (3)
(2, 3),
(4, 3),
(5, 3),
(11, 3),
(13, 3),
-- Health and Wellness (4)
(3, 4),
(10, 4),
(12, 4);


CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;

-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';

UPDATE users SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin') WHERE user_id = 3;

-- Verify the update by listing all users and their roles
SELECT users.user_id, users.email, roles.role_name FROM users JOIN roles ON users.role_id = roles.role_id;

CREATE TABLE volunteers (
    volunteer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES service_projects(project_id) ON DELETE CASCADE,
    UNIQUE (user_id, project_id)
);