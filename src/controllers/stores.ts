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

    async addStoreTab(req: Request, res: Response){
        
    }

    async addStoreTabContnet(req: Request, res: Response){
        
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
}