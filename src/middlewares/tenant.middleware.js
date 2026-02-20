import dotenv from "dotenv"
import mysql from "mysql2/promise"

dotenv.config()

export const resolveTenant = async (req, res, next) => {

    try {
        const tenantId = req.user.tenantId;

        const tenant = await getTenantById(tenantId);

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const tenantDb = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: tenant.database_name,
        });

        req.tenantDb = tenantDb;

        next()
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Tenant resolution failed"
        })
    }
}