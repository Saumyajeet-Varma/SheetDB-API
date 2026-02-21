import ExcelJS from "exceljs"

export const processExcelFile = async (fileBuffer, tenantDb) => {

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(fileBuffer)

    const createTables = []

    for (const worksheet of workbook.worksheets) {

        const tableName = worksheet.name.toLowerCase().replace(/\s+/g, "_")
        const headerRow = worksheet.getRow(1)
        const columns = headerRow.values.slice(1)

        let createQuery = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (id INT AUTO_INCREMENT PRIMARY_KEY,`

        columns.forEach((col) => {
            createQuery += ` \`${col}\` VARCHAR(255)`
        });

        createQuery += ` created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`

        await tenantDb.query(createQuery)

        const dataRows = []

        worksheet.eachRow((row, rowNumber) => {

            if (rowNumber === 1) {
                return
            }

            const values = row.values.slice(1)
            dataRows.push(values)
        })

        if (dataRows > 0) {

            const placeholders = columns.map(() => "?").join(",")
            const insertQuery = `INSERT INTO \`${tableName}\` (${columns.map((col) => `\`${col}\``).join(",")}) VALUES (${placeholders})`

            for (const row of dataRows) {
                await tenantDb.query(insertQuery, row)
            }
        }

        createTables.push(dataRows)
    }

    return createTables
}