import mongoose, { Document, Model } from 'mongoose';
import { Categories, Product, Store, StoreTab, StoreTabSection, SubCategories } from '../interfaces/stores.service';

const storeSchema = new mongoose.Schema<Store, Model<Store>>({
    name: String
})

const storeTabSchema = new mongoose.Schema<StoreTab, Model<StoreTab>>({
    name: String,
    store_id: String
})

const tabSectionSchema = new mongoose.Schema<StoreTabSection, Model<StoreTabSection>>({
    name: String,
    tab_id: String
})

const sectionProductSchema = new mongoose.Schema<Product, Model<Product>>({
    name: String,
    img: String,
    price: Number,
    rate: Number,
    section_id: String  
})

const categorySchema = new mongoose.Schema<Categories, Model<Categories>>({
    name: String,
})

const subCategorySchema = new mongoose.Schema<SubCategories, Model<SubCategories>>({
    name: String,
    category_id: String
})

const ProductSchema = new mongoose.Schema<Product, Model<Product>>({
    name: String,
    category_id: String,
    sub_category_id: String,
    rate: Number,
    price: Number,
    img: String
})

export const storesModel = mongoose.model('stores', storeSchema);
export const storeTabModel = mongoose.model('store_tabs', storeTabSchema);
export const tabSectionModel = mongoose.model('tabs_content', tabSectionSchema);
export const sectionProductModel = mongoose.model('tabs_content_items', sectionProductSchema);
export const subCategoriesModel = mongoose.model('sub_categories', subCategorySchema);
export const categoriesModel = mongoose.model('categories', categorySchema);
export const productsModel = mongoose.model('products', ProductSchema);