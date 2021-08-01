import { AllStoresRes, Product, StoreTab, StoreTabSection } from "../interfaces/stores.service";
import { 
    storesModel, 
    storeTabModel, 
    sectionProductModel, 
    tabSectionModel,
    categoriesModel,
    subCategoriesModel,
    productsModel 
} from "../models/stores";

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

    async addStoreTab(data: {name: string, store_id: string}): Promise<true>{
        const {name, store_id} = data;
        return new Promise(async (resolve, reject) => {
            try {
                const newStoreTab = {
                    name,
                    store_id
                } as StoreTab
                await storeTabModel.insertMany([newStoreTab]);
                resolve(true)
            } catch(err) {
                reject(err)
            }
        })
    }

    async addTabSection(data: {tab_id: string, name: string}){
        const {name, tab_id} = data;
        return new Promise(async (resolve, reject) => {
            try {
                const newTabSection = {
                    name,
                    tab_id
                } as StoreTabSection
                await tabSectionModel.insertMany([newTabSection]);
                resolve(true)
            } catch(err) {
                reject(err)
            }
        })
    }

    async addProductInTab(data: Product){
        const {name, section_id, price, img, category_id, sub_category_id} = data;
        return new Promise(async (resolve, reject) => {
            try {
                const newSectionProduct = {name, img, section_id, price, category_id, rate: 0, sub_category_id} as Product
                await sectionProductModel.insertMany([newSectionProduct]);
                resolve(true)
            } catch(err) {
                reject(err)
            }
        })
    }
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
}