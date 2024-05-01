import path from "path"
import csvToJson from "convert-csv-to-json"
import fs from "fs"

export default class CsvUtil{
    async csvToJson(fileCSV: any){
        const { file } = fileCSV
        const dir = path.join(__dirname, '../uploads/csv/book.csv')
        await file.mv(dir)
        let dataJson = csvToJson.parseSubArray('*',',').fieldDelimiter(',').supportQuotedField(true)
        .formatValueByType(true).getJsonFromCsv(dir)

        await fs.promises.unlink(dir)

        return dataJson
    }
}