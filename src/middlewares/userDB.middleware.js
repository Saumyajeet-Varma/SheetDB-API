import mysql from "mysql2/promise"
import masterPool from "../config/masterDB.js"

export const connectUserDB = async (req, res, next) => {

    try {
        const userId = req.user.userId

        const [rows] = await masterPool.query(
            "SELECT database_name FROM users WHERE id = ?",
            [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const dbName = rows[0].database_name;

        const userDb = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName
        })

        req.userDb = userDb;

        next();

    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        })
    }
};