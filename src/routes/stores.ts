import { Router } from "express";
import StoresController from "../controllers/stores";
import checkUser from "../middlewares/auth";
const {
    allStores, 
    getCategories,
    getSubCategories, 
    getSubCategsProds,
    getTopProducts,
    getNewProducts,
    followStore,
    getAllProductsOfStore
} = new StoresController()
const storesRouter = Router();
storesRouter.get('/all_stores', allStores)
storesRouter.get('/get_categories', getCategories)
storesRouter.get('/get_sub_categs', getSubCategories)
storesRouter.get('/get_sub_categ_prods', getSubCategsProds)
storesRouter.get('/get_top_products', getTopProducts)
storesRouter.get('/get_new_products', getNewProducts)
storesRouter.post('/follow_store', checkUser,followStore)
storesRouter.get('/get_products_of_store', getAllProductsOfStore)
export default storesRouter