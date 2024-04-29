import jwt from "jsonwebtoken";

export default class jwtClass{
    private keyJWT = "2oN0xdvX8yxcW1clh6xBIrk6diIaRIPBlCIczblHgo01nat8Kv";

    async generateToken(payloadUser: any){
        const token = jwt.sign(payloadUser, this.keyJWT,{expiresIn: '1hr', algorithm: 'HS512'})
        return token
    }

    async tokenExp(token:string){
        const payload64 = token.split('.')[1]
        const payloadUser = JSON.parse(atob(payload64))
        const currentDate = Math.floor(Date.now() / 1000)
        const { exp } = payloadUser
        return exp > currentDate
    }
}