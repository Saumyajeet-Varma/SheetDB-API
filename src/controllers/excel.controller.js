import { processExcelFile } from "../services/excel.service.js"

export const uploadExcelController = async (req, res) => {

    try {
        const file = req.file
        const tenantDb = req.tenantDb

        if (!file) {
            res.status(400).json({
                success: false,
                message: "No file uploaded"
            })
        }

        const table = await processExcelFile(file.buffer, tenantDb)

        res.status(200).json({
            success: true,
            meessage: "Excel processed successfully",
            data: { table }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "excel processing failed"
        })
    }
}