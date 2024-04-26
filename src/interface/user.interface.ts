export default interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    salt?: string;
    role: string;
}