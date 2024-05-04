import logger from "../../lib/logger";
import MongoConn from "../../lib/mongodb";
import Encryption from "../class/adencrypt.class";
import IResponse from "../interface/response.interface";
import IUser from "../interface/user.interface";
import User from "../models/user.model";
import HttpServer from "../class/server.class";
import jwtClass from "../class/jwt.class";
import Fermentado from "../models/fermented.model";

export default class userController {
    // se crean los amodificadores privados
    private server: HttpServer;
    private connection = null;
    private encryption: Encryption;
    private jwt: jwtClass
    //se crea el constructor
    constructor() {
        this.server = HttpServer.instance;
        this.encryption = new Encryption();
        this.jwt = new jwtClass
    }
    //CRUD para crear, actualizar, eliminar, buscar usuario y leer todos los usuarios

    //Crear  usuario
    async createUser(user: IUser): Promise<IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection
            const { salt, passwordEncrypted } = await this.encryption.encryptPassword(user.password);
            user.salt = salt;
            user.password = passwordEncrypted;
            const userCreated = await User.create(user);
            return { ok: true, message: "User created", response: userCreated, code: 201 };
        } catch (err) {
            logger.error(`[UserController/createUser] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection);
        }
    }
    //login de usuarios
    async login(user: IUser): Promise<IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection
            const userFind = await User.findOne({ email: user.email }) as any
            if (!userFind) {
                return { ok: false, message: "user not found", response: null, code: 404 }
            }
            const validatePassword = await this.encryption.desencryptPassword(userFind, user.password)
            if (!validatePassword) {
                return { ok: false, message: "email or password incorrect", response: null, code: 400 }
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
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }
    //Buscar todos los usuarios
    async findAllUsers(per_page: number, page: number): Promise<IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection
            const total = await User.countDocuments()
            const Users = await User.find().limit(per_page).skip(per_page * (page - 1));

            if (!Users || Users.length < 1) {
                return { ok: false, message: 'there are no users available!', response: null, code: 404, }
            }

            const response = {
                users: Users,
                total: total,
            }
            return { ok: true, message: 'Users found!', response: response, code: 200, }

        } catch (err) {
            logger.error(`[UserController/findAllUsers] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection);
        }
    }
    //obtener un usuario por su email
    async getUserByEmail(email: string): Promise<IResponse> {
        try {
            this.connection = this.server.app.locals.dbConnection;
            const user = await User.findOne({ email })
            return { ok: true, message: "User found!", response: user, code: 200 }
        } catch (err) {
            logger.error(`[UserController/findUserByEmail] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }
    //actualizar usuario
    async updateUser(user: IUser): Promise <IResponse>{
        try {
            this.connection = this.server.app.locals.dbConnection;
            const usuario = await User.findOneAndUpdate({ email: user.email }, user, {
                returnDocument: "after",
                select: "-salt -password",
            })
            if (!usuario) {
                return ({ ok: false, message: "user does not found", response: null, code: 404 });
            }
            return ({ ok: true, message: "user updated", response: usuario, code: 200 });
   
        } catch (err) {
            logger.error(`[UserController/updateUser] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }
    //borrar usuario
    async deleteUser(email: string): Promise <IResponse>{
        try {
            const userDeleted = await User.findOneAndDelete({email: email}, { select: "-salt -password" });

          if (!userDeleted) {
            return ({
              ok: false,
              message: `user with email ${email} does not exist`,
              response: null,
              code: 404,
            });
          }

          return ({ ok: true, message: "user deleted", response: userDeleted, code: 200 });
        } catch (err) {
            logger.error(`[UserController/deleteUser] ${err}`);
            return { ok: false, message: "Error ocurred", response: err, code: 500 };
        } finally {
            if (this.connection) await this.server.app.locals.dbConnection.release(this.connection)
        }
    }
}