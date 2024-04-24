import { Router, Request, Response } from "express";
import logger from "../lib/logger";
import FermentedController from "./controllers/fermented.controller";

const routes = Router();
const fermentedctrl = new FermentedController();

routes.post("/createProduct", async (req: Request, res: Response) =>{
    const  producto = req.body;
    try {
        const response = await fermentedctrl.createProduct(producto);
        return res.status(response.code).json(response);
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err);
    }
});

routes.get('/find_Products/:per_page/:page', async(req: Request, res: Response) => {
    const { per_page }: any = req.params
    const { page }: any = req.params
    try {
        const response = await fermentedctrl.findProducts(Number(per_page), Number(page))
        return res.status( response.code ).json( response )
    } catch(err: any) {
        return res.status(err.code ? err.code : 500).json(err)
    }
})

routes.get("/get_product_by_id/:id", async (req:  Request, res: Response) =>{
    const id = req.params.id;
    try {
        const response = await fermentedctrl.getProductbyid(id)
        return res.status(response.code).json(response);
    } catch (err : any) {
        return res.status(err.code ? err.code : 500).json(err);
    }
});

routes.put("/updateProduct/:id", async (req: Request, res: Response) =>{
    const product = req.body;
    const id = req.params.id;
    try {
        const response = await fermentedctrl.updateProduct(product, id);
        return res.status(response.code).json(response);
    } catch (err: any) {
        return res.status(err.code ? err.code : 500).json(err);
    }
});

routes.delete("/deleteProduct/:id", async (req: Request, res: Response) =>{
    const id = req.params.id;
    try {
        const response = await fermentedctrl.deleteProduct(id);
        return res.status(response.code).json(response);
    } catch (err : any) {
        return res.status(err.code ? err.code : 500).json(err); 
    }
})

export default routes;
