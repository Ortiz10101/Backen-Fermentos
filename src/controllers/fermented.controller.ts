import logger from "../../lib/logger";
import HttpServer from "../class/server.class";
import IResponse from "../interface/response.interface";
import IFermented from "../interface/fermented.interface";
import fermentedModel from "../models/fermented.model";
import Fermentado from "../models/fermented.model";

export default class FermentedController {
    private server: HttpServer;
    private connection = null;

    constructor() {
        this.server = HttpServer.instance;
    }

    /*CRUD Basico Fermentos la santa */
    
    async createProduct(fermento: IFermented): Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection;
            const producto = await Fermentado.create(fermento);
            return { ok: true, message: "Product created", response: producto, code: 201 };
        } catch (err) {
          logger.error(`[FermentedController/createProduct] ${err}`);
          return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if ( this.connection ) await this.server.app.locals.dbConnection.release(this.connection)
          }
    }

    async readProduct(id: string): Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection;
            const producto = await Fermentado.findById(id)
            return { ok: true, message: "Product found", response: producto, code: 200 };
        } catch (err) {
            logger.error(`[FermentedController/readProduct] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if ( this.connection ) await this.server.app.locals.dbConnection.release(this.connection)
          }
    }

    async updateProduct(product: IFermented, id: string): Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection;
            const producto = await Fermentado.findByIdAndUpdate(id, 
                product, {returnDocument: "after",});
            return {
                ok: true,
                message: "Product Updated",
                response: producto,
                code: 201,
            };
            
        } catch (err) {
            logger.error(`[FermentedController/updateProduct] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if ( this.connection ) await this.server.app.locals.dbConnection.release(this.connection)
          }
    }

    async deleteProduct(id: string): Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection;
            const producto = await Fermentado.findByIdAndDelete(id);
            return {
                ok: true,
                message: "Product deleted ",
                response: producto,
                code: 200,
            }  
        } catch (err) {
            logger.error(`[FermentedController/deleteProduct] ${err}`);
            return { ok: false, message:"Error ocurred", response: err, code: 500};
            
        } finally {
            if ( this.connection ) await this.server.app.locals.dbConnection.release(this.connection)
          }
    }
    
}
