import express, { Application } from "express";
import configDB from "./config/db";
import ServerConfig from "./config/server";

export default class Server {
    private app: Application;
    private port: string | number;
    private configs: ServerConfig;
    constructor(port: string | number) {
        this.port = port;
        this.app = express();
        this.configs = new ServerConfig(this.app)
    }
    // server run method
    run(){
        this.configs.configMiddleWare()
        this.configs.configRoutes()
        configDB() 
        this.app.listen(this.port, () => console.log(`app is running on port ${this.port}`))
    }
}