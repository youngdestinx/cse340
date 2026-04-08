import { getProjectDetails } from '../models/projects.js';
import { addVolunteer, removeVolunteer, isUserVolunteer } from '../models/volunteer.js';

/**
 * Show project details page
 */
const projectDetail = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session?.user?.user_id; // logged-in user

    try {
        const project = await getProjectDetails(projectId);

        // Check if user is volunteering
        let userIsVolunteer = false;
        if (userId) {
            userIsVolunteer = await isUserVolunteer(userId, projectId);
        }

        res.render('project', {
            project,
            userIsVolunteer,
            userId
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to load project details.');
        res.redirect('/dashboard');
    }
};

/**
 * Add logged-in user as volunteer for a project
 */
const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session?.user?.user_id;

    if (!userId) {
        req.flash('error', 'You must be logged in to volunteer.');
        return res.redirect('/login');
    }

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now volunteering for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error volunteering for project.');
        res.redirect(`/project/${projectId}`);
    }
};

/**
 * Remove logged-in user from project volunteers
 */
const removeVolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session?.user?.user_id;

    if (!userId) {
        req.flash('error', 'You must be logged in to remove yourself.');
        return res.redirect('/login');
    }

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You are no longer volunteering for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error removing volunteer.');
        res.redirect(`/project/${projectId}`);
    }
};

export {
    projectDetail,
    removeVolunteerFromProject,
    volunteerForProject
}
