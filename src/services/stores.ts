import { AllStoresRes, Product, SubCategories } from "../interfaces/stores.service";
import { 
    storesModel, 
    categoriesModel,
    subCategoriesModel,
    productsModel 
} from "../models/stores";
import UserModel from "../models/users";

export default class StoresService {
    // return back to client all the stores
    async allStores(): Promise<AllStoresRes>{
        return new Promise(async (resolve, reject) => {
            try {
                const stores = await storesModel.find({});
                resolve({stores} as AllStoresRes)
            } catch(err) {
                reject(err)
            }
        })
    };
    // get all categories
    getCategories(): Promise<object>{
        return new Promise(async (resolve, reject) => {
            try {
                const categories = await categoriesModel.find({})
                resolve({categories})
            } catch(err) {
                reject(err)
            }
        })
    }
    // get all sub categories in single category
    async getSubCategories(category_id: string){
        // user send category_id to get all sub_categs in that categ
        return new Promise(async (resolve, reject) => {
            try {
                const sub_categs = await subCategoriesModel.find({category_id})
                resolve({sub_categs})
            } catch(err) {
                reject(err)
            }
        })
    }
    // get all products in sub category
    async getSubCategsProds(sub_category_id: string){
        return new Promise(async (resolve, reject) => {
            try {
                const sub_categs_prods = await productsModel.find({sub_category_id})
                resolve({sub_categs_prods})
            } catch(err) {
                reject(err)
            }
        })
    }
    // get top products
    async getTopProducts(): Promise<{topProducts: Product[]}>{
        return new Promise(async (resolve, reject) => {
            try {
                const Products = await productsModel.find({})
                const topProducts = Products.filter(prod => prod.rate > 0);
                resolve({topProducts})
            } catch(err) {
                reject(err)
            }
        })
    }
    // get new products
    async getNewProducts(): Promise<{newProducts: Product[]}>{
        return new Promise(async (resolve, reject) => {
            try {
                const Products = await productsModel.find({})
                const newProducts = Products.filter(prod => prod.rate > 0);
                resolve({newProducts})
            } catch(err) {
                reject(err)
            }
        })
    }
    // follow store
    async followStore(data: {store_id: string, user_id: string}): Promise<boolean>{
        return new Promise(async (resolve, reject) => {
            const {store_id, user_id} = data;
            if(store_id === "" || store_id === undefined || user_id === "" || store_id === undefined) {
                resolve(false)
            }
            try {
                await UserModel.updateOne({_id: user_id}, {$push: {stores: store_id}});
                resolve(true)
            } catch(err) {
                reject(err)
            }
        })
    }
    // get all products of specififc store
    async getAllProductsByStore(store_id: string): Promise<false | {allProducts: any}>{
        return new Promise(async (resolve, reject) => {
            if(store_id === "" || store_id === undefined) {
                resolve(false)
            }
            try {
                const products = await productsModel.find({store_id});
                const sub_categories_ids = products.map(prod => prod.sub_category_id);
                const sub_categories = await subCategoriesModel.find({_id: {$in: [...sub_categories_ids]}});
                const allProducts = sub_categories.map(sub => {
                    const filteredProds = products.filter(prod => {return prod.sub_category_id == sub._id});
                    return {
                        _id: sub._id,
                        name: sub.name,
                        products: filteredProds
                    }
                })
                resolve({allProducts})
            } catch(err) {
                reject(err)
            }
        })
    }

}