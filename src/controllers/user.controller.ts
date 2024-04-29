import logger from "../../lib/logger";
import MongoConn from "../../lib/mongodb";
import Encryption from "../class/adencrypt.class";
import IResponse from "../interface/response.interface";
import IUser from "../interface/user.interface";
import User from "../models/user.model";
import HttpServer from "../class/server.class";
import jwtClass from "../class/jwt.class";

export default class userController{
    private server: HttpServer;
    private connection = null;
    private encryption:Encryption;
    private jwt : jwtClass

    constructor(){
        this.server = HttpServer.instance;
        this.encryption = new Encryption();
        this.jwt = new jwtClass
    }

    async createUser(user: IUser): Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection
            const { salt, passwordEncrypted} = await this.encryption.encryptPassword(user.password);
            user.salt = salt;
            user.password = passwordEncrypted;
            const userCreated = await User.create(user);
            return { ok: true, message: "User created", response: userCreated, code: 201 };
        } catch (err) {
            logger.error(`[UserController/createUser] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        }  finally{
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection);
        }
    }

    async login (user: IUser) : Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection
            const userFind = await User.findOne({email: user.email}) as any
            if(!userFind){
                return {ok: false, message:"user not found", response: null, code: 404}
            }
            const validatePassword = await this.encryption.desencryptPassword(userFind, user.password)
            if(!validatePassword){
                return {ok: false, message:"email or password incorrect", response: null, code: 400}
            }
            const payloadUser = {
                id: userFind._id,
                name: userFind.name,
                email: userFind.email,
                role: userFind.role
            }

            const token = await this.jwt.generateToken(payloadUser)

            return { ok: true, message: "User found", response: userFind, code: 201, token: token };

        } catch (err) {
            logger.error(`[UserController/login] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        }  finally{
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }

    async findAllUsers(per_page: number, page: number): Promise<IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection
            const Users = await User.find().limit(per_page).skip(per_page * (page - 1));

            if (!Users || Users.length < 1) {
                return { ok: false, message: 'thera are no users available!', response: null, code: 404, }
            }
            return { ok: true, message: 'Users found!', response: Users, code: 200, }
            
        } catch (err) {
            logger.error(`[UserController/findAllUsers] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };  
        } finally{
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection);
        }
    }

}