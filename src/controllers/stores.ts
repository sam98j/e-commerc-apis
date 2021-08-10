import { Request, Response } from "express";
import StoresService from "../services/stores";

export default class StoresController {
    private static storesService = new StoresService();
    // get all the stores handler
    async allStores(req: Request, res: Response){
        try {
            const stores = await StoresController.storesService.allStores();
            res.status(200).send(stores);
        } catch(err) {
            res.status(500).send({err: "internal server error"})
        }
    }
    // get all categories
    async getCategories(req: Request, res: Response){
        try {
            const response = await StoresController.storesService.getCategories();
            res.status(200).send(response)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // get all sub_categs with given category id
    async getSubCategories(req: Request, res: Response){
        const {categ_id} = req.query as {categ_id: string};
        console.log(categ_id);
        try {
            const response = await StoresController.storesService.getSubCategories(categ_id);
            res.status(200).send(response)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // get all products associated with sub category
    async getSubCategsProds(req: Request, res: Response){
        const {sub_categ_id} = req.query as {sub_categ_id: string}
        try {
            const response = await StoresController.storesService.getSubCategsProds(sub_categ_id);
            res.status(200).send(response)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // get top porducts
    async getTopProducts(req: Request, res: Response){
        try {
            const topProducts = await StoresController.storesService.getTopProducts();
            res.status(200).send(topProducts)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // get new porducts
    async getNewProducts(req: Request, res: Response){
        try {
            const newProducts = await StoresController.storesService.getNewProducts();
            res.status(200).send(newProducts)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // follow store
    async followStore(req: Request, res: Response){
        const {store_id} = req.params as {store_id: string};
        const user_id = req.currentUser!;
        try {
            const response = await StoresController.storesService.followStore({user_id, store_id});
            if(response === false) {
                res.status(400).send({err: "err in your request"});
                return
            }
            res.status(200).send({msg: "done"})
        } catch (err) {
            res.status(500).send(err)
        }
    }
    // get all products of specific store
    async getAllProductsOfStore(req: Request, res: Response){
        const {store_id} = req.query as {store_id: string}
        try {
            const products = await StoresController.storesService.getAllProductsByStore(store_id);
            res.send(products)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // get store home page
    async storeHomePage(req: Request, res: Response){
        const {store_id} = req.query as {store_id: string};
        try {
            const resDate = await StoresController.storesService.storeHomePage(store_id);
            if(resDate === false) {
                res.status(400).send({err: "error in your request"});
                return
            }
            res.send(resDate)
        } catch(err) {
            res.status(500).send({err})
        }
    }
}