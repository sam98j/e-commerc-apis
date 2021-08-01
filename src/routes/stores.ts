import { Router } from "express";
import StoresController from "../controllers/stores";
const {
    allStores, 
    addStoreTab, 
    addStoreTabContnet,
    getCategories,
    getSubCategories, 
    getSubCategsProds
} = new StoresController()
const storesRouter = Router();
storesRouter.get('/all_stores', allStores)
storesRouter.post('/add_store_tab', addStoreTab)
storesRouter.post('/add_store_tab_content', addStoreTabContnet)
storesRouter.post('/get_all_categories', getCategories)
storesRouter.get('/get_sub_categs', getSubCategories)
storesRouter.post('/get_sub_cate_prods', getSubCategsProds)
export default storesRouter