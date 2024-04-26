import mongoose, { Schema } from "mongoose";
import IFermented from "../interface/fermented.interface";

const fermentedSchema: Schema = new Schema<IFermented>(
    {
        id: { type: String },
        sku: { type: String, unique: true, required: true},
        date_created: { type: String },
        date_expires: { type: String },
        description: { type: String },
        category: { type: String, required: true },
        subcategory: { type: String, required: true },
        capacity: { type: String, required: true}
    },
    {collection: "fermentos"}
);

const Fermentado = mongoose.model('Fermento', fermentedSchema);
export default Fermentado;