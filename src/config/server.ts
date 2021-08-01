import express, { Application } from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import authRouter from "../routes/auth";
import dataRouter from "../routes/data";
import expressHandlebars from 'express-handlebars'
import storesRouter from "../routes/stores";

export default class ServerConfig {
    private app: Application;
    constructor(app: Application){
        this.app = app;
    }

    configMiddleWare(){
        dotenv.config()
        this.app.use(express.json())
        this.app.use(cors())
        this.app.engine('handlebars', expressHandlebars());
        this.app.set('view engine', 'handlebars')
    }

    configRoutes(){
        this.app.use('/auth', authRouter)
        this.app.use('/', dataRouter)
        this.app.use('/stores', storesRouter)
    }
}