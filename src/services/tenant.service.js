import masterPool from "../config/masterDB.js";

export const registerTenantService = async (name) => {

    const dbName = `sheetdb_tenant_${name.toLowerCase().replace(/\s+/g, "_")}`

    await masterPool.query(
        `CREATE DATABASE \`${dbName}\``
    )

    const [result] = await masterPool.query(
        "INSERT INTO tenants (name, database_name) VALUES (?, ?)",
        [name, dbName]
    )

    return {
        tenantId: result.insertId,
        database: dbName
    }
}

export const getTenantById = async (tenantId) => {

    const [rows] = await masterPool.query(
        "SELECT * FROM tenants WHERE id = ?",
        [tenantId]
    )

    return rows[0]
}