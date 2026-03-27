import { getAllProjectsCategories } from '../models/categories.js';
import  {getCategoryById, getProjectsByCategoryId} from '../models/categories.js'


const categoriesPage = async (req, res) => {
    const categories = await getAllProjectsCategories();
    const title = 'Service Projects';

    res.render('categories', { title, categories });
};

const getCategoryDetails = async (req, res) => {
    const { id } = req.params;

    const category = await getCategoryById(id);
    const projects = await getProjectsByCategoryId(id);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};


export { categoriesPage, getCategoryDetails };