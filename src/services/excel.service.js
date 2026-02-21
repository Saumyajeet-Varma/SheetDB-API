import ExcelJS from "exceljs"

export const processExcelFile = async (fileBuffer, userDb) => {

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(fileBuffer)

    const createdTables = []

    for (const worksheet of workbook.worksheets) {

        const tableName = worksheet.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
        const headerRow = worksheet.getRow(1)
        const columns = headerRow.values.slice(1).filter(Boolean)

        if (columns.length === 0) {
            continue;
        }

        const columnDefinitions = ["id INT AUTO_INCREMENT PRIMARY KEY"]

        columns.forEach((col) => {
            const safeCol = col.toString().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
            columnDefinitions.push(`\`${safeCol}\` VARCHAR(255)`);
        })

        columnDefinitions.push("created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

        const createQuery = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columnDefinitions.join(",")});`

        await userDb.query(createQuery);

        const dataRows = [];

        worksheet.eachRow((row, rowNumber) => {

            if (rowNumber === 1) {
                return;
            }

            const values = row.values.slice(1);

            if (values.length > 0) {
                dataRows.push(values);
            }
        });

        if (dataRows > 0) {

            const placeholders = columns.map(() => "?").join(",")
            const safeColumns = columns.map((col) => `\`${col.toString().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}\``).join(",");
            const insertQuery = `INSERT INTO \`${tableName}\` (${safeColumns}) VALUES (${placeholders})`

            for (const row of dataRows) {
                await userDb.query(insertQuery, row)
            }
        }

        createdTables.push(tableName)
    }

    return {
        tablesCreated: createdTables
    }
}