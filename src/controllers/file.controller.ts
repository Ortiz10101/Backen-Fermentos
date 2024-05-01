import IResponse from "../interface/response.interface";
import CsvUtil from "../utils/csv.util";
import HttpServer from "../class/server.class";
import Fermentado from "../models/fermented.model";

export default class FileController {
    private server: HttpServer;
    private connection = null;
    private csvUtil: CsvUtil;

    constructor() {
        this.csvUtil = new CsvUtil();
        this.server = HttpServer.instance;
    }

    async massiveLoad(fileCSV: any): Promise<IResponse> {
        try {
            if (!fileCSV) {
                return { ok: false, message: "No file uploaded", response: null, code: 400 }
            }
            const { file } = fileCSV
            if (!(file.mimetype === "text/csv")) {
                return { ok: false, message: "this file is not CSV", response: null, code: 400 }
            }
            let productosSave = []
            let productosUpdate = []
            this.connection = this.server.app.locals.dbConnection;
            const productos = await this.csvUtil.csvToJson(fileCSV)
            for (let fermento of productos){
                const fermentoFind = await Fermentado.findOne({sku: fermento.sku})
                if (!fermentoFind){
                    const producto = await Fermentado.create(fermento);
                    productosSave.push(producto)
                }
                else {
                    const productUpdate = await Fermentado.findByIdAndUpdate(fermentoFind._id, fermento)
                    productosUpdate.push(productUpdate)
                }
            }
            const fermentoResponse = {
                productosSave, 
                productosUpdate
            }
            return { ok: true, message: "file uploaded!", response: fermentoResponse, code: 201 }

        } catch (err) {
            return { ok: false, message: "Error ocurred", response: null, code: 500 }
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }
}