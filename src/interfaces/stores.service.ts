import { Document } from "mongoose";

export interface Store extends Document {
    name: string,
    img: string,
}

export interface AllStoresRes {
    stores: Store[]
}

export interface StoreTab extends Document {
    name: string,
    store_id: string
}

export interface StoreTabSection extends Document {
    name: string,
    tab_id: string
}

export interface Product extends Document {
    name: string;
    category_id: string;
    img: string;
    price: number;
    rate: number;
    section_id: string,
    sub_category_id: string
}

export interface Categories extends Document {
    name: string,
    img: string,
    _id: string
}

export interface SubCategories extends Document {
    name: string,
    img: string,
    _id: string,
    category_id: string
}