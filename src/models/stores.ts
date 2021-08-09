import mongoose, { Document, Model } from 'mongoose';
import { Categories, Product, Store, SubCategories } from '../interfaces/stores.service';

const storeSchema = new mongoose.Schema<Store, Model<Store>>({
    name: String
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
    img: String,
    store_id: String
})

export const storesModel = mongoose.model('stores', storeSchema);
export const subCategoriesModel = mongoose.model('sub_categories', subCategorySchema);
export const categoriesModel = mongoose.model('categories', categorySchema);
export const productsModel = mongoose.model('products', ProductSchema);