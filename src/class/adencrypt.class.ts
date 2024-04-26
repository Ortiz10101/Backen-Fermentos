import config from "config"
import crypto from "crypto"

export default class Encryption{
    private algorithm: string = 'aes-256-cbc';
    private key: string = '52d726b159902f9884b2e95dfcb028ce8d7aa51865f1fb5daa105dc30120cddf';


    async encryptPassword(password: string){
        const generator = crypto.randomBytes(16)
        const keyBuffer = Buffer.from(this.key, 'hex')

        const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, generator)
        let encrypted = cipher.update(password)
        encrypted = Buffer.concat([encrypted, cipher.final()])

        return{
            salt: generator.toString('hex'),
            passwordEncrypted: encrypted.toString('hex')
        }
    }
}