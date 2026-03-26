import { getAllProjectsCategories } from '../models/categories.js';

const categoriesPage = async (req, res) => {
    const categories = await getAllProjectsCategories();
    const title = 'Service Projects';

    res.render('categories', { title, categories });
};

export { categoriesPage };