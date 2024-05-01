import { NextFunction, Request, Response } from "express";
import IResponse from "../interface/response.interface";
import jwtClass from "../class/jwt.class";

export default class Authenticate{
    async authentication(req: Request, res: Response, next: NextFunction){
        try {
            if(!req.headers.authorization){
                const response: IResponse = {
                    ok: false,
                    message: "La peticion no tiene cabecera de autenticacion",
                    response: null,
                    code: 403
                }
                return res.status(response.code).json(response)
            }
            const token = req.headers.authorization.replace("Bearer ", "") as string
            const jwt = new jwtClass();
            if(!(await jwt.decodeToken(token))){
                const response: IResponse = {
                    ok: false,
                    message: "Token invalido",
                    response: null,
                    code: 403
                }
                return res.status(response.code).json(response)
            }
            next()
        } catch (error) {
            return res.status(400).send({message: error})
        }
    }
}