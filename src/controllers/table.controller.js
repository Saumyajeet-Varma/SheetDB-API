export const listTables = async (req, res) => {

    try {
        const [tables] = await req.userDb.query("SHOW TABLES")

        const tableNames = tables.map((row) => Object.values(row)[0])

        res.status(200).json({
            success: true,
            message: "All tables fetched successfully",
            data: {
                tables: tableNames
            }
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Failed to fetch tables"
        });
    }
}

export const getTableData = async (req, res) => {

    try {
        const { tableName } = req.params

        const [rows] = await req.userDb.query(`SELECT * FROM \`${tableName}\``)

        res.status(200).json({
            success: true,
            message: "Table data fetched successfully",
            data: {
                tableData: rows
            }
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "failed to fetch table data"
        })
    }
}

export const saveChanges = async (req, res) => {

    const connection = await req.userDb.getConnection()

    try {
        const { tableName } = req.params
        const { insert = [], update = [], deleteIds = [] } = req.body

        await connection.beginTransaction()

        // INSERT
        for (const row of insert) {

            const columns = Object.keys(row)
            const values = Object.values(row)

            const placeholders = columns.map((col) => "?").join(",")

            const insertQuery = `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(",")}) VALUES (${placeholders})`

            await connection.query(insertQuery, values)
        }

        // UPDATE
        for (const row of update) {

            const { _id, ...fields } = row

            const columns = Object.keys(fields)
            const values = Object.values(fields)

            const setClause = columns.map(col => `\`${col}\` = ?`).join(",");

            const updateQuery = `UPDATE \`${tableName}\` SET ${setClause} WHERE _id = ?`

            await connection.query(updateQuery, [values, _id])
        }

        // DELETE
        for (const id of deleteIds) {

            const deleteQuery = `DELETE FROM \`${tableName}\` WHERE _id = ?`

            await connection.query(deleteQuery, [id])
        }

        await connection.commit()
        connection.release()

        res.status(200).json({
            success: true,
            message: "changes saved"
        })
    }
    catch (err) {

        await connection.rollback()
        connection.release()

        console.error(err)
        res.status(500).json({
            success: false,
            message: "failed to save changes"
        })
    }
}